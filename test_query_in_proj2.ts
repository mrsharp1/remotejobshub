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
    console.log("Executing Admin Dashboard query with disambiguation...");
    // Let's pretend to log in as the admin user. But wait, I don't have the password.
    // Let's just execute as anonymous. Wait, as anonymous we get zero rows because of RLS on orders!
    // But the exact failure we are analyzing is the HTTP 400!
    
    const { data, error } = await supabase
        .from('orders')
        .select('*, buyer:profiles!orders_buyer_id_fkey(*), seller:profiles!orders_seller_id_fkey(*)')
        .order('created_at', { ascending: false });
        
    console.log("Error:", error?.message || error);
    console.log("Data length:", data?.length);
}

test();
