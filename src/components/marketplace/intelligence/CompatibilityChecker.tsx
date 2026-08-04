import React from 'react'
import {
  Globe,
  Shield,
  Phone,
  Wifi,
  MonitorCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Laptop,
} from 'lucide-react'

interface CompatibilityCheckerProps {
  platform: string
  country: string
  className?: string
}

interface PlatformRule {
  vpnRequired: boolean
  vpnNote: string
  identityRequired: boolean
  phoneRequired: boolean
  twoFANote: string
  restrictions: string[]
  recommendedSetup: string[]
  supportedRegions: string[]
}

const PLATFORM_RULES: Record<string, PlatformRule> = {
  Upwork: {
    vpnRequired: false,
    vpnNote:
      "Avoid VPN — Upwork flags IP inconsistencies. Log in from the seller's original country first.",
    identityRequired: true,
    phoneRequired: true,
    twoFANote:
      '2FA must be changed gradually. Reset authenticator app before changing phone number.',
    restrictions: [
      'Cannot operate two accounts from same device',
      'Identity re-verification may be triggered',
      'JSS score is public — protect account standing',
    ],
    recommendedSetup: [
      'Use original country IP for first login',
      'Create fresh browser profile',
      'Change password before email',
      'Notify clients of "name change" if needed',
    ],
    supportedRegions: [
      'Global',
      'Restricted in some countries — check Upwork ToS',
    ],
  },
  Fiverr: {
    vpnRequired: false,
    vpnNote:
      "Use a residential IP matching the original account's registered country.",
    identityRequired: true,
    phoneRequired: true,
    twoFANote:
      'Reset 2FA authenticator immediately. Use an authenticator app, not SMS.',
    restrictions: [
      'One account per person policy — do not link old Fiverr accounts',
      'Seller level is attached to seller performance — preserve gig stats',
    ],
    recommendedSetup: [
      'Fresh browser profile recommended',
      'Import cookies provided by seller for first session',
      'Change account email last, after password',
    ],
    supportedRegions: ['Global (190+ countries supported)'],
  },
  Freelancer: {
    vpnRequired: false,
    vpnNote:
      'Minimal IP sensitivity. Residential proxy acceptable for first 72 hours.',
    identityRequired: true,
    phoneRequired: false,
    twoFANote: 'No mandatory 2FA — but recommended for account security.',
    restrictions: [
      'Profile photo change may trigger manual review',
      'Employment history edits may reduce profile score temporarily',
    ],
    recommendedSetup: [
      'Update bio before profile photo',
      'Set new payment method within 48 hours',
      'Respond to bids promptly to maintain activity score',
    ],
    supportedRegions: ['Global'],
  },
  Toptal: {
    vpnRequired: false,
    vpnNote:
      'Toptal accounts are linked to individual identity. Verify transfer legality.',
    identityRequired: true,
    phoneRequired: true,
    twoFANote: 'Mandatory 2FA. Reset authenticator immediately upon access.',
    restrictions: [
      'Transfer may require Toptal approval',
      'Very high identity scrutiny',
      'Requires ongoing performance maintenance',
    ],
    recommendedSetup: [
      'Contact Toptal support post-transfer for account name update',
      'Pass screening interviews if required',
      'Keep existing client relationships intact',
    ],
    supportedRegions: ['Global — Selective per skill category'],
  },
  default: {
    vpnRequired: false,
    vpnNote:
      "Use a residential IP from the seller's country for the first login session.",
    identityRequired: true,
    phoneRequired: true,
    twoFANote:
      'Reset 2FA credentials immediately after receiving account access.',
    restrictions: [
      'Avoid triggering platform security alerts by logging in gradually',
      'Change credentials in this order: Password → 2FA → Email → Phone',
    ],
    recommendedSetup: [
      'Fresh browser profile',
      'Original country IP first',
      'Update payment info within 48 hours',
    ],
    supportedRegions: ['Platform-specific — verify with seller'],
  },
}

