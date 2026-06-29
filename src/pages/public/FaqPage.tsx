import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FaqItem {
  q: string
  a: string
}

const categories: { label: string; items: FaqItem[] }[] = [
  {
    label: 'Getting Started',
    items: [
      {
        q: 'What is Remote Jobs Hub?',
        a: 'Remote Jobs Hub is a secure marketplace where verified sellers list established remote work accounts for sale, and verified buyers can purchase them through our escrow-protected system.',
      },
      {
        q: 'Is it free to sign up?',
        a: 'Yes! Creating a buyer account is completely free. Sellers can also register for free but require a subscription plan to publish listings.',
      },
      {
        q: 'How do I verify my identity?',
        a: 'Sellers must complete our KYC process by submitting a government-issued ID and selfie through the Seller Verification section of their dashboard. Approval typically takes 24–48 hours.',
      },
    ],
  },
  {
    label: 'Buying',
    items: [
      {
        q: 'How does the escrow system work?',
        a: 'When you purchase a listing, your payment is held in secure escrow. The seller transfers the account credentials, and once you confirm successful delivery, the funds are released to the seller.',
      },
      {
        q: 'What if I have a problem with my purchase?',
        a: 'You can open a dispute from your order details page within the dispute window. Our admin team reviews all evidence and makes a fair resolution, including potential refunds.',
      },
      {
        q: 'Can I negotiate prices with sellers?',
        a: 'Yes! You can start a conversation with any seller through our in-app messaging system to discuss pricing before making a purchase.',
      },
    ],
  },
  {
    label: 'Selling',
    items: [
      {
        q: 'How do I list my account for sale?',
        a: 'Complete your seller profile, get KYC verified, then use the Seller Studio to create a listing. All listings are reviewed by our admin team before being published.',
      },
      {
        q: 'How long does listing approval take?',
        a: 'Most listings are reviewed within 24 hours. Verified sellers with a strong history typically see faster approval times.',
      },
      {
        q: 'When do I receive my payment?',
        a: 'Funds are released to your seller wallet once the buyer confirms successful delivery of the account. You can then withdraw to your bank account.',
      },
      {
        q: 'What commission does Remote Jobs Hub charge?',
        a: 'Commission rates depend on your seller agreement plan. Rates typically range from 5–15% of the sale price. Full details are available in your seller dashboard under Revenue Agreement.',
      },
    ],
  },
  {
    label: 'Payments & Security',
    items: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major cards and bank transfers through our Paystack payment gateway. Wallet balance can also be used for purchases.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. All payment processing is handled by Paystack, a PCI-DSS compliant gateway. We never store your card details on our servers.',
      },
      {
        q: 'How do I withdraw my seller earnings?',
        a: 'Navigate to your Seller Wallet, click "Withdraw", enter your bank details, and submit a withdrawal request. Withdrawals are processed within 1–3 business days.',
      },
    ],
  },
]

const FaqAccordion: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold leading-snug">{item.q}</span>
        {open ? (
          <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="bg-muted/20 border-t px-5 py-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.a}
          </p>
        </div>
      )}
    </div>
  )
}

export const FaqPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="from-primary/5 to-secondary/10 bg-gradient-to-br via-background px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about buying and selling on Remote Jobs
            Hub.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {categories.map((cat) => (
            <div key={cat.label}>
              <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
                {cat.label}
              </h2>
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <FaqAccordion key={item.q} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="border-t px-4 py-12">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-semibold">Still have questions?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Our support team is available 7 days a week.
          </p>
          <a
            href="/contact"
            className="hover:bg-primary/90 mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  )
}
