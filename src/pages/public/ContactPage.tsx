import React, { lazy, Suspense } from 'react'
import { ContactHero } from '@/components/contact/ContactHero'

// Lazy loaded below-the-fold components
const SupportOptions = lazy(() => import('@/components/contact/SupportOptions').then(m => ({ default: m.SupportOptions })))
const ContactForm = lazy(() => import('@/components/contact/ContactForm').then(m => ({ default: m.ContactForm })))
const TelegramShowcase = lazy(() => import('@/components/contact/TelegramShowcase').then(m => ({ default: m.TelegramShowcase })))
const ContactTrust = lazy(() => import('@/components/contact/ContactTrust').then(m => ({ default: m.ContactTrust })))
const SupportTimeline = lazy(() => import('@/components/contact/SupportTimeline').then(m => ({ default: m.SupportTimeline })))
const GlobalPresence = lazy(() => import('@/components/contact/GlobalPresence').then(m => ({ default: m.GlobalPresence })))
const ContactFAQ = lazy(() => import('@/components/contact/ContactFAQ').then(m => ({ default: m.ContactFAQ })))
const ContactCTA = lazy(() => import('@/components/contact/ContactCTA').then(m => ({ default: m.ContactCTA })))

const ComponentSkeleton: React.FC = () => (
  <div className="mx-auto max-w-5xl px-4 py-16 space-y-8 animate-pulse">
    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    <div className="grid gap-6 md:grid-cols-2">
      {[1, 2].map((n) => (
        <div key={n} className="h-40 rounded-3xl border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 p-6 space-y-4">
          <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
)

export const ContactPage: React.FC = () => {
  return (
    <div className="flex flex-col bg-background">
      <ContactHero />
      <Suspense fallback={<ComponentSkeleton />}>
        <SupportOptions />
        <ContactForm />
        <TelegramShowcase />
        <ContactTrust />
        <SupportTimeline />
        <GlobalPresence />
        <ContactFAQ />
        <ContactCTA />
      </Suspense>
    </div>
  )
}
export default ContactPage

