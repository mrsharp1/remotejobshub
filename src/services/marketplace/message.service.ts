import { supabase } from '@/lib/supabase'
import { Message, ConversationViewModel } from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'

const mapToViewModel = (conv: any, authUid: string): ConversationViewModel => {
  const parts = conv.participants || conv.conversation_participants_v2 || []
  let otherParticipant = parts.find((p: any) => p.user_id !== authUid)
  if (!otherParticipant && parts.length > 0) {
    otherParticipant = parts[0]
  }

  console.log("===== MAP TO VIEW MODEL =====")
  console.log("AUTH UID:", authUid)
  console.log("RAW CONVERSATION:", conv)
  console.log("PARTICIPANTS:", parts)
  console.log("OTHER PARTICIPANT:", otherParticipant)
  console.log("PROFILE:", otherParticipant?.profile)
  console.log("=============================")

  const profile = otherParticipant?.profile || null
  const isSupport = conv.type === 'support' || profile?.role === 'admin'
  const name = isSupport 
    ? 'Support Team' 
    : (profile?.full_name || profile?.username || profile?.email || 'Deleted User')

  return {
    id: conv.id,
    type: conv.type,
    otherUser: {
      id: otherParticipant?.user_id || 'unknown',
      full_name: name,
      username: profile?.username || null,
      email: profile?.email || null,
      avatar_url: profile?.avatar_url || null,
      role: profile?.role || 'user',
      online: profile?.online ?? false
    },
    lastMessage: conv.messages?.[0] || null,
    unreadCount: 0,
    listing: conv.listing,
    order: conv.order,
    dispute: conv.dispute,
    created_at: conv.created_at,
    updated_at: conv.updated_at
  }
}

