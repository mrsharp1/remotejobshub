import React from 'react'
import {
  Briefcase,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  MessageSquarePlus,
  Scale,
  FileEdit,
  Code2,
  Languages,
  GraduationCap,
  Calculator,
} from 'lucide-react'

const AI_LIMITATIONS = [
  'Provides incorrect answers.',
  'Misunderstands questions.',
  'Makes grammatical mistakes.',
  'Produces unreliable explanations.',
  'Struggles with complicated mathematical problems.',
  'Generates incorrect programming code.',
]

const EVALUATION_TASKS = [
  'Read both responses.',
  'Identify factual errors.',
  'Check whether the instructions were followed.',
  'Determine which response is more accurate.',
  'Explain their decision.',
]

const CODING_TASKS = [
  'Reviewing code.',
  'Identifying programming errors.',
  'Testing solutions.',
  'Comparing different coding approaches.',
  'Explaining why a particular solution works.',
]

const LANGUAGE_TASKS = [
  'Grammar evaluation.',
  'Translation assessment.',
  'Sentence correction.',
  'Writing quality.',
  'Language understanding.',
]

const SUBJECT_AREAS = [
  'Mathematics.',
  'Biology.',
  'Chemistry.',
  'Physics.',
  'Computer science.',
  'English writing.',
  'Other professional disciplines.',
]

