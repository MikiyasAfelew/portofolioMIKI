import { GraduationCap, Brain, Code2, BarChart3, Smartphone, Award, CheckCircle2 } from 'lucide-react'
import { education } from '../data/portfolio'
import { useInView } from '../hooks/useInView'
import { useTilt } from '../hooks/useTilt'

const iconMap = { Brain, Code2, BarChart3, Smartphone }

export default function Education() {
  const [ref, inView] = useInView()

  return (
    <section id="education" className="py-24 relative overflow-hidden" aria-labelledby="education-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/3 w-96 h-64 rounded-full bg-[#1E3A5F] opacity-[0.04] blur-3xl" />
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-16">
          <span className="section-label">03. Education</span>
          <h2 id="education-heading" className="section-title mt-2">
            Learning path <span className="gradient-text">&amp; training.</span>
          </h2>
          <div className="section-divider" aria-hidden="true" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── DEGREE TIMELINE ── */}
          <div>
            <h3 className="text-xs font-mono text-[#1E3A5F] dark:text-[#7BBFFF] uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="w-4 h-px bg-[#1E3A5F] dark:bg-[#7BBFFF]" aria-hidden="true" />
              Academic Background
            </h3>

            <div className="relative pl-10">
              {/* Timeline line */}
              <div
                className="absolute left-4 top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(to bottom, #1E3A5F, #2A5298 50%, transparent)' }}
                aria-hidden="true"
              />

              {/* Pulsing node */}
              <div className="absolute left-1 top-3 z-10" aria-hidden="true">
                <div className="w-6 h-6 rounded-full border-2 border-[#1E3A5F] dark:border-[#2A5298] bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
                  <GraduationCap size={11} className="text-[#1E3A5F] dark:text-[#7BBFFF]" />
                </div>
                <div className="absolute inset-0 rounded-full border border-[#1E3A5F33] dark:border-[#2A529855] scale-150 animate-ping opacity-50" />
              </div>

              {/* Degree card */}
              <div className="card-glow group">
                <div className="card-glow-inner p-6 relative overflow-hidden">
                  {/* Corner glow */}
                  <div
                    className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#1E3A5F] opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500 blur-2xl"
                    aria-hidden="true"
                  />

                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F] dark:bg-[#4A90D9] neon-dot" aria-hidden="true" />
                        <h4 className="text-lg font-bold text-[#1E3A5F] dark:text-[#7BBFFF]">
                          {education.degree.institution}
                        </h4>
                      </div>
                      <p className="text-sm font-semibold text-[#374151] dark:text-[#D1D5DB] ml-3">
                        {education.degree.degree} — {education.degree.field}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[#1E3A5F] dark:text-[#7BBFFF]
                                     bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                                     border border-[#1E3A5F22] dark:border-[#2A529855]
                                     px-3 py-1 rounded-full whitespace-nowrap">
                      {education.degree.period}
                    </span>
                  </div>

                  <p className="text-sm text-[#4A5568] dark:text-[#9CA3AF] leading-relaxed">
                    {education.degree.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex justify-between text-xs font-mono text-[#6B7280] mb-1.5">
                      <span>Progress</span><span>~60%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: inView ? '60%' : '0%',
                          background: 'linear-gradient(to right, #1E3A5F, #2A5298)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CERTIFICATIONS ── */}
          <div>
            <h3 className="text-xs font-mono text-[#1E3A5F] dark:text-[#7BBFFF] uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="w-4 h-px bg-[#1E3A5F] dark:bg-[#7BBFFF]" aria-hidden="true" />
              Certifications — Ethio Coder
            </h3>

            <div className="grid grid-cols-2 gap-4" role="list" aria-label="Certifications">
              {education.certifications.map((cert, idx) => {
                const Icon = iconMap[cert.icon]
                return <CertCard key={cert.name} cert={cert} Icon={Icon} idx={idx} />
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CertCard({ cert, Icon, idx }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(7)
  return (
    <div
      ref={ref}
      role="listitem"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="card-hover p-5 flex flex-col gap-3 group animate-fade-in-up"
      style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
    >
      {/* Icon block */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center
                   bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                   border border-[#1E3A5F22] dark:border-[#2A529855]
                   group-hover:scale-110 group-hover:bg-[#1E3A5F18] dark:group-hover:bg-[#1E3A5F44]
                   transition-all duration-300"
      >
        {Icon
          ? <Icon size={20} className="text-[#1E3A5F] dark:text-[#7BBFFF]" aria-hidden="true" />
          : <Award size={20} className="text-[#1E3A5F] dark:text-[#7BBFFF]" aria-hidden="true" />
        }
      </div>

      <div>
        <div className="text-sm font-bold text-[#0A0A0A] dark:text-white leading-snug
                        group-hover:text-[#1E3A5F] dark:group-hover:text-[#7BBFFF] transition-colors duration-200">
          {cert.name}
        </div>
        <div className="text-xs text-[#6B7280] font-mono mt-0.5">{cert.issuer}</div>
      </div>

      <div className="flex items-center gap-1.5 mt-auto">
        <CheckCircle2 size={12} className="text-[#1E3A5F] dark:text-[#4A90D9]" aria-hidden="true" />
        <span className="text-xs font-mono text-[#1E3A5F] dark:text-[#4A90D9]">Certified</span>
      </div>

      {/* Bottom line on hover */}
      <div
        className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-50 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to right, transparent, #1E3A5F, transparent)' }}
        aria-hidden="true"
      />
    </div>
  )
}
