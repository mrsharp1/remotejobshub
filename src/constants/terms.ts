/**
 * Remote Jobs Hub - Canonical Terms and Conditions
 *
 * Source of Truth: Client-Supplied Terms & Conditions (April 2026 — v2.0)
 *
 * This module exports the immutable, canonical text of the Terms and Conditions
 * presented to buyers at checkout, along with its version, draft status,
 * historical version registry, and cryptographic SHA-256 fingerprint.
 */

export interface TermsSubsection {
  heading?: string
  content?: string
  bullets?: string[]
  footer?: string
}

export interface TermsSection {
  id: string
  title: string
  isNotice?: boolean
  content: string
  bullets?: string[]
  subsections?: TermsSubsection[]
  footer?: string
}

export const TERMS_VERSION = '2026-04-v2.0'
export const PREVIOUS_TERMS_VERSION = '2026-04-v1.0'
export const PREVIOUS_TERMS_DOCUMENT_HASH = 'b7bd68bd6144eec5b791ce9c9c714809dc8a3dd42d89334dee4bbc9efd8ccd35'
export const TERMS_TITLE = 'Remote Jobs Hub Terms and Conditions'
export const TERMS_LAST_UPDATED = 'April 2026'
export const TERMS_STATUS: 'published' | 'draft' | 'archived' = 'draft'

export const TERMS_PREAMBLE =
  'By accessing this page, clicking the “Chat Me” button, communicating with the Service Provider or a Vendor, making any payment, or joining the community, you (“Client”) confirm that you have read, understood, and agreed to these Terms and Conditions.'

export const CLIENT_ACKNOWLEDGEMENT_STATEMENT =
  'I confirm that I have had the opportunity to read these Terms and Conditions. I understand that they form a binding agreement between me and the Service Provider/Brand. I understand the refund policy and agree to comply with these Terms before making payment.'

/**
 * Standard, immutable affirmative statement required from the buyer at checkout.
 * Validated by server-side acceptance preparation RPC.
 */