function getPlatformRules(platform: string): PlatformRule {
  return PLATFORM_RULES[platform] || PLATFORM_RULES['default']
}

export const CompatibilityChecker: React.FC<CompatibilityCheckerProps> = ({
  platform,
  country,
  className = '',
}) => {
  const rules = getPlatformRules(platform)

  return (
    <div
      className={`space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm dark:bg-card ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 border-primary/20 flex h-10 w-10 items-center justify-center rounded-xl border">
          <Laptop className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-heading text-base font-bold text-foreground">
            Compatibility Guide
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {platform} • {country}
          </p>
        </div>
      </div>

      {/* Quick Requirements */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className={`rounded-xl border p-3 text-center ${rules.vpnRequired ? 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10' : 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'}`}
        >
          <Wifi
            className={`mx-auto mb-1 h-5 w-5 ${rules.vpnRequired ? 'text-amber-600' : 'text-emerald-600'}`}
          />
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            VPN
          </p>
          <p
            className={`mt-0.5 text-xs font-bold ${rules.vpnRequired ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}
          >
            {rules.vpnRequired ? 'Required' : 'Not Required'}
          </p>
        </div>
        <div
          className={`rounded-xl border p-3 text-center ${rules.identityRequired ? 'border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10' : 'border-slate-200 bg-slate-50 dark:bg-slate-800/50'}`}
        >
          <Shield
            className={`mx-auto mb-1 h-5 w-5 ${rules.identityRequired ? 'text-blue-600' : 'text-slate-400'}`}
          />
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Identity
          </p>
          <p
            className={`mt-0.5 text-xs font-bold ${rules.identityRequired ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500'}`}
          >
            {rules.identityRequired ? 'Required' : 'Optional'}
          </p>
        </div>
        <div
          className={`rounded-xl border p-3 text-center ${rules.phoneRequired ? 'border-violet-200 bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/10' : 'border-slate-200 bg-slate-50 dark:bg-slate-800/50'}`}
        >
          <Phone
            className={`mx-auto mb-1 h-5 w-5 ${rules.phoneRequired ? 'text-violet-600' : 'text-slate-400'}`}
          />
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Phone
          </p>
          <p
            className={`mt-0.5 text-xs font-bold ${rules.phoneRequired ? 'text-violet-700 dark:text-violet-400' : 'text-slate-500'}`}
          >
            {rules.phoneRequired ? 'Required' : 'Optional'}
          </p>
        </div>
      </div>

      {/* VPN Note */}
      <div className="rounded-xl border border-border bg-slate-50 p-4 dark:bg-slate-800/50">
        <div className="flex items-start gap-2">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="mb-1 text-xs font-bold text-foreground">
              IP & Login Guidance
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {rules.vpnNote}
            </p>
          </div>
        </div>
      </div>

      {/* 2FA Note */}
      <div className="rounded-xl border border-border bg-slate-50 p-4 dark:bg-slate-800/50">
        <div className="flex items-start gap-2">
          <MonitorCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="mb-1 text-xs font-bold text-foreground">
              Two-Factor Authentication
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {rules.twoFANote}
            </p>
          </div>
        </div>
      </div>

      {/* Restrictions */}
      {rules.restrictions.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Platform Restrictions
          </p>
          <div className="space-y-1.5">
            {rules.restrictions.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span className="text-muted-foreground">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Setup */}
      {rules.recommendedSetup.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Recommended Setup
          </p>
          <div className="space-y-1.5">
            {rules.recommendedSetup.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span className="font-medium text-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supported Regions */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Supported Regions
        </p>
        <div className="flex flex-wrap gap-1.5">
          {rules.supportedRegions.map((region, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-foreground dark:bg-slate-800"
            >
              <Globe className="h-2.5 w-2.5 text-primary" />
              {region}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
        <p>
          Remote Jobs Hub does not guarantee platform ToS compliance for
          third-party account transfers. Buyer assumes responsibility for
          platform policies.
        </p>
      </div>
    </div>
  )
}
