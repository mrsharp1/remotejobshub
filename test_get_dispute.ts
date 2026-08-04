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
    console.log("Executing Admin Dispute Details query...");
    
    const { data, error } = await supabase
        .from('disputes')
        .select(
          '*, order:orders(*, listing:listings(*), buyer:profiles!orders_buyer_id_fkey(*), seller:profiles!orders_seller_id_fkey(*)), opened_by_profile:profiles!disputes_opened_by_fkey(*), admin:profiles!disputes_admin_id_fkey(*)'
        )
        .eq('id', '123e4567-e89b-12d3-a456-426614174000')
        .single();
        
    console.log("Error:", error?.message || error);
    console.log("Data length:", data ? 1 : 0);
}

test();
