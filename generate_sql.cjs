const fs = require('fs');

const typesContent = fs.readFileSync('src/types/index.ts', 'utf8');

const missing = [
  'automation_audit_logs', 'automation_jobs', 'blocked_devices', 'broadcasts',
  'cms_audit_log', 'cms_careers', 'cms_events', 'cms_policies', 'cms_revisions',
  'cms_success_stories', 'cms_testimonials', 'cms_timeline_milestones',
  'conversation_participants', 'conversations', 'coupon_redemptions', 'coupons',
  'dispute_evidence', 'dispute_messages', 'disputes', 'fraud_flags',
  'homepage_stats', 'listing_views', 'login_history', 'message_attachments',
  'messages', 'notification_preferences', 'order_messages', 'profiles',
  'promotions', 'referral_rewards', 'referrals', 'reviews', 'risk_scores',
  'saved_searches', 'suspicious_activities', 'withdrawal_requests'
];

function toPascal(str) {
  let s = str.replace(/s$/, '');
  if (str === 'cms_success_stories') s = 'cms_success_story';
  if (str === 'cms_policies') s = 'cms_policy';
  if (str === 'fraud_flags') s = 'fraud_flag';
  return s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function typeToSql(tsType) {
  if (tsType.includes('number')) return 'NUMERIC';
  if (tsType.includes('boolean')) return 'BOOLEAN';
  if (tsType.includes('Date')) return 'TIMESTAMPTZ';
  if (tsType.includes('string[]')) return 'TEXT[]';
  return 'TEXT';
}

let sql = `-- Backend Completion Migration\n\n`;

for (const t of missing) {
  let interfaceName = toPascal(t);
  if (t === 'profiles') interfaceName = 'Profile';
  if (t === 'reviews') interfaceName = 'Review';
  if (t === 'disputes') interfaceName = 'Dispute';
  
  const regex = new RegExp(`export interface ${interfaceName} \\{([\\s\\S]*?)\\}`, 'm');
  const match = typesContent.match(regex);
  
  sql += `CREATE TABLE IF NOT EXISTS public.${t} (\n`;
  sql += `    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n`;

  if (match) {
    const lines = match[1].split('\n').map(l => l.trim()).filter(l => l && !l.includes('?:') && !l.startsWith('id:') && !l.includes('Profile') && !l.includes('Listing') && !l.includes('Order'));
    for (const l of lines) {
      if (l.includes(':')) {
        let [name, type] = l.split(':').map(s => s.trim().replace(/;$/, ''));
        if (name === 'created_at' || name === 'updated_at') {
          sql += `    ${name} TIMESTAMPTZ DEFAULT now(),\n`;
        } else if (name.endsWith('_id')) {
          sql += `    ${name} UUID,\n`;
        } else {
          let stype = typeToSql(type);
          sql += `    ${name} ${stype},\n`;
        }
      }
    }
  } else {
    sql += `    created_at TIMESTAMPTZ DEFAULT now()\n`;
  }
  
  sql = sql.replace(/,\n$/, '\n');
  sql += `);\n\n`;
  sql += `ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY;\n\n`;
}

fs.writeFileSync('C:\\Users\\Friday Chimobi\\.gemini\\antigravity\\brain\\1d7ab0e5-7124-4ea7-96ef-8dbfd422c5b5\\backend_completion.sql', sql);
console.log('SQL generated.');
