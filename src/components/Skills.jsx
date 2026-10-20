import { Code2, Smartphone, ShieldCheck, Wrench, Database, GraduationCap } from 'lucide-react'
import { skills } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

const iconMap = { Code2, Smartphone, ShieldCheck, Wrench, Database, GraduationCap }

// Light colors are readable on white; dark colors pop on navy
const colorMap = {
  '#00E5FF': {
    bg:     'bg-[#0099CC11] dark:bg-[#00E5FF11]',
    border: 'border-[#0099CC33] dark:border-[#00E5FF33]',
    text:   'text-[#0077AA] dark:text-[#00E5FF]',
    badge:  'bg-[#0099CC0D] dark:bg-[#00E5FF11] border-[#0099CC22] dark:border-[#00E5FF22] text-[#0077AA] dark:text-[#00E5FF]',
    line:   '#0099CC',
  },
  '#8B5CF6': {
    bg:     'bg-[#7C3AED11] dark:bg-[#8B5CF611]',
    border: 'border-[#7C3AED33] dark:border-[#8B5CF633]',
    text:   'text-[#6D28D9] dark:text-[#8B5CF6]',
    badge:  'bg-[#7C3AED0D] dark:bg-[#8B5CF611] border-[#7C3AED22] dark:border-[#8B5CF622] text-[#6D28D9] dark:text-[#8B5CF6]',
    line:   '#7C3AED',
  },
  '#FF4D8D': {
    bg:     'bg-[#e0396e11] dark:bg-[#FF4D8D11]',
    border: 'border-[#e0396e33] dark:border-[#FF4D8D33]',
    text:   'text-[#c0185a] dark:text-[#FF4D8D]',
    badge:  'bg-[#e0396e0D] dark:bg-[#FF4D8D11] border-[#e0396e22] dark:border-[#FF4D8D22] text-[#c0185a] dark:text-[#FF4D8D]',
    line:   '#e0396e',
  },
}

export default function Skills() {
  const [ref, inView] = useInView()

  return (
    <section id="skills" className="py-24 relative" aria-labelledby="skills-heading">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #0099CC04 0%, transparent 70%)' }}
      />

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-16">
          <span className="section-label">02. Skills &amp; Technologies</span>
          <h2 id="skills-heading" className="section-title mt-2">
            Tools and technologies{' '}
            <span className="gradient-text">I work with.</span>
          </h2>
          <p className="body-text mt-4 max-w-2xl mx-auto">
            Focused on mobile development, software engineering, and cybersecurity. No fake
            percentages — just the technologies I'm learning and using.
          </p>
          <div className="section-divider" aria-hidden="true" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Skills by category">
          {skills.map((group) => {
            const Icon = iconMap[group.icon]
            const c = colorMap[group.color] || colorMap['#00E5FF']

            return (
              <div key={group.category} role="listitem" className="glass-card-hover p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center`}>
                    {Icon && <Icon size={18} className={c.text} aria-hidden="true" />}
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">{group.category}</h3>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2" role="list" aria-label={`${group.category} skills`}>
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      role="listitem"
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border cursor-default hover:brightness-110 transition-all duration-200 ${c.badge}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Accent line */}
                <div
                  className="mt-4 h-0.5 rounded-full opacity-30"
                  style={{ background: `linear-gradient(to right, ${c.line}, transparent)` }}
                  aria-hidden="true"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
