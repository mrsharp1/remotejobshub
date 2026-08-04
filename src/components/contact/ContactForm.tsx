import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'

export const ContactForm: React.FC = React.memo(() => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = useCallback((
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    // Simulating secure server post
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }, [form.name, form.email, form.message])

  return (
    <section id="contact-form-anchor" className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Secure Message Center
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Submit a secure inquiry to our risk operations desk. All submissions are encrypted and reviewed by human operators.
          </p>
        </div>

        <motion.div
          layout
          className="premium-card relative overflow-hidden bg-white p-8 dark:bg-slate-950 md:p-12"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <h3 className="font-heading text-2xl font-black text-slate-900 dark:text-white">
                  Message Sent Securely
                </h3>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-500 dark:text-slate-400">
                  Thank you, <span className="font-bold text-slate-900 dark:text-white">{form.name}</span>. Your ticket has been logged inside our operations database. We typically respond within 12 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', subject: '', message: '' })
                  }}
                  className="mt-8 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Submit Another Secure Inquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {error && (
                  <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                    <AlertTriangle className="h-5 w-5" />
                    {error}
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Inquiry Topic
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950"
                  >
                    <option value="">Select a topic...</option>
                    <option value="general">General Inquiry</option>
                    <option value="account">Account Access / Management</option>
                    <option value="payment">Escrow Deposits / Withdrawals</option>
                    <option value="dispute">Neutral Dispute Arbitration</option>
                    <option value="listing">Listing Review Status</option>
                    <option value="other">Other Issues</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Detailed Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Provide a detailed description of your issue or request..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-base font-bold text-white shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Encrypting & Sending...
                    </>
                  ) : (
                    <>
                      Submit Secure Inquiry
                      <Send className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
})
