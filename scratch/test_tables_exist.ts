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

async function checkTables() {
    const tables = [
        'conversations',
        'conversation_participants',
        'messages',
        'message_attachments',
        'order_messages',
        'dispute_messages'
    ];

    console.log("VERIFYING TABLES ON LIVE DB...");

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        console.log(`\nTable: public.${table}`);
        if (error) {
            console.log("Error Code:", error.code);
            console.log("Error Message:", error.message);
            if (error.code === '42P01' || error.message.includes('does not exist')) {
                console.log("Exists: NO");
            } else {
                console.log("Exists: PROBABLY YES (Error was RLS or other: " + error.message + ")");
            }
        } else {
            console.log("Exists: YES");
            console.log("Rows returned:", data?.length);
        }
    }
}

checkTables();
