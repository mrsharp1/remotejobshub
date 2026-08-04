import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

const suggested = [
  {
    id: 'fiv-801',
    title: 'Level 2 Fiverr Profile',
    category: 'Design & Graphics',
    price: 1850,
    rating: '4.9',
    kyc: true,
  },
  {
    id: 'upw-449',
    title: 'Top Rated Upwork Agency',
    category: 'Software Development',
    price: 8500,
    rating: '5.0',
    kyc: true,
  },
]

export const Recommendations: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
            AI Recommendations
          </h2>
        </div>
        <Link
          to="/marketplace"
          className="group flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          Explore More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {suggested.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
            className="premium-card p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{item.category}</span>
                {item.kyc && (
                  <span className="flex items-center gap-1 text-emerald-500">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-heading text-lg font-bold text-foreground">
                {item.title}
              </h3>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="font-heading text-xl font-black text-slate-900 dark:text-white">
                ₦{item.price.toLocaleString()}
              </span>
              <Link
                to={`/marketplace`} // Redirect to marketplace or listing details if we had item ids mapped
                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Inspect Asset
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
