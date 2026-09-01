import { supabase } from '@/lib/supabase'
import type { Message } from '@/types'
export const messageService = {
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
        for (const _ of participants) {
          // No operation for now – placeholder for future notification logic
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

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages_v2')
        .select('*, sender:profiles(*)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Fetch participants to determine seen status
      const { data: parts } = await supabase
        .from('conversation_participants_v2')
        .select('user_id, last_read_at')
        .eq('conversation_id', conversationId)

      const messagesWithAttachments: Message[] = []
      if (data) {
        for (const m of data) {
          const { data: attachs } = await supabase
            .from('message_attachments_v2')
            .select('*')
            .eq('message_id', m.id)

          // Determine status
          let status: 'sent' | 'seen' = 'sent'
          const otherParticipant = parts?.find(p => p.user_id !== m.sender_id)
          if (otherParticipant && otherParticipant.last_read_at) {
            const readAt = new Date(otherParticipant.last_read_at)
            const msgDate = new Date(m.created_at)
            if (readAt >= msgDate) {
              status = 'seen'
            }
          }

          messagesWithAttachments.push({
            ...m,
            attachments: attachs || [],
            status
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

  broadcastTyping(conversationId: string, userId: string) {
    try {
      supabase.channel(`typing:${conversationId}`).send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId }
      })
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Failed to broadcast typing', e)
      }
    }
  },

  subscribeToTyping(conversationId: string, callback: (userId: string) => void) {
    return supabase.channel(`typing:${conversationId}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        callback(payload.payload.userId)
      })
      .subscribe()
  }
}
