import React from 'react'
import { motion } from 'framer-motion'
import { FileText, ArrowRight } from 'lucide-react'

interface PopularQuestionsProps {
  onQuestionClick: (questionText: string) => void
}

const popular = [
  'How does the escrow system work?',
  'How do I verify my identity?',
  'What happens if I have a problem with my purchase?',
  'When do I receive my payment?',
]

export const PopularQuestions: React.FC<PopularQuestionsProps> = ({ onQuestionClick }) => {
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-10 font-heading text-2xl font-bold text-slate-900 dark:text-white">
          Popular Questions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {popular.map((q, idx) => (
            <motion.button
              key={idx}
              onClick={() => onQuestionClick(q)}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="premium-card flex items-center justify-between p-6 text-left"
            >
              <div className="flex items-center gap-3 pr-4">
                <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">{q}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
