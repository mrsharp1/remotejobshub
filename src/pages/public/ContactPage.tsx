import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitting(false)
    setSubmitted(true)
  }

  const contacts = [
    {
      icon: Mail,
      label: 'Email Support',
      value: 'support@remotejobshub.com',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Phone,
      label: 'Phone (Mon–Fri)',
      value: '+1 (800) 555-0199',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: MapPin,
      label: 'Headquarters',
      value: 'San Francisco, CA, USA',
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="from-primary/5 to-secondary/10 bg-gradient-to-br via-background px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a question, concern, or feedback? Our team is here to help —
            typically within 24 hours.
          </p>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h2 className="font-heading text-2xl font-bold">
              Contact Information
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Reach out through any of the channels below, or fill in the form
              and we'll get back to you.
            </p>
            <div className="mt-8 space-y-4">
              {contacts.map((c) => {
                const Icon = c.icon
                return (
                  <div key={c.label} className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${c.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{c.label}</p>
                      <p className="text-sm text-muted-foreground">{c.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="bg-muted/30 mt-10 rounded-2xl border p-5">
              <p className="text-sm font-semibold">Support Hours</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Monday – Friday: 8am – 8pm EST
              </p>
              <p className="text-sm text-muted-foreground">
                Saturday – Sunday: 10am – 4pm EST
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="mb-4 h-12 w-12 text-emerald-500" />
                <h3 className="font-heading text-xl font-bold">
                  Message Sent!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thanks for reaching out, {form.name}. We'll get back to you
                  within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', subject: '', message: '' })
                  }}
                  className="mt-6 text-sm font-medium text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading text-lg font-semibold">
                  Send a Message
                </h3>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="focus:ring-primary/30 w-full rounded-lg border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="focus:ring-primary/30 w-full rounded-lg border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="focus:ring-primary/30 w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  >
                    <option value="">Select a topic…</option>
                    <option value="general">General Enquiry</option>
                    <option value="account">Account Issue</option>
                    <option value="payment">Payment Problem</option>
                    <option value="dispute">Dispute Resolution</option>
                    <option value="listing">Listing Review</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describe your question or issue in detail…"
                    className="focus:ring-primary/30 w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition disabled:opacity-60"
                >
                  {submitting ? (
                    'Sending…'
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