export const EXPECTED_CONSENT_AFFIRMATION = `I explicitly accept the Remote Jobs Hub Terms and Conditions version ${TERMS_VERSION} and agree to be legally bound thereby.`

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: 'section-1-definitions',
    title: '1. 📌 DEFINITIONS',
    content: 'For the purpose of these Terms:',
    bullets: [
      '“Service Provider” refers to the individual or entity providing guidance, mentorship, support, community access, or related services.',
      '“Client” refers to any person who engages with, pays for, or uses the services.',
      '“Vendor” refers to an individual or third party who lists or offers an account or opportunity through the website/community.',
      '“Services” refers to guidance, mentorship, setup assistance, community access, account-related information, and information regarding remote job opportunities.',
      '“Listed Account” refers to an account or account opportunity advertised or listed on the website by a Vendor.',
    ],
  },
  {
    id: 'section-2-nature-of-service',
    title: '2. 📌 NATURE OF SERVICE',
    content:
      'The Service Provider offers educational guidance, mentorship, community access, and setup assistance relating to remote AI-based job opportunities.\n\nThis service may include support across up to three (3) different remote job platforms, depending on availability, eligibility, and regional accessibility.\n\nThese platforms may include, but are not limited to, Outlier AI or similar platforms in the remote AI and digital work industry.\n\nThe Service Provider is not an employee, agent, or official representative of any third-party platform mentioned.',
  },
  {
    id: 'section-3-no-employment-guarantee',
    title: '3. ⚠️ NO EMPLOYMENT OR PARTNERSHIP GUARANTEE',
    content: 'By using this service, the Client acknowledges that:',
    bullets: [
      'The service does not guarantee employment with any company or platform.',
      'No formal employment contract is created between the Client and any platform.',
      'The Service Provider does not control hiring decisions, account approvals, or platform acceptance systems.',
    ],
    footer: 'All platform decisions remain solely with the respective companies.',
  },
  {
    id: 'section-4-no-platform-guarantee',
    title: '4. ⚠️ NO GUARANTEE OF SPECIFIC PLATFORM ACCESS',
    content: 'The Client understands and agrees that:',
    bullets: [
      'Access to any specific platform or account is not guaranteed.',
      'Platform availability may vary based on:',
      'Country or regional restrictions',
      'Account verification policies',
      'Platform internal decisions',
      'Technical or system limitations',
      'Availability of suitable accounts or opportunities',
    ],
    footer:
      'The Client is paying for guidance, support, community access, and available opportunities, and not for guaranteed access to any particular platform or account unless expressly stated otherwise.',
  },
  {
    id: 'section-5-multiple-opportunity-structure',
    title: '5. 💼 MULTIPLE OPPORTUNITY STRUCTURE',
    content:
      'The service may provide access to up to three (3) remote job opportunities or platforms, depending on eligibility and availability.',
    bullets: [
      'If one platform is not accessible, alternative opportunities may be provided where available.',
      'Final platform access depends on eligibility and applicable platform requirements.',
      'Available opportunities may change at any time.',
      'The Service Provider reserves the right to modify available options without prior notice.',
    ],
  },
  {
    id: 'section-6-account-listings-vendors-availability',
    title: '6. 🏷️ ACCOUNT LISTINGS, VENDORS & AVAILABILITY',
    content:
      'Some accounts or opportunities displayed on the website may be listed by Vendors.\n\nA Client understands and agrees that:',
    bullets: [
      'A Vendor may list an account or account opportunity that is not currently available for immediate delivery.',
      'In such cases, the Vendor may need to source, obtain, or arrange the relevant account or opportunity for the Client after payment.',
      'The fact that an account is listed on the website does not necessarily mean that the account is immediately available at the exact time of purchase.',
      'Estimated availability may depend on the Vendor’s ability to source or arrange the account.',
      'The Client understands that sourcing or arranging an account may take additional time.',
      'The Service Provider and/or Vendor does not guarantee a specific delivery timeframe unless a timeframe has been expressly communicated and agreed upon.',
    ],
    subsections: [
      {
        heading: '6.1 Account Information',
        content:
          'Where the Client pays for a listed account or account opportunity, the Client may receive information regarding the current status of the account.\n\nFor clarity, the term “account information” or “info” does not automatically mean account login details, passwords, email addresses, authentication codes, or other credentials.\n\n“Account information” may refer to information such as:',
        bullets: [
          'Current account status',
          'Whether the account is active or inactive',
          'Current availability/status of the opportunity',
          'Relevant account-related conditions',
          'Other non-credential information communicated by the Vendor',
        ],
        footer:
          'Login credentials or other sensitive account information will only be provided where expressly included in the specific listing or arrangement.',
      },
      {
        heading: '6.2 Vendor-Managed Access',
        content:
          'Where a Vendor offers access to an account or opportunity, the Vendor may add or grant the Client access to the relevant set, group, workspace, or other designated arrangement after payment for the listed account has been completed.\n\nThe exact method of access may vary depending on the Vendor and the nature of the opportunity.',
      },
    ],
  },
  {
    id: 'section-7-fees-and-payment-terms',
    title: '7. 💰 FEES AND PAYMENT TERMS',
    content: '',
    subsections: [
      {
        heading: '7.1 Initial Payment',
        content:
          'A non-refundable fee may be required to begin the service.\n\nDepending on the service selected, the fee may cover:',
        bullets: [
          'Setup guidance',
          'Mentorship and consultation',
          'Community access',
          'Assistance with account preparation',
          'Account-related information',
          'General support throughout onboarding',
          'Access to available opportunities',
        ],
      },
      {
        heading: '7.2 Performance-Based Fee',
        content:
          'Where applicable, a performance-based fee may be payable after the Client receives their first successful payout from a platform.\n\nSuch a fee is considered a service fee for continued support and mentorship and will only apply where expressly communicated to and accepted by the Client.',
      },
    ],
  },
  {
    id: 'section-8-no-income-guarantee',
    title: '8. 🚫 NO INCOME GUARANTEE',
    content: 'The Client acknowledges that:',
    bullets: [
      'Earnings are not guaranteed.',
      'Income varies based on individual effort, platform availability, task completion, platform policies, demand, and other external factors.',
    ],
    subsections: [
      {
        content: 'The Service Provider does not guarantee:',
        bullets: [
          'Any specific income level',
          'Continuous availability of tasks',
          'Long-term access to any platform',
          'A specific number of tasks',
          'A specific payout amount',
        ],
      },
    ],
  },
  {
    id: 'section-9-platform-rules-and-compliance',
    title: '9. 🌍 PLATFORM RULES AND COMPLIANCE',
    content:
      'The Client acknowledges that each platform has its own independent rules, policies, eligibility requirements, and terms of service.\n\nThe Client is responsible for complying with all applicable platform rules.\n\nThe Service Provider and Vendors are not responsible for:',
    bullets: [
      'Delays',
      'Account suspension or termination',
      'Platform restrictions',
      'Changes in platform policies',
      'Changes in eligibility requirements',
      'Changes in access conditions',
      'Decisions made independently by third-party platforms',
    ],
  },
  {
    id: 'section-10-refund-policy',
    title: '10. 📉 REFUND POLICY',
    content:
      'By engaging with the service, the Client agrees that payments are non-refundable once:',
    bullets: [
      'The Client has joined the community;',
      'Guidance or mentorship has commenced;',
      'Account-related services have commenced;',
      'An opportunity has been sourced or arranged on the Client’s behalf; or',
      'Any other form of service delivery has started.',
    ],
    subsections: [
      {
        content: 'Refunds will generally not be issued because of:',
        bullets: [
          'Platform rejection or ineligibility',
          'Change of mind after payment',
          'Failure to follow instructions',
          'Lack of participation or engagement',
          'Platform restrictions or policy changes',
          'Delays caused by third parties',
          'Unavailability of tasks or work',
          'Failure to generate expected income',
        ],
      },
    ],
    footer:
      'Where a Vendor has separate terms for a specific account listing, those terms may also apply.',
  },
  {
    id: 'section-11-client-responsibilities',
    title: '11. 🤝 CLIENT RESPONSIBILITIES',
    content: 'The Client agrees to:',
    bullets: [
      'Provide accurate and truthful information.',
      'Follow instructions provided during onboarding.',
      'Maintain professionalism when communicating with platforms, Vendors, and the Service Provider.',
      'Take responsibility for their own performance and results.',
      'Review and understand the terms and requirements of any third-party platform they use.',
    ],
    footer:
      'Failure to comply may affect the Client’s results without liability on the Service Provider.',
  },
  {
    id: 'section-12-limitation-of-liability',
    title: '12. 🔒 LIMITATION OF LIABILITY',
    content:
      'To the fullest extent permitted by applicable law, the Service Provider shall not be held responsible for:',
    bullets: [
      'Loss of income or expected earnings',
      'Platform errors or delays',
      'Platform restrictions or account actions',
      'Technical issues beyond reasonable control',
      'Decisions made by third-party platforms',
      'Vendor-related delays or availability issues',
      'Changes in platform policies',
      'Indirect or consequential losses',
    ],
  },
  {
    id: 'section-13-no-legal-or-employment-relationship',
    title: '13. 🔐 NO LEGAL OR EMPLOYMENT RELATIONSHIP',
    content: 'Nothing in these Terms shall be interpreted as creating:',
    bullets: [
      'An employment relationship',
      'A partnership',
      'An agency relationship',
      'A franchise or franchise-like arrangement',
    ],
    footer: 'The relationship is strictly service-based and independent.',
  },
  {
    id: 'section-14-acceptance-of-terms',
    title: '14. 📢 ACCEPTANCE OF TERMS',
    content: 'By any of the following actions:',
    bullets: [
      'Clicking “Chat Me”',
      'Sending a direct message',
      'Making any payment',
      'Joining the community',
      'Purchasing or requesting a listed account',
      'Engaging in onboarding or communication',
    ],
    subsections: [
      {
        content: 'the Client confirms that they:',
        bullets: [
          'Have read and understood these Terms.',
          'Agree to be bound by these Terms.',
          'Understand that availability of platforms, accounts, tasks, and opportunities may change.',
          'Accept the risks associated with participating in remote earning opportunities.',
        ],
      },
    ],
  },
  {
    id: 'section-15-final-disclaimer',
    title: '15. ⚠️ FINAL DISCLAIMER',
    content:
      'This service is designed to provide educational guidance, support, community access, and information relating to remote earning opportunities.\n\nIt does not guarantee:',
    bullets: [
      'Access to any specific platform',
      'Access to any specific account',
      'Employment',
      'Income',
      'A specific payout',
      'Continuous work',
      'Long-term account availability',
      'Any particular result',
    ],
    footer:
      'Platform access and account availability may depend on third-party decisions, eligibility requirements, regional restrictions, Vendor availability, and other factors outside the Service Provider’s control.',
  },
  {
    id: 'section-16-client-acknowledgement',
    title: '16. ✅ CLIENT ACKNOWLEDGEMENT',
    content:
      'By making a payment or joining the community, I acknowledge that I understand that I am paying for access to a remote job community, guidance, support, and/or an available opportunity.\n\nI understand that payment does not automatically guarantee access to a specific platform, a specific account, employment, income, or results.\n\nI also understand that some accounts listed by Vendors may not be immediately available and that a Vendor may need to source or arrange the account after payment.\n\nI understand that “account info” refers to the current status or other non-credential information about an account unless the specific listing expressly states otherwise.',
  },
  {
    id: 'notice-terms-acceptance-contract',
    title: '⚠️ IMPORTANT — TERMS ACCEPTANCE & CONTRACT NOTICE',
    isNotice: true,
    content:
      'PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE MAKING ANY PAYMENT OR USING OUR SERVICES.\n\nThese Terms and Conditions constitute a binding agreement between you (“Client”) and the Service Provider/Brand. By making a payment, joining the community, communicating with the Service Provider or a Vendor regarding a service, or otherwise proceeding with an order, you acknowledge that you have had the opportunity to read these Terms and Conditions and that you accept and agree to be bound by them.',
  },
  {
    id: 'notice-do-not-make-payment',
    title: '🚨 DO NOT MAKE PAYMENT IF YOU DO NOT AGREE',
    isNotice: true,
    content:
      'Do not make any payment if you do not understand, accept, or agree to these Terms and Conditions.\n\nIf you have any questions or concerns about the terms, you should raise them before making payment.\n\nBy proceeding with payment or using the service, you confirm that you have accepted the terms governing your purchase.',
  },
  {
    id: 'notice-no-refunds',
    title: '❌ NO REFUNDS',
    isNotice: true,
    content:
      'Unless otherwise expressly stated in these Terms or required by applicable law, all payments are final and non-refundable once the applicable service has commenced, access has been provided, an opportunity has been sourced or arranged, or the Client has joined the relevant community/service.\n\nA Client cannot request a refund simply because they did not read, review, understand, or familiarize themselves with these Terms before making payment.\nFailure to read these Terms does not invalidate your agreement to them. By proceeding with payment or use of the service, you remain responsible for complying with the Terms you accepted.',
  },
  {
    id: 'notice-professional-communication-conduct',
    title: '📢 PROFESSIONAL COMMUNICATION & CONDUCT',
    isNotice: true,
    content:
      'The Client agrees to communicate with the Service Provider, Brand, Vendors, and other members respectfully and professionally.\n\nHarassment, threats, cyberbullying, intimidation, defamation, malicious public accusations, or other abusive conduct relating to a refund request, account issue, service disagreement, or enforcement of these Terms will not be tolerated.\n\nA disagreement regarding a refund or the application of these Terms does not give either party the right to harass, threaten, intimidate, or target another person online.\n\nWhere a refund is declined in accordance with these Terms, the Client agrees to use the appropriate communication or dispute-resolution process rather than engaging in harassment, cyberbullying, threats, or malicious conduct.\n\nThe Service Provider reserves the right to restrict or terminate a Client’s access to the community or services where the Client engages in abusive, threatening, or harassing conduct, subject to applicable law.',
  },
  {
    id: 'notice-final-acknowledgement',
    title: '✅ ACKNOWLEDGEMENT',
    isNotice: true,
    content: `By proceeding with payment, the Client confirms:\n\n“${CLIENT_ACKNOWLEDGEMENT_STATEMENT}”`,
  },
]

