import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data, error } = await supabase
    .from('conversations_v2')
    .select('*, listing:listings(*), order:orders(*), dispute:disputes(*), participants:conversation_participants_v2(*, profile:profiles!conversation_participants_v2_user_id_fkey(*))')
    .limit(1)

  if (error) {
    console.error(error)
    return
  }

  console.log("RAW CONVERSATION")
  console.log(JSON.stringify(data[0], null, 2))
}

main()
