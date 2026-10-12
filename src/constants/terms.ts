/**
 * Remote Jobs Hub - Canonical Terms and Conditions
 *
 * Source of Truth: Original Client-Provided Terms & Conditions (April 2026)
 *
 * This module exports the immutable, canonical text of the Terms and Conditions
 * presented to buyers at checkout, along with its version and cryptographic SHA-256 fingerprint.
 */

export interface TermsSection {
  title: string
  content: string
  bullets?: string[]
  footer?: string
}

export const TERMS_VERSION = '2026-04-v1.0'
export const TERMS_TITLE = 'Remote Jobs Hub Terms and Conditions'
export const TERMS_LAST_UPDATED = 'April 2026'
export const TERMS_STATUS: 'published' | 'draft' | 'archived' = 'draft'

/**
 * Standard, immutable affirmative statement required from the buyer at checkout.
 * Validated by server-side acceptance preparation RPC.
 */
export const EXPECTED_CONSENT_AFFIRMATION = `I explicitly accept the Remote Jobs Hub Terms and Conditions version ${TERMS_VERSION} and agree to be legally bound thereby.`

export const TERMS_SECTIONS: TermsSection[] = [
  {
    title: 'DEFINITIONS',
    content: 'For the purpose of these Terms:',
    bullets: [
      '“Service Provider” refers to the individual or entity offering guidance and mentorship services.',
      '“Client” refers to any person who engages, pays for, or uses the service.',
      '“Services” refers to all guidance, mentorship, setup assistance, and information provided regarding remote job opportunities.'
    ]
  },
  {
    title: 'NATURE OF SERVICE',
    content: 'The Service Provider offers educational guidance, mentorship, and setup assistance relating to remote AI-based job opportunities.\nThis service may include support across up to three (3) different remote job platforms, depending on availability, eligibility, and regional accessibility.\nThese platforms may include but are not limited to Outlier AI or similar platforms in the remote AI and digital work industry.\nThe Service Provider is not an employee, agent, or official representative of any third-party platform mentioned.'
  },
  {
    title: 'NO EMPLOYMENT OR PARTNERSHIP GUARANTEE',
    content: 'By using this service, the Client acknowledges that:',
    bullets: [
      'This service does not guarantee employment with any company or platform',
      'No formal job contract is created between the Client and any platform',
      'The Service Provider does not control hiring decisions or platform approval systems'
    ],
    footer: 'All platform decisions remain solely with the respective companies.'
  },
  {
    title: 'NO GUARANTEE OF SPECIFIC PLATFORM ACCESS',
    content: 'The Client understands and agrees that:\n• Access to any specific platform, including Outlier AI UK Account (bonus), is not guaranteed.\n• Platform availability may vary based on country or regional restrictions, account verification policies, platform internal decisions, and technical or system limitations.\nThe Client is paying for guidance, support, and access to available opportunities, not for guaranteed access to any single platform.'
  },
  {
    title: 'MULTIPLE OPPORTUNITY STRUCTURE',
    content: 'The service is structured to provide up to three (3) remote job options, depending on eligibility and availability.',
    bullets: [
      'If one platform is not accessible, alternative platforms will be provided',
      'Final selection of platform depends on Client eligibility and platform acceptance criteria',
      'The Service Provider reserves the right to modify available options at any time without prior notice'
    ]
  },
  {
    title: 'FEES AND PAYMENT TERMS',
    content: '6.1 Initial Payment:\n• A non-refundable fee is required to begin the service.\n• This fee covers setup guidance, mentorship and consultation, assistance with account preparation, and general support throughout onboarding.\n\n6.2 Performance-Based Fee:\n• This fee is payable only after the Client receives their first successful payout from any platform.\n• This fee is considered a performance-based service fee for continued support and mentorship.'
  },
  {
    title: 'NO INCOME GUARANTEE',
    content: 'The Client acknowledges that earnings are not guaranteed. Income varies based on individual effort, platform availability, task completion, and platform policies and demand.\nThe Service Provider does not guarantee any specific income level, continuous availability of tasks, or long-term access to any platform.'
  },
  {
    title: 'PLATFORM RULES AND COMPLIANCE',
    content: 'The Client agrees that each platform has its own independent rules and policies, and the Client is responsible for complying with all platform terms of service. The Service Provider is not responsible for platform enforcement actions, account suspension or termination, restrictions imposed by platforms, or changes in platform policies or access conditions.'
  },
  {
    title: 'REFUND POLICY',
    content: 'By engaging this service, the Client agrees that the initial payment is strictly non-refundable once you join the community and guidance has commenced, OR any form of service delivery has started.\nRefunds will not be issued in cases such as platform rejection or ineligibility, change of mind after payment, failure to follow instructions, or lack of participation or engagement.'
  },
  {
    title: 'CLIENT RESPONSIBILITIES',
    content: 'The Client agrees to provide accurate and truthful information, follow all instructions provided during onboarding, maintain professionalism during all platform interactions, and take responsibility for their own performance and results. Failure to comply may affect outcomes without liability on the Service Provider.'
  },
  {
    title: 'LIMITATION OF LIABILITY',
    content: 'To the fullest extent permitted by law, the Service Provider shall not be held responsible for loss of income or expected earnings, platform errors, delays, or restrictions, technical issues beyond reasonable control, decisions made by third-party platforms, or any indirect or consequential losses.'
  },
  {
    title: 'NO LEGAL OR EMPLOYMENT RELATIONSHIP',
    content: 'Nothing in this agreement shall be interpreted as creating an employment relationship, partnership, agency relationship, or franchise arrangement. The relationship is strictly service-based and independent.'
  },
  {
    title: 'ACCEPTANCE OF TERMS',
    content: 'By clicking “Chat Me”, sending a direct message, making any payment, or engaging in onboarding or communication, the Client confirms that they have read and understood these Terms, agree to be legally bound by them, and accept all risks associated with participation.'
  },
  {
    title: 'ACCOUNT AVAILABILITY AND DELIVERY',
    content: 'The Client acknowledges that account listings displayed as “Available,” “In Stock,” or “For Sale” indicate that the Service Provider is currently accepting orders for that account type. Such listings do not constitute a guarantee of immediate delivery.\nDue to inventory management, quality checks, account verification, order volume, platform policies, or other operational requirements, delivery may be delayed.\nThe Service Provider reserves the right to allocate, replace, delay, or provide an equivalent account or an alternative remote job opportunity where necessary.\nEstimated delivery times are provided for guidance only and are not guaranteed.'
  },
  {
    title: 'ORDER FULFILMENT',
    content: 'Purchasing an account does not guarantee immediate delivery or immediate onboarding. Orders are processed according to account availability, verification requirements, platform eligibility, inventory levels, and operational capacity.\nThe Client agrees that reasonable waiting or processing periods do not constitute a breach of this agreement and do not entitle the Client to a refund.'
  },
  {
    title: 'PAYMENT RELEASE',
    content: 'For security purposes, payments made through the marketplace are initially held by the platform and are not immediately released to the Service Provider.\nThe “Release Funds” button authorizes the platform to release the seller’s payment. By clicking “Release Funds,” the Client confirms that they authorize the platform to pay the Service Provider.\nThe Client understands and agrees that releasing the funds does not mean they are entitled to an immediate account, immediate onboarding, or immediate placement into an account creation batch. Account allocation and onboarding are subject to availability, verification, eligibility, and processing requirements.\nAccordingly, the release of funds does not create any right to a refund merely because an account has not yet been delivered immediately or because the Client has not yet been added to an account creation batch.\nOnce funds have been released to the Service Provider, the payment becomes final and non-refundable, except where required by applicable law.'
  },
  {
    title: 'COMMUNICATION POLICY',
    content: 'The Client agrees to communicate respectfully and professionally at all times. Any form of abusive language, insults, threats, harassment, intimidation, or offensive conduct directed at the Service Provider or members of the community may result in the immediate suspension or permanent termination of the Client’s access to the service, community, or future services, without refund where services have already commenced.'
  },
  {
    title: 'AGREEMENT AND ELECTRONIC ACCEPTANCE',
    content: 'By clicking “I Agree,” “Chat Me,” “Purchase,” “Proceed,” making payment, releasing funds, or continuing to use the Service, the Client confirms that they:\n• Have carefully read and fully understood these Terms and Conditions;\n• Voluntarily agree to be legally bound by all provisions contained herein;\n• Accept all risks associated with participating in remote work opportunities;\n• Acknowledge that their electronic acceptance constitutes a legally binding agreement and has the same legal effect as a handwritten signature, to the fullest extent permitted by applicable law.'
  },
  {
    title: 'PURCHASE NOTICE',
    content: 'If you do not agree with these Terms and Conditions, please do not proceed with payment or use this Service.\nBy completing your purchase, you acknowledge that you are paying for access to our remote jobs community, educational guidance, mentorship, setup assistance, and available remote work opportunities.\nYou further acknowledge that:\n• You are not purchasing guaranteed employment.\n• You are not purchasing a guaranteed Outlier AI account.\n• You are not purchasing guaranteed income.\n• Immediate account delivery is not guaranteed.\n• Alternative remote job opportunities may be provided where a specific account is unavailable, subject to eligibility and availability.\n• The initial payment is non-refundable once service delivery has commenced, except where required by applicable law.'
  }
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
    `PREAMBLE: By accessing this page, communicating with the service provider, or making any form of payment, you ("Client") confirm that you have read, understood, and agreed to be legally bound by the following Terms and Conditions.`
  ]

  for (const s of TERMS_SECTIONS) {
    parts.push(`SECTION: ${s.title}`)
    parts.push(`CONTENT: ${s.content}`)
    if (s.bullets && s.bullets.length > 0) {
      parts.push(`BULLETS: ${s.bullets.join(' | ')}`)
    }
  }

  return parts.join('\n\n')
}

export const CANONICAL_TERMS_TEXT = buildCanonicalTermsText()

/**
 * Deterministic SHA-256 hash of CANONICAL_TERMS_TEXT.
 * Calculated via standard SHA-256 on UTF-8 bytes.
 */
export const TERMS_DOCUMENT_HASH = 'b7bd68bd6144eec5b791ce9c9c714809dc8a3dd42d89334dee4bbc9efd8ccd35'

/**
 * Helper to compute SHA-256 in browser environments using Web Crypto API.
 */
export async function computeClientTermsHash(text: string = CANONICAL_TERMS_TEXT): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
