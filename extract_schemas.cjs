const fs = require('fs');

const typesPath = 'src/types/index.ts';
const content = fs.readFileSync(typesPath, 'utf8');

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

// Helper to convert snake_case/camelCase interfaces if needed
// Usually the interface name is Singular PascalCase (e.g., profiles -> Profile)
function toPascal(str) {
  // strip trailing s
  let s = str.replace(/s$/, '');
  if (str === 'cms_success_stories') s = 'cms_success_story';
  if (str === 'cms_policies') s = 'cms_policy';
  if (str === 'fraud_flags') s = 'fraud_flag';
  
  return s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

let report = '# Missing Tables Extracted from Types\n\n';

for (const t of missing) {
  let interfaceName = toPascal(t);
  if (t === 'profiles') interfaceName = 'Profile';
  if (t === 'reviews') interfaceName = 'Review';
  if (t === 'disputes') interfaceName = 'Dispute';
  
  const regex = new RegExp(`export interface ${interfaceName} \\{([\\s\\S]*?)\\}`, 'm');
  const match = content.match(regex);
  if (match) {
    report += `## ${t} (${interfaceName})\n\`\`\`ts\n${match[1].trim()}\n\`\`\`\n\n`;
  } else {
    report += `## ${t}\n(No interface found for ${interfaceName})\n\n`;
  }
}

fs.writeFileSync('missing_schemas_report.md', report);
console.log('Wrote missing_schemas_report.md');
