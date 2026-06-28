import { supabase } from '@/lib/supabase'
import { Conversation, Message } from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'

export const messageService = {
  async createConversation(
    listingId: string | null,
    buyerId: string,
    sellerId: string
  ): Promise<Conversation> {
    try {
      // 1. Check if conversation already exists for this listing and buyer/seller
      const { data: existingParticipant } = await supabase
        .from('conversation_participants')
        .select('conversation_id, conversation:conversations(*)')
        .eq('user_id', buyerId)

      if (existingParticipant) {
        for (const p of existingParticipant) {
          const conv = p.conversation as unknown as Conversation
          if (conv && conv.listing_id === listingId) {
            // Check if seller is also in this conversation
            const { data: sellerPart } = await supabase
              .from('conversation_participants')
              .select('id')
              .eq('conversation_id', p.conversation_id)
              .eq('user_id', sellerId)
              .maybeSingle()

            if (sellerPart) {
              return conv as Conversation
            }
          }
        }
      }

      // 2. Insert new conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert([{ listing_id: listingId }])
        .select()
        .single()

      if (convError) throw convError

      // 3. Add participants
      const { error: partError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: buyerId },
          { conversation_id: conversation.id, user_id: sellerId },
        ])

      if (partError) throw partError

      return conversation as Conversation
    } catch (err) {
      console.error('Error in createConversation:', err)
      throw err
    }
  },

  async sendMessage(
    conversationId: string,
    senderId: string,
    text: string,
    fileUrl?: string | null
  ): Promise<Message> {
    try {
      // 1. Insert message
      const { data: message, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: senderId,
            message_text: text,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // 2. Insert attachment if exists
      if (fileUrl) {
        await supabase.from('message_attachments').insert([
          {
            message_id: message.id,
            file_url: fileUrl,
            file_name: fileUrl.split('/').pop() || 'attachment',
            file_type: 'image',
          },
        ])
      }

      // 3. Notify other participants
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId)
        .neq('user_id', senderId)

      if (participants) {
        for (const p of participants) {
          await notificationService.createNotification({
            user_id: p.user_id,
            title: 'New Message Received 💬',
            message: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
            type: 'system',
            reference_type: 'order', // default order reference or placeholder
            reference_id: conversationId,
          })
        }
      }

      return message as Message
    } catch (err) {
      console.error('Error in sendMessage:', err)
      throw err
    }
  },

  async getConversation(id: string): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*, listing:listings(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Conversation
    } catch (err) {
      console.error('Error in getConversation:', err)
      return null
    }
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      // Fetch participant connections
      const { data: participations, error } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId)

      if (error) throw error
      if (!participations || participations.length === 0) return []

      const conversationIds = participations.map((p) => p.conversation_id)

      // Fetch conversations details with participants and profiles
      const { data: convs } = await supabase
        .from('conversations')
        .select('*, listing:listings(*)')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false })

      const conversationsWithParticipants: Conversation[] = []
      if (convs) {
        for (const c of convs) {
          const { data: parts } = await supabase
            .from('conversation_participants')
            .select('*, profile:profiles(*)')
            .eq('conversation_id', c.id)

          conversationsWithParticipants.push({
            ...c,
            participants: parts || [],
          } as Conversation)
        }
      }

      return conversationsWithParticipants
    } catch (err) {
      console.error('Error in getConversations:', err)
      return []
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles(*)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Append attachments
      const messagesWithAttachments: Message[] = []
      if (data) {
        for (const m of data) {
          const { data: attachs } = await supabase
            .from('message_attachments')
            .select('*')
            .eq('message_id', m.id)

          messagesWithAttachments.push({
            ...m,
            attachments: attachs || [],
          } as Message)
        }
      }

      return messagesWithAttachments
    } catch (err) {
      console.error('Error in getMessages:', err)
      return []
    }
  },

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      // 1. Clear unread counts for current participant
      await supabase
        .from('conversation_participants')
        .update({ unread_count: 0, last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)

      // 2. Mark messages as read where sender is not current user
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
    } catch (err) {
      console.error('Error in markAsRead:', err)
    }
  },

  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ) {
    return supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const { data: sender } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.sender_id)
            .single()

          // Check attachments
          const { data: attachs } = await supabase
            .from('message_attachments')
            .select('*')
            .eq('message_id', payload.new.id)

          callback({
            ...payload.new,
            sender: sender || undefined,
            attachments: attachs || [],
          } as Message)
        }
      )
      .subscribe()
  },
}
