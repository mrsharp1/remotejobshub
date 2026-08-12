const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

const envContent = fs.readFileSync('.env', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=')
  if (key && val) {
    env[key.trim()] = val.join('=').trim().replace(/^"|"$/g, '')
  }
})

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_SERVICE_ROLE_KEY)

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
    .select('id, created_at, created_by, participants:conversation_participants_v2(user_id, role, profile:profiles(email, role))')
    .eq('type', 'support')
    .order('created_at', { ascending: false })
    .limit(5)

  console.log(`\nLatest 5 support conversations:`)
  convs?.forEach(c => {
    console.log(`ID: ${c.id}`)
    console.log(`Created By: ${c.created_by}`)
    c.participants.forEach(p => {
      console.log(`  Participant: ${p.profile?.email} (${p.profile?.role}) ID: ${p.user_id}`)
    })
  })
}

runAudit().catch(console.error)

