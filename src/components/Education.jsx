import { GraduationCap, Brain, Code2, BarChart3, Smartphone, Award } from 'lucide-react'
import { education } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

const iconMap = { Brain, Code2, BarChart3, Smartphone }

export default function Education() {
  const [ref, inView] = useInView()

  return (
    <section id="education" className="py-24 relative" aria-labelledby="education-heading">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 0% 50%, #00E5FF04 0%, transparent 70%)' }}
      />

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

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-mono text-[#0099CC] dark:text-[#00E5FF] uppercase tracking-widest mb-6">
              Academic Background
            </h3>
            <div className="relative pl-8">
              <div
                className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-[#0099CC] dark:from-[#00E5FF] to-transparent"
                aria-hidden="true"
              />
              <div
                className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-[#0099CC] dark:border-[#00E5FF] bg-white dark:bg-[#0B0F1A] flex items-center justify-center"
                aria-hidden="true"
              >
                <GraduationCap size={12} className="text-[#0099CC] dark:text-[#00E5FF]" />
              </div>

              <div className="glass-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <h4 className="text-lg font-bold text-[#0077AA] dark:text-[#00E5FF]">
                    {education.degree.institution}
                  </h4>
                  <span className="text-xs font-mono text-[#7C3AED] dark:text-[#8B5CF6] bg-[#7C3AED11] dark:bg-[#8B5CF611] border border-[#7C3AED33] dark:border-[#8B5CF633] px-2 py-0.5 rounded">
                    {education.degree.period}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                  {education.degree.degree} — {education.degree.field}
                </p>
                <p className="text-sm text-slate-500 dark:text-[#8A94A8] leading-relaxed">
                  {education.degree.description}
                </p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-sm font-mono text-[#0099CC] dark:text-[#00E5FF] uppercase tracking-widest mb-6">
              Certifications — Ethio Coder
            </h3>
            <div className="grid grid-cols-2 gap-4" role="list" aria-label="Certifications">
              {education.certifications.map((cert) => {
                const Icon = iconMap[cert.icon]
                return (
                  <div key={cert.name} role="listitem" className="glass-card-hover p-5 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0099CC22] to-[#7C3AED22] dark:from-[#00E5FF22] dark:to-[#8B5CF622] flex items-center justify-center border border-[#0099CC22] dark:border-[#00E5FF22]">
                      {Icon
                        ? <Icon size={18} className="text-[#0099CC] dark:text-[#00E5FF]" aria-hidden="true" />
                        : <Award size={18} className="text-[#0099CC] dark:text-[#00E5FF]" aria-hidden="true" />
                      }
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white leading-snug">{cert.name}</div>
                      <div className="text-xs text-slate-400 dark:text-[#8A94A8] font-mono mt-0.5">{cert.issuer}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0099CC] dark:bg-[#00E5FF]" aria-hidden="true" />
                      <span className="text-xs text-[#0077AA] dark:text-[#00E5FF] font-mono">Certified</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
