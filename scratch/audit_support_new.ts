import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!)

async function runAudit() {
  console.log("=== PHASE 4C FORENSIC AUDIT ===")

  // Find admins
  const { data: admins } = await supabase.from('profiles').select('id, full_name, email').eq('role', 'admin')
  console.log(`\nFound ${admins?.length} admins in database.`)
  admins?.forEach(a => console.log(`- Admin: ${a.full_name} (${a.email}) ID: ${a.id}`))

  // Find the first admin that createSupportConversation would pick
  const { data: firstAdmin } = await supabase.from('profiles').select('id, email').eq('role', 'admin').limit(1).single()
  console.log(`\ncreateSupportConversation picks Admin ID: ${firstAdmin?.id} (${firstAdmin?.email})`)

  // Check recent support conversations
  const { data: convs } = await supabase
    .from('conversations_v2')
    .select('id, created_at, participants:conversation_participants_v2(user_id, role, profile:profiles(email, role))')
    .eq('type', 'support')
    .order('created_at', { ascending: false })
    .limit(5)

  console.log(`\nLatest 5 support conversations:`)
  convs?.forEach(c => {
    console.log(`ID: ${c.id}`)
    c.participants.forEach((p:any) => {
      console.log(`  Participant: ${p.profile.email} (${p.profile.role}) ID: ${p.user_id}`)
    })
  })
}

runAudit().catch(console.error)