export const messageService = {
  async createConversation(
    type: 'listing' | 'order' | 'dispute' | 'support',
    referenceId: string | null,
    initiatorId: string,
    participantId: string
  ): Promise<ConversationViewModel> {
    try {
      // 1. Check if conversation already exists for this reference and participants
      let query = supabase.from('conversations_v2').select('id, *, participants:conversation_participants_v2(*, profile:profiles!conversation_participants_v2_user_id_fkey(*)), listing:listings(*), order:orders(*), dispute:disputes(*)').eq('type', type)
      
      if (type === 'listing' && referenceId) query = query.eq('listing_id', referenceId)
      if (type === 'order' && referenceId) query = query.eq('order_id', referenceId)
      if (type === 'dispute' && referenceId) query = query.eq('dispute_id', referenceId)

      const { data: existingConvs } = await query

      if (existingConvs && existingConvs.length > 0) {
        for (const conv of existingConvs) {
          const parts = conv.participants || []
          const hasInitiator = parts.some((p: any) => p.user_id === initiatorId)
          const hasParticipant = parts.some((p: any) => p.user_id === participantId)
          if (hasInitiator && hasParticipant) {
            return mapToViewModel(conv, initiatorId)
          }
        }
      }

      // 2. Insert new conversation
      const convPayload: any = { type, created_by: initiatorId }
      if (type === 'listing' && referenceId) convPayload.listing_id = referenceId
      if (type === 'order' && referenceId) convPayload.order_id = referenceId
      if (type === 'dispute' && referenceId) convPayload.dispute_id = referenceId

      convPayload.id = crypto.randomUUID();
      const { error: convError } = await supabase
        .from('conversations_v2')
        .insert([convPayload])

      const conversation = { id: convPayload.id }

      if (convError) throw convError

      // 3. Add participants sequentially to avoid RLS race condition
      const { data: { user } } = await supabase.auth.getUser()
      const authUid = user?.id

      const firstUserId = authUid === participantId ? participantId : initiatorId
      const secondUserId = authUid === participantId ? initiatorId : participantId

      const { error: firstPartError } = await supabase
        .from('conversation_participants_v2')
        .insert([{ conversation_id: conversation.id, user_id: firstUserId, role: 'participant' }])

      if (firstPartError) {
        await supabase.from('conversations_v2').delete().eq('id', conversation.id)
        throw firstPartError
      }

      const { error: secondPartError } = await supabase
        .from('conversation_participants_v2')
        .insert([{ conversation_id: conversation.id, user_id: secondUserId, role: 'participant' }])

      if (secondPartError) {
        await supabase.from('conversations_v2').delete().eq('id', conversation.id)
        throw secondPartError
      }

      const { data: newConv } = await supabase
        .from('conversations_v2')
        .select('*, participants:conversation_participants_v2(*, profile:profiles!conversation_participants_v2_user_id_fkey(*)), listing:listings(*), order:orders(*), dispute:disputes(*)')
        .eq('id', conversation.id)
        .single()

      return mapToViewModel(newConv, initiatorId)
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
      const { data: message, error } = await supabase
        .from('messages_v2')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: senderId,
            message_text: text,
            message_type: fileUrl ? 'image' : 'text',
            is_system: false
          },
        ])
        .select()
        .single()

      if (error) throw error

      if (fileUrl) {
        await supabase.from('message_attachments_v2').insert([
          {
            message_id: message.id,
            file_url: fileUrl,
            file_name: fileUrl.split('/').pop() || 'attachment',
            file_type: 'image',
          },
        ])
      }
      
      // Update last_message_id on conversation safely
      await supabase.from('conversations_v2').update({ last_message_id: message.id }).eq('id', conversationId)

      const { data: participants } = await supabase
        .from('conversation_participants_v2')
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
            reference_type: 'conversation',
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

  async createSystemMessage(
    conversationId: string,
    targetUserId: string | null,
    eventType: string,
    payload: any
  ): Promise<Message> {
    try {
      let text = `System Event: ${eventType}`
      if (eventType === 'PAYMENT_RECEIVED') text = `Payment of ${payload.amount} securely received in Escrow.`
      if (eventType === 'ESCROW_LOCKED') text = `Escrow locked. Seller is preparing credentials.`
      if (eventType === 'CREDENTIALS_UPLOADED') text = `Credentials securely uploaded to the vault.`
      if (eventType === 'VERIFICATION_STARTED') text = `Security verification started on credentials.`
      if (eventType === 'VERIFICATION_COMPLETED') text = `Security verification completed successfully.`
      if (eventType === 'ESCROW_RELEASED') text = `Escrow funds of ${payload.amount} successfully released to Seller.`
      
      const { data: message, error } = await supabase
        .from('messages_v2')
        .insert([{
          conversation_id: conversationId,
          sender_id: targetUserId,
          message_text: text,
          message_type: 'system',
          is_system: true,
          event_type: eventType,
          event_payload: payload
        }])
        .select()
        .single()

      if (error) throw error
      
      await supabase.from('conversations_v2').update({ last_message_id: message.id }).eq('id', conversationId)

      return message as Message
    } catch (err) {
      console.error('Error in createSystemMessage:', err)
      throw err
    }
  },

  async getConversation(id: string, userId: string): Promise<ConversationViewModel | null> {
    try {
      const { data, error } = await supabase
        .from('conversations_v2')
        .select('*, listing:listings(*), order:orders(*), dispute:disputes(*), participants:conversation_participants_v2(*, profile:profiles!conversation_participants_v2_user_id_fkey(*))')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return null
      
      return mapToViewModel(data, userId)
    } catch (err) {
      console.error('Error in getConversation:', err)
      return null
    }
  },

  async getConversations(userId: string): Promise<ConversationViewModel[]> {
    try {
      const { data: participations, error } = await supabase
        .from('conversation_participants_v2')
        .select('conversation_id')
        .eq('user_id', userId)

      if (error) throw error
      if (!participations || participations.length === 0) return []

      const conversationIds = participations.map((p) => p.conversation_id)

      const { data: convs } = await supabase
        .from('conversations_v2')
        .select('*, listing:listings(*), order:orders(*), dispute:disputes(*), participants:conversation_participants_v2(*, profile:profiles!conversation_participants_v2_user_id_fkey(*))')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false })

      if (!convs) return []

      const viewModels = convs.map(c => mapToViewModel(c, userId))

      return viewModels
    } catch (err) {
      console.error('Error in getConversations:', err)
      return []
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages_v2')
        .select('*, sender:profiles(*)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      const messagesWithAttachments: Message[] = []
      if (data) {
        for (const m of data) {
          const { data: attachs } = await supabase
            .from('message_attachments_v2')
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
      await supabase
        .from('conversation_participants_v2')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)
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
          table: 'messages_v2',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          let sender = null
          if (payload.new.sender_id) {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', payload.new.sender_id)
              .single()
            sender = data
          }

          const { data: attachs } = await supabase
            .from('message_attachments_v2')
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

