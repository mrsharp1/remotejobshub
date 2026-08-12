import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // need service role to bypass RLS

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  console.log("Starting historical duplicate support audit...")
  
  // 1. Fetch all support conversations with participants, profiles, messages, and attachments
  const { data: convs, error: convError } = await supabase
    .from('conversations_v2')
    .select(`
      id,
      type,
      status,
      created_at,
      updated_at,
      participants:conversation_participants_v2 (
        user_id,
        role,
        profile:profiles (
          id,
          role,
          full_name,
          email
        )
      ),
      messages:messages_v2 (
        id,
        sender_id,
        content,
        created_at,
        updated_at,
        attachments:message_attachments_v2 (
          id
        )
      )
    `)
    .eq('type', 'support')
    
  if (convError) {
    console.error("Error fetching conversations:", convError)
    process.exit(1)
  }
  
  console.log(`Found ${convs.length} support conversations.`)
  
  const customerMap = new Map<string, any[]>()
  const singleCustomerCount = { count: 0 }
  const missingCustomer = []
  const multipleCustomers = []
  
  for (const conv of convs) {
    // Find the customer participant
    const customers = conv.participants.filter((p: any) => p.profile && p.profile.role !== 'admin')
    
    if (customers.length === 0) {
      missingCustomer.push(conv)
      continue
    }
    
    if (customers.length > 1) {
      // Check if they are actually the SAME user just added twice?
      const uniqueCustomerIds = new Set(customers.map((c: any) => c.user_id))
      if (uniqueCustomerIds.size > 1) {
        multipleCustomers.push(conv)
        continue
      }
    }
    
    const customer = customers[0].profile
    const customerId = customer.id
    
    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, [])
    }
    
    // Sort messages by created_at desc to find latest
    const sortedMessages = [...conv.messages].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const latestMessage = sortedMessages.length > 0 ? sortedMessages[0] : null
    const attachmentCount = conv.messages.reduce((sum: number, m: any) => sum + (m.attachments ? m.attachments.length : 0), 0)
    
    customerMap.get(customerId)!.push({
      id: conv.id,
      customer,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      status: conv.status, // check if status column exists
      messages: conv.messages,
      messageCount: conv.messages.length,
      latestMessage,
      attachmentCount,
      participantCount: conv.participants.length
    })
  }
  
  // Sort and identify duplicates
  const results = {
    totalCustomersAudited: customerMap.size,
    customersWithDuplicates: 0,
    customersWithSingle: 0,
    duplicates: [] as any[],
    missingCustomer,
    multipleCustomers
  }
  
  for (const [customerId, convs] of customerMap.entries()) {
    if (convs.length === 1) {
      results.customersWithSingle++
      continue
    }
    
    results.customersWithDuplicates++
    
    // Determine canonical
    convs.sort((a, b) => {
      // 1. Most recent message
      const aTime = a.latestMessage ? new Date(a.latestMessage.created_at).getTime() : 0
      const bTime = b.latestMessage ? new Date(b.latestMessage.created_at).getTime() : 0
      if (aTime !== bTime) return bTime - aTime
      
      // 2. Most recently updated
      const aUp = new Date(a.updated_at).getTime()
      const bUp = new Date(b.updated_at).getTime()
      if (aUp !== bUp) return bUp - aUp
      
      // 3. Most recently created
      const aCr = new Date(a.created_at).getTime()
      const bCr = new Date(b.created_at).getTime()
      return bCr - aCr
    })
    
    const canonical = convs[0]
    const duplicates = convs.slice(1)
    
    results.duplicates.push({
      customer: canonical.customer,
      canonical,
      duplicates
    })
  }
  
  // Also check if we can update conversation_id on messages_v2
  console.log("Checking if messages_v2 allows conversation_id updates...")
  // We'll write this audit report to an artifact
  
  let markdown = `# Phase 5A: Forensic Audit of Support Conversations\n\n`
  markdown += `## Summary\n`
  markdown += `- Total Support Customers Audited: ${results.totalCustomersAudited}\n`
  markdown += `- Customers with Single Conversation: ${results.customersWithSingle}\n`
  markdown += `- Customers with Duplicates: ${results.customersWithDuplicates}\n`
  markdown += `- Support Conversations Missing Customer: ${missingCustomer.length}\n`
  markdown += `- Support Conversations with Multiple Customers: ${multipleCustomers.length}\n`
  
  markdown += `\n## Schema Check\n`
  const { data: convSample } = await supabase.from('conversations_v2').select('*').limit(1).single()
  markdown += `\`conversations_v2\` columns: ${Object.keys(convSample || {}).join(', ')}\n`
  markdown += `Has \`status\` column for archiving? ${Object.keys(convSample || {}).includes('status') ? 'YES' : 'NO'}\n`
  
  markdown += `\n## Customers with Duplicates\n`
  
  if (results.duplicates.length === 0) {
    markdown += `No duplicates found.\n`
  } else {
    markdown += `| Customer | Customer ID | Canonical Conversation | Duplicate Conversation | Messages | Latest Message | Attachments |\n`
    markdown += `|---|---|---|---|---:|---|---|\n`
    
    for (const d of results.duplicates) {
      const customerName = d.customer.full_name || d.customer.email || 'Unknown'
      
      // Print canonical row
      markdown += `| **${customerName}** | \`${d.customer.id}\` | \`${d.canonical.id}\` (Canonical) | - | ${d.canonical.messageCount} | ${d.canonical.latestMessage ? d.canonical.latestMessage.created_at : 'None'} | ${d.canonical.attachmentCount} |\n`
      
      // Print duplicate rows
      for (const dup of d.duplicates) {
         markdown += `| | | | \`${dup.id}\` | ${dup.messageCount} | ${dup.latestMessage ? dup.latestMessage.created_at : 'None'} | ${dup.attachmentCount} |\n`
      }
    }
  }
  
  markdown += `\n## Special Cases (Review Required)\n`
  if (missingCustomer.length > 0) {
    markdown += `### Missing Customer Participant\n`
    missingCustomer.forEach((c: any) => markdown += `- Conversation \`${c.id}\`: Participants = ${JSON.stringify(c.participants.map((p: any) => p.profile?.role))}\n`)
  }
  if (multipleCustomers.length > 0) {
    markdown += `### Multiple Customer Participants\n`
    multipleCustomers.forEach((c: any) => markdown += `- Conversation \`${c.id}\`: Participants = ${JSON.stringify(c.participants.map((p: any) => p.user_id))}\n`)
  }
  
  fs.writeFileSync('phase5_audit_report.md', markdown)
  console.log("Audit complete. Report written to phase5_audit_report.md")
}

run().catch(console.error)
