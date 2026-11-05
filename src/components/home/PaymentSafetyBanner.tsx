import React from 'react'

export const PaymentSafetyBanner: React.FC = () => {
  return (
    <section className="border-b border-white/5 bg-slate-950 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="font-heading text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
          REMOTE JOBS{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            HUB
          </span>
        </h2>
      </div>
    </section>
  )
}
