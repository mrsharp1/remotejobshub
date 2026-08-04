const fs = require('fs');
const path = require('path');

const typesPath = 'src/types/index.ts';
const typesContent = fs.readFileSync(typesPath, 'utf8');

const migrationsPath = 'supabase/migrations';
const migrationFiles = fs.readdirSync(migrationsPath);
const allMigrations = migrationFiles.map(f => fs.readFileSync(path.join(migrationsPath, f), 'utf8')).join('\n').toLowerCase();

// We know from previous commands the exact list of tables.
const allTables = [
  'automation_audit_logs', 'automation_jobs', 'blocked_devices', 'broadcasts',
  'cms_audit_log', 'cms_careers', 'cms_events', 'cms_policies', 'cms_revisions',
  'cms_success_stories', 'cms_testimonials', 'cms_timeline_milestones',
  'conversation_participants', 'conversations', 'coupon_redemptions', 'coupons',
  'dispute_evidence', 'dispute_messages', 'disputes', 'favorites', 'fraud_flags',
  'homepage_stats', 'listing_images', 'listing_tags', 'listing_views', 'listings',
  'login_history', 'message_attachments', 'messages', 'notification_preferences',
  'notifications', 'order_messages', 'order_timeline', 'orders', 'payments',
  'profiles', 'promotions', 'referral_rewards', 'referrals', 'reviews',
  'risk_scores', 'saved_searches', 'seller_revenue_agreements', 'seller_verifications',
  'suspicious_activities', 'verification_audit_logs', 'verification_documents',
  'wallet_transactions', 'wallets', 'withdrawal_requests'
];

const missingTables = allTables.filter(t => !allMigrations.includes('create table ' + t) && !allMigrations.includes('create table public.' + t) && !allMigrations.includes('create table if not exists ' + t) && !allMigrations.includes('create table if not exists public.' + t));

console.log(missingTables);
