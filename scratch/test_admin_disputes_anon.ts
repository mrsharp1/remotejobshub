import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '';
let anonKey = '';

envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts[0] === 'VITE_SUPABASE_URL') supabaseUrl = parts[1].trim();
    if (parts[0] === 'VITE_SUPABASE_ANON_KEY') anonKey = parts[1].trim();
});

const supabase = createClient(supabaseUrl, anonKey);

async function check() {
    console.log("Executing exact Admin Disputes query as Anon...");
    const { data, error } = await supabase
        .from('disputes')
        .select(
          '*, order:orders(*, listing:listings(*)), opened_by_profile:profiles!disputes_opened_by_fkey(*), admin:profiles!disputes_admin_id_fkey(*)'
        )
        .order('created_at', { ascending: false });
        
    if (error) {
        console.log("POSTGREST ERROR:");
        console.log(JSON.stringify(error, null, 2));
    } else {
        console.log("POSTGREST SUCCESS.");
        console.log("Returned Rows:", data?.length);
    }
}

check();
