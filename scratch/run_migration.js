const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

const envContent = fs.readFileSync('.env', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=')
  if (key && val) {
    env[key.trim()] = val.join('=').trim().replace(/^"|"$/g, '')
  }
})

// Can't run raw SQL easily via supabase-js without an RPC. 
// However, earlier we did use node pg or something similar?
