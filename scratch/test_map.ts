import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data: participations, error: pError } = await supabase
    .from('conversation_participants_v2')
    .select('*')
    
  if (pError) {
    console.error("pError", pError)
    return
  }

  const { data: convs, error } = await supabase
    .from('conversations_v2')
    .select('*, participants:conversation_participants_v2(*, profile:profiles!conversation_participants_v2_user_id_fkey(*))')
    .limit(1)

  if (error) {
    console.error("error", error)
    return
  }
  
  console.log("ALL Participations:", participations.length);
  console.log("Convs Length:", convs?.length);

  if (convs && convs.length > 0) {
    const conv = convs[0]
    const parts = conv.participants || conv.conversation_participants_v2 || []
    
    // Pick the first one
    let otherParticipant = parts[0]

    console.log("===== MAP TO VIEW MODEL =====");
    console.log("Conversation ID:", conv.id);
    console.log("Participants:", JSON.stringify(parts, null, 2));
    console.log("Other Participant:", JSON.stringify(otherParticipant || null, null, 2));
    console.log("Profile:", JSON.stringify(otherParticipant?.profile || null, null, 2));
  }
}
run()
