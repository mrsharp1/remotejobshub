import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function main() {
    const { data: verifs, error: vErr } = await supabase.from('seller_verifications').select('*').limit(1)
    console.log("seller_verifications columns:", vErr ? vErr : (verifs.length > 0 ? Object.keys(verifs[0]) : "No data, but success!"))
    
    // Check if inserting without selfie_url fails
    const { error: insErr } = await supabase.from('seller_verifications').insert({
        user_id: '00000000-0000-0000-0000-000000000001',
        document_type: 'passport'
    })
    console.log("Insert result (should fail on NOT NULL or foreign key):", insErr)
}

main()