/**
 * Builds the authoritative, deterministic canonical text representation
 * of the Terms and Conditions for cryptographic hashing and server-side verification.
 */
export function buildCanonicalTermsText(): string {
  const parts: string[] = [
    `TITLE: ${TERMS_TITLE}`,
    `VERSION: ${TERMS_VERSION}`,
    `LAST_UPDATED: ${TERMS_LAST_UPDATED}`,
    `PREAMBLE: ${TERMS_PREAMBLE}`,
  ]

  for (const s of TERMS_SECTIONS) {
    parts.push(`SECTION: ${s.title}`)
    if (s.content) {
      parts.push(`CONTENT: ${s.content}`)
    }
    if (s.bullets && s.bullets.length > 0) {
      parts.push(`BULLETS: ${s.bullets.join(' | ')}`)
    }
    if (s.subsections && s.subsections.length > 0) {
      for (const sub of s.subsections) {
        if (sub.heading) {
          parts.push(`SUBSECTION: ${sub.heading}`)
        }
        if (sub.content) {
          parts.push(`SUBCONTENT: ${sub.content}`)
        }
        if (sub.bullets && sub.bullets.length > 0) {
          parts.push(`SUBBULLETS: ${sub.bullets.join(' | ')}`)
        }
        if (sub.footer) {
          parts.push(`SUBFOOTER: ${sub.footer}`)
        }
      }
    }
    if (s.footer) {
      parts.push(`FOOTER: ${s.footer}`)
    }
  }

  return parts.join('\n\n')
}

export const CANONICAL_TERMS_TEXT = buildCanonicalTermsText()

/**
 * Deterministic SHA-256 hash of CANONICAL_TERMS_TEXT (version 2026-04-v2.0).
 * Calculated via standard SHA-256 on UTF-8 bytes.
 */
export const TERMS_DOCUMENT_HASH = 'c0a159f51cba332bab9f1ac335f674707973a125467fb50702eaf57ac31b2da8'

/**
 * Helper to compute SHA-256 in browser environments using Web Crypto API.
 */
export async function computeClientTermsHash(text: string = CANONICAL_TERMS_TEXT): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
