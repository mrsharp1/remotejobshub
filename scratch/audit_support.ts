import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY // using service role to see everything
const supabase = createClient(supabaseUrl, supabaseKey)

async function runAudit() {
  console.log("=== PHASE 4A FORENSIC AUDIT ===")
  
  // Find seller "FRIDAY CHIMOBI" to use as test user
  const { data: users, error: userErr } = await supabase
    .from('profiles')
    .select('*')
    .ilike('full_name', '%friday%')
  
  if (!users || users.length === 0) {
    console.log("No seller found matching 'friday'")
    return
  }
  const sellerId = users[0].id
  console.log(`Auditing Support Conversations for Seller: ${users[0].full_name} (${sellerId})`)

  // Get all support conversations for this user
  const { data: parts, error: partsErr } = await supabase
    .from('conversation_participants_v2')
    .select('conversation_id, conversations_v2!inner(id, type, created_at)')
    .eq('user_id', sellerId)
    .eq('conversations_v2.type', 'support')
    .order('conversations_v2(created_at)', { ascending: false })

  if (partsErr) {
    console.error("Error fetching participants:", partsErr)
    return
  }

  const convIds = parts.map((p: any) => p.conversation_id)
  console.log(`\nFound ${convIds.length} support conversations for this user.`)

  // Fetch full details of these conversations
  const { data: convs, error: convErr } = await supabase
    .from('conversations_v2')
    .select(`
      id,
      created_at,
      participants:conversation_participants_v2(user_id, role, profile:profiles(full_name, role)),
      messages:messages_v2(id, created_at, sender_id, message_text)
    `)
    .in('id', convIds)
    .order('created_at', { ascending: false })

  if (convErr) {
    console.error("Error fetching conversations:", convErr)
    return
  }

  convs.forEach((conv, index) => {
    console.log(`\n--- Conversation ${index + 1} ---`)
    console.log(`ID: ${conv.id}`)
    console.log(`Created: ${conv.created_at}`)
    console.log(`Participants: ${conv.participants.map((p:any) => p.profile.full_name + ' (' + p.profile.role + ')').join(', ')}`)
    
    const msgs = conv.messages || []
    // sort messages by created_at ascending
    msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    
    console.log(`Total Messages: ${msgs.length}`)
    if (msgs.length > 0) {
      console.log(`Latest Message: [${msgs[msgs.length - 1].created_at}] ${msgs[msgs.length - 1].message_text}`)
    }
  })
}

runAudit().catch(console.error)

