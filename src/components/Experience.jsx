import { Briefcase, Clock, Pencil } from 'lucide-react'
import { experience } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

export default function Experience() {
  const [ref, inView] = useInView()

  return (
    <section id="experience" className="py-24 relative" aria-labelledby="experience-heading">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 100% 50%, #8B5CF606 0%, transparent 70%)' }}
      />

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
            Currently building hands-on experience through an internship and personal projects.
          </p>
          <div className="section-divider" aria-hidden="true" />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative pl-8">
            <div
              className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-[#0099CC] dark:from-[#00E5FF] via-[#7C3AED] dark:via-[#8B5CF6] to-transparent"
              aria-hidden="true"
            />

            {experience.map((exp, i) => (
              <div key={i} className="relative mb-8 last:mb-0">
                <div
                  className="absolute -left-8 top-5 w-6 h-6 rounded-full border-2 border-[#0099CC] dark:border-[#00E5FF] bg-white dark:bg-[#0B0F1A] flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Briefcase size={11} className="text-[#0099CC] dark:text-[#00E5FF]" />
                </div>

                <div className="glass-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{exp.role}</h3>
                        <span className="flex items-center gap-1 text-xs font-mono text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/10 border border-green-200 dark:border-green-400/20 px-2 py-0.5 rounded-full">
                          <Clock size={10} aria-hidden="true" /> {exp.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#7C3AED] dark:text-[#8B5CF6] font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 dark:text-[#8A94A8] bg-slate-100 dark:bg-[#0E1220] border border-slate-200 dark:border-white/5 px-3 py-1 rounded-full whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-[#8A94A8] leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-[#FF4D8D08] border border-rose-200 dark:border-[#FF4D8D22]">
                    <Pencil size={13} className="text-rose-500 dark:text-[#FF4D8D] flex-shrink-0" aria-hidden="true" />
                    <span className="text-xs font-mono text-rose-500 dark:text-[#FF4D8D]">
                      Fill in your role, company name, and start date above.
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Placeholder */}
            <div className="relative">
              <div
                className="absolute -left-8 top-5 w-6 h-6 rounded-full border-2 border-dashed border-slate-300 dark:border-[#8A94A8] bg-white dark:bg-[#0B0F1A] flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-slate-400 dark:text-[#8A94A8] text-xs">+</span>
              </div>
              <div className="glass-card p-6 border-dashed">
                <p className="text-sm text-slate-400 dark:text-[#8A94A8] font-mono">
                  More experience coming as I continue building projects and growing as a developer...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
