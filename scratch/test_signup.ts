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
    const email = `buyer_${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log("Signup error:", error?.message);
    console.log("Session:", data.session ? "Active" : "None");
}

check();
