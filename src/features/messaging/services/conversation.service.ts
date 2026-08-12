import { supabase } from '@/lib/supabase'
import type { ConversationViewModel } from '@/types'
import { notificationService } from '@/features/notifications/services'

export const mapToViewModel = (conv: any, authUid: string, forceIsAdmin: boolean = false): ConversationViewModel => {
  const parts = conv.participants || conv.conversation_participants_v2 || []
  
  let isViewerAdmin = forceIsAdmin
  const viewerParticipant = parts.find((p: any) => p.user_id === authUid)
  if (viewerParticipant?.profile?.role === 'admin') {
    isViewerAdmin = true
  }

  let otherParticipant = null
  if (conv.type === 'support') {
    // For support conversations, the relevant identity is the customer (non-admin)
    otherParticipant = parts.find((p: any) => p.profile?.role !== 'admin')
    if (!otherParticipant) {
      otherParticipant = parts.find((p: any) => p.user_id !== authUid) || parts[0]
    }
  } else {
    otherParticipant = parts.find((p: any) => p.user_id !== authUid)
    if (!otherParticipant && parts.length > 0) {
      otherParticipant = parts[0]
    }
  }

  if (import.meta.env.DEV) {
    console.log("===== MAP TO VIEW MODEL =====")
    console.log("AUTH UID:", authUid)
    console.log("RAW CONVERSATION:", conv)
    console.log("PARTICIPANTS:", parts)
    console.log("OTHER PARTICIPANT:", otherParticipant)
    console.log("PROFILE:", otherParticipant?.profile)
    console.log("=============================")
  }

  const profile = otherParticipant?.profile || null
  const isSupportView = conv.type === 'support' && !isViewerAdmin
  
  let name = 'Unknown Customer'
  if (isSupportView) {
    name = 'Support Team'
  } else if (profile) {
    name = profile.full_name || profile.email || 'Unknown Customer'
  }

  let isPinned = false
  let isArchived = false
  try {
    const pinned = JSON.parse(localStorage.getItem('pinned_conversations') || '[]')
    const archived = JSON.parse(localStorage.getItem('archived_conversations') || '[]')
    isPinned = pinned.includes(conv.id)
    isArchived = archived.includes(conv.id)
  } catch (e) {
    // Ignore
  }

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
    updated_at: conv.updated_at,
    isPinned,
    isArchived
  }
}

export const conversationService = {
  async getConversation(id: string, userId: string): Promise<ConversationViewModel | null> {
    try {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single()
      const isAdmin = profile?.role === 'admin'

      const { data, error } = await supabase
        .from('conversations_v2')
        .select('*, listing:listings(*), order:orders(*), dispute:disputes(*), participants:conversation_participants_v2(*, profile:profiles!conversation_participants_v2_user_id_fkey(*))')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return null
      
      return mapToViewModel(data, userId, isAdmin)
    } catch (err) {
      console.error('Error in getConversation:', err)
      return null
    }
  },

  async getConversations(userId: string): Promise<ConversationViewModel[]> {
    try {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single()
      const isAdmin = profile?.role === 'admin'

      const { data: participations, error } = await supabase
        .from('conversation_participants_v2')
        .select('conversation_id')
        .eq('user_id', userId)

      if (error) throw error
      
      const conversationIds = participations ? participations.map((p) => p.conversation_id) : []

      let query = supabase
        .from('conversations_v2')
        .select('*, listing:listings(*), order:orders(*), dispute:disputes(*), participants:conversation_participants_v2(*, profile:profiles!conversation_participants_v2_user_id_fkey(*))')

      if (isAdmin) {
        const orConditions = ['type.eq.support']
        if (conversationIds.length > 0) {
          orConditions.push(`id.in.(${conversationIds.join(',')})`)
        }
        query = query.or(orConditions.join(','))
      } else {
        if (conversationIds.length === 0) return []
        query = query.in('id', conversationIds)
      }

      const { data: convs } = await query
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })

      if (!convs) return []

      const viewModels = convs.map(c => mapToViewModel(c, userId, isAdmin))

      return viewModels
    } catch (err) {
      console.error('Error in getConversations:', err)
      return []
    }
  },

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

      // Notify the participant (seller or the other user) that a new conversation started
      await notificationService.createNotification({
        user_id: participantId,
        type: 'system',
        title: 'New Conversation',
        message: 'A new conversation has been started with you.',
        link: '/dashboard/messages',
        metadata: { conversationId: conversation.id }
      })

      return mapToViewModel(newConv, initiatorId)
    } catch (err) {
      console.error('Error in createConversation:', err)
      throw err
    }
  },

  async archiveConversation(id: string): Promise<void> {
    try {
      const archived = JSON.parse(localStorage.getItem('archived_conversations') || '[]')
      if (!archived.includes(id)) {
        archived.push(id)
        localStorage.setItem('archived_conversations', JSON.stringify(archived))
      } else {
        const index = archived.indexOf(id)
        archived.splice(index, 1)
        localStorage.setItem('archived_conversations', JSON.stringify(archived))
      }
    } catch (e) { console.error(e) }
  },

  async pinConversation(id: string): Promise<void> {
    try {
      const pinned = JSON.parse(localStorage.getItem('pinned_conversations') || '[]')
      if (!pinned.includes(id)) {
        pinned.push(id)
        localStorage.setItem('pinned_conversations', JSON.stringify(pinned))
      } else {
        const index = pinned.indexOf(id)
        pinned.splice(index, 1)
        localStorage.setItem('pinned_conversations', JSON.stringify(pinned))
      }
    } catch (e) { console.error(e) }
  },

  async createSupportConversation(userId: string): Promise<ConversationViewModel> {
    try {
      // 1. Find existing support conversation for this user
      const { data: existingConvs } = await supabase
        .from('conversations_v2')
        .select('id, *, participants:conversation_participants_v2(*, profile:profiles!conversation_participants_v2_user_id_fkey(*)), listing:listings(*), order:orders(*), dispute:disputes(*)')
        .eq('type', 'support')
        .order('created_at', { ascending: false })

      if (existingConvs && existingConvs.length > 0) {
        // Iterate to explicitly verify the user is a participant (avoiding any RLS/caching blind spots)
        for (const conv of existingConvs) {
          const parts = conv.participants || []
          const hasUser = parts.some((p: any) => p.user_id === userId)
          if (hasUser) {
            if (conv.is_archived) {
              throw new Error("Critical Error: The canonical support conversation is archived. Please contact administration.")
            }
            return mapToViewModel(conv, userId)
          }
        }
      }

      // 2. Create new global support conversation
      const convPayload: any = { type: 'support', created_by: userId, id: crypto.randomUUID() }
      
      const { error: convError } = await supabase
        .from('conversations_v2')
        .insert([convPayload])

      if (convError) throw convError

      // 3. Add only the customer as participant
      const { error: partError } = await supabase
        .from('conversation_participants_v2')
        .insert([
          { conversation_id: convPayload.id, user_id: userId, role: 'member' }
        ])

      if (partError) throw partError

      // Fetch newly created conversation with participant profile
      return (await this.getConversation(convPayload.id, userId)) as ConversationViewModel
    } catch (err) {
      console.error('Error creating support conversation:', err)
      throw err
    }
  }
}