export const PaymentSafetyBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-slate-950 px-4 py-14 sm:py-20 lg:py-24">
      {/* Subtle Ambient Blue & Purple Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-12 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-12 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-12 sm:space-y-16">
        {/* 1. Prominent Homepage Heading */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="mx-auto inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 backdrop-blur-md">
            <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
            <span>Official Platform Overview</span>
          </div>

          <h2 className="font-heading text-3xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            REMOTE JOBS{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              HUB
            </span>
          </h2>

          <p className="text-base font-medium leading-relaxed text-slate-300 sm:text-xl">
            Your Guide to Remote Work Opportunities and AI Training Platforms.
          </p>
        </div>

        {/* 2. What Is Outlier AI? & What does Outlier actually do? */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* What Is Outlier AI? */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:col-span-5">
            <div className="space-y-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
                <Cpu className="h-6 w-6" />
              </div>

              <h3 className="font-heading text-2xl font-black text-white sm:text-3xl">
                What Is Outlier AI?
              </h3>

              <div className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                <p>Outlier AI is an online platform operated by Scale AI.</p>
                <p>
                  It connects people with different educational backgrounds,
                  professional experience, and subject-matter knowledge to help
                  improve artificial intelligence systems.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/15 via-slate-900/80 to-purple-500/10 p-4 sm:p-5">
              <p className="text-sm font-semibold leading-relaxed text-indigo-100 sm:text-base">
                In simple terms, Outlier uses human contributions to help AI
                systems become more accurate, useful, and reliable.
              </p>
            </div>
          </div>

          {/* What does Outlier actually do? */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:col-span-7">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/15 text-purple-400 shadow-inner">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-black text-white sm:text-2xl">
                  What does Outlier actually do?
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                Artificial intelligence systems learn from large amounts of
                information. However, AI-generated responses are not always
                accurate.
              </p>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 sm:text-sm">
                  Sometimes AI:
                </p>
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {AI_LIMITATIONS.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-slate-950/60 p-3 text-sm text-slate-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-1.5 rounded-2xl border border-purple-500/25 bg-purple-500/10 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-white sm:text-base">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
                <span>
                  Human contributors help identify and correct these problems.
                </span>
              </div>
              <p className="text-xs font-medium text-purple-200/90 sm:text-sm">
                This process is commonly called AI training or AI model
                evaluation.
              </p>
            </div>
          </div>
        </div>

        {/* 3. What kind of work can someone do on Outlier? */}
        <div className="space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-heading text-2xl font-black text-white sm:text-3xl">
              What kind of work can someone do on Outlier?
            </h3>
            <p className="text-sm font-medium text-slate-400 sm:text-base">
              Here are some examples.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. Writing prompts */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
                    <MessageSquarePlus className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 font-mono text-xs font-bold text-indigo-300">
                    01
                  </span>
                </div>

                <h4 className="font-heading text-lg font-bold text-white sm:text-xl">
                  1. Writing prompts
                </h4>

                <p className="text-sm leading-relaxed text-slate-300">
                  A contributor creates questions designed to test an AI model.
                </p>

                {/* Visually Distinct Mathematics Example */}
                <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 via-slate-950/90 to-purple-950/40 p-4 space-y-2.5 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                    <Calculator className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Example:</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                    A contributor with mathematics knowledge might ask:
                  </p>
                  <blockquote className="rounded-xl border-l-2 border-indigo-400 bg-slate-900/90 px-3.5 py-2.5 text-xs font-semibold italic leading-relaxed text-white sm:text-sm">
                    &ldquo;What is the probability of getting two heads when
                    tossing a fair coin three times?&rdquo;
                  </blockquote>
                  <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                    The contributor then provides the correct answer and
                    evaluates the AI&apos;s response.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Evaluating AI responses */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/15 text-blue-400">
                    <Scale className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-mono text-xs font-bold text-blue-300">
                    02
                  </span>
                </div>

                <h4 className="font-heading text-lg font-bold text-white sm:text-xl">
                  2. Evaluating AI responses
                </h4>

                <p className="text-sm leading-relaxed text-slate-300">
                  A contributor receives two responses generated by an AI
                  system.
                </p>

                <div className="space-y-2.5 pt-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Their responsibility is to:
                  </p>
                  <ul className="space-y-2">
                    {EVALUATION_TASKS.map((task) => (
                      <li
                        key={task}
                        className="flex items-start gap-2.5 text-sm text-slate-300"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Correcting AI-generated content */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400">
                    <FileEdit className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 font-mono text-xs font-bold text-purple-300">
                    03
                  </span>
                </div>

                <h4 className="font-heading text-lg font-bold text-white sm:text-xl">
                  3. Correcting AI-generated content
                </h4>

                <div className="space-y-3 text-sm leading-relaxed text-slate-300">
                  <p>
                    An AI model might produce a paragraph containing grammatical
                    mistakes or incorrect information.
                  </p>
                  <div className="rounded-2xl border border-purple-500/20 bg-slate-950/60 p-4 text-slate-200">
                    A contributor reviews the paragraph and provides
                    corrections.
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Coding and programming tasks */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
                    <Code2 className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 font-mono text-xs font-bold text-indigo-300">
                    04
                  </span>
                </div>

                <h4 className="font-heading text-lg font-bold text-white sm:text-xl">
                  4. Coding and programming tasks
                </h4>

                <p className="text-sm leading-relaxed text-slate-300">
                  People with programming knowledge may receive assignments
                  involving:
                </p>

                <ul className="space-y-2 pt-1">
                  {CODING_TASKS.map((task) => (
                    <li
                      key={task}
                      className="flex items-start gap-2.5 text-sm text-slate-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. Language-related tasks */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/15 text-blue-400">
                    <Languages className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-mono text-xs font-bold text-blue-300">
                    05
                  </span>
                </div>

                <h4 className="font-heading text-lg font-bold text-white sm:text-xl">
                  5. Language-related tasks
                </h4>

                <p className="text-sm leading-relaxed text-slate-300">
                  People with language skills may work on:
                </p>

                <ul className="space-y-2 pt-1">
                  {LANGUAGE_TASKS.map((task) => (
                    <li
                      key={task}
                      className="flex items-start gap-2.5 text-sm text-slate-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 6. Subject-specific assignments */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 font-mono text-xs font-bold text-purple-300">
                    06
                  </span>
                </div>

                <h4 className="font-heading text-lg font-bold text-white sm:text-xl">
                  6. Subject-specific assignments
                </h4>

                <p className="text-sm leading-relaxed text-slate-300">
                  Depending on available projects, contributors may work in
                  areas such as:
                </p>

                <ul className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                  {SUBJECT_AREAS.map((subject) => (
                    <li
                      key={subject}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
