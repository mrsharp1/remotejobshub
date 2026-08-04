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
    console.log("Executing Admin Dashboard query...");
    const { data, error } = await supabase
        .from('orders')
        .select('*, buyer:profiles(*), seller:profiles(*)')
        .order('created_at', { ascending: false });
        
    console.log("Error:", error?.message || error);
    console.log("Data length:", data?.length);
    if (data && data.length > 0) {
        console.log("First order buyer:", data[0].buyer);
    }
}

test();
