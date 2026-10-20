import { Briefcase, Clock, Pencil, Code2, Target, Zap } from 'lucide-react'
import { experience } from '../data/portfolio'
import { useInView } from '../hooks/useInView'
import { useTilt } from '../hooks/useTilt'

const highlights = [
  { icon: Code2,  label: 'Personal projects'    },
  { icon: Target, label: 'Goal-driven learning'  },
  { icon: Zap,    label: 'Active internship'      },
]

export default function Experience() {
  const [ref, inView] = useInView()

  return (
    <section id="experience" className="py-24 relative overflow-hidden" aria-labelledby="experience-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 right-1/4 w-80 h-64 rounded-full bg-[#1E3A5F] opacity-[0.04] blur-3xl" />
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-16">
          <span className="section-label">04. Experience</span>
          <h2 id="experience-heading" className="section-title mt-2">
            Development <span className="gradient-text">journey.</span>
          </h2>
          <p className="body-text mt-4 max-w-2xl mx-auto">
            Building hands-on experience through an active internship and personal projects.
          </p>
          <div className="section-divider" aria-hidden="true" />
        </div>

        <div className="max-w-3xl mx-auto space-y-8">

          {/* Highlight mini-cards */}
          <div className="grid grid-cols-3 gap-3 stagger-children">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="card p-4 flex flex-col items-center gap-2 text-center group
                           hover:-translate-y-1 hover:border-[#1E3A5F33] dark:hover:border-[#2A529855]
                           transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center
                                bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                                border border-[#1E3A5F1A] dark:border-[#2A529844]
                                group-hover:scale-110 transition-transform duration-200">
                  <Icon size={15} className="text-[#1E3A5F] dark:text-[#7BBFFF]" aria-hidden="true" />
                </div>
                <span className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF] leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative pl-10">
            <div
              className="absolute left-4 top-0 h-full w-px"
              style={{ background: 'linear-gradient(to bottom, #1E3A5F, #2A5298 60%, transparent)' }}
              aria-hidden="true"
            />

            {experience.map((exp, i) => (
              <ExperienceCard key={i} exp={exp} />
            ))}

            {/* Future placeholder */}
            <div className="relative">
              <div
                className="absolute -left-9 top-5 w-6 h-6 rounded-full border-2 border-dashed
                            border-[#1E3A5F33] dark:border-white/10
                            bg-white dark:bg-[#0A0A0A] flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-[#1E3A5F] dark:text-[#4A90D9] text-xs font-bold leading-none">+</span>
              </div>
              <div className="card border-dashed p-5">
                <p className="text-sm text-[#6B7280] font-mono text-center">
                  More experience coming — one project at a time...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ exp }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(4)
  return (
    <div className="relative mb-8">
      {/* Node */}
      <div className="absolute -left-9 top-5 z-10" aria-hidden="true">
        <div className="w-6 h-6 rounded-full border-2 border-[#1E3A5F] dark:border-[#2A5298] bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
          <Briefcase size={11} className="text-[#1E3A5F] dark:text-[#7BBFFF]" />
        </div>
        <div className="absolute inset-0 rounded-full border border-[#1E3A5F33] dark:border-[#2A529855] scale-150 animate-ping opacity-40" />
      </div>

      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="card-hover p-6 group"
      >
        {/* Corner glow */}
        <div
          className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#1E3A5F] opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-white">{exp.role}</h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono
                               text-[#1E3A5F] dark:text-[#7BBFFF]
                               bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                               border border-[#1E3A5F22] dark:border-[#2A529855]
                               px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F] dark:bg-[#7BBFFF] animate-pulse" aria-hidden="true" />
                <Clock size={9} aria-hidden="true" /> {exp.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#1E3A5F] dark:text-[#4A90D9]">{exp.company}</p>
          </div>
          <span className="text-xs font-mono text-[#6B7280]
                           bg-slate-50 dark:bg-[#1A1A1A]
                           border border-slate-200 dark:border-white/[0.07]
                           px-3 py-1.5 rounded-full whitespace-nowrap">
            {exp.period}
          </span>
        </div>

        <p className="text-sm text-[#4A5568] dark:text-[#9CA3AF] leading-relaxed mb-4">{exp.description}</p>

        {/* Type badge */}
        <span className="text-xs font-mono
                         text-[#1E3A5F] dark:text-[#7BBFFF]
                         bg-[#1E3A5F0A] dark:bg-[#1E3A5F2A]
                         border border-[#1E3A5F1A] dark:border-[#2A529844]
                         px-3 py-1 rounded-full inline-block">
          {exp.type}
        </span>

        {/* Edit hint */}
        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl
                        bg-[#1E3A5F06] dark:bg-[#1E3A5F1A]
                        border border-[#1E3A5F15] dark:border-[#2A529833]">
          <Pencil size={12} className="text-[#1E3A5F] dark:text-[#4A90D9] flex-shrink-0" aria-hidden="true" />
          <span className="text-xs font-mono text-[#1E3A5F] dark:text-[#4A90D9]">
            Fill in your role, company name and start date in <code className="opacity-70">src/data/portfolio.js</code>
          </span>
        </div>
      </div>
    </div>
  )
}
