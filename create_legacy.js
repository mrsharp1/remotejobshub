import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function createLegacyVerification() {
  // Get an existing user
  const { data: users, error: err1 } = await supabase.from('profiles').select('id, full_name, phone, country').limit(1);
  if (err1 || !users || users.length === 0) {
    console.log("No users found");
    return;
  }
  const user = users[0];

  const { data: sv, error: err2 } = await supabase
    .from('seller_verifications')
    .insert([
      {
        user_id: user.id,
        document_type: 'government_id',
        status: 'pending',
        // Legacy: NO date_of_birth
        // Legacy: NO residential_address (if before 4I)
      }
    ])
    .select()
    .single();

  if (err2) {
    console.error("Error inserting sv:", err2);
    return;
  }

  const { error: err3 } = await supabase
    .from('verification_documents')
    .insert([
      {
        verification_id: sv.id,
        file_url: 'https://example.com/id.jpg',
        file_type: 'image/jpeg'
      }
    ]);
    
  if (err3) {
    console.error("Error inserting doc:", err3);
  } else {
    console.log("Legacy verification created:", sv.id);
  }
}

createLegacyVerification();
