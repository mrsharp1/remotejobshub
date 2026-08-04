import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '';
let supabaseKey = '';

envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts[0] === 'VITE_SUPABASE_URL') supabaseUrl = parts[1].trim();
    if (parts[0] === 'VITE_SUPABASE_ANON_KEY') supabaseKey = parts[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log("Executing Admin Disputes query...");
    
    const { data, error } = await supabase
        .from('disputes')
        .select(
          '*, order:orders(*, listing:listings(*)), opened_by_profile:profiles!disputes_opened_by_fkey(*), admin:profiles!disputes_admin_id_fkey(*)'
        )
        .order('created_at', { ascending: false });
        
    console.log("Error:", error?.message || error);
    console.log("Data length:", data?.length);
}

test();
