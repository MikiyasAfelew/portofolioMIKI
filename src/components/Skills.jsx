import {
  Code2, Smartphone, ShieldCheck, Wrench, Database, GraduationCap
} from 'lucide-react'
import { skills } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

const iconMap = { Code2, Smartphone, ShieldCheck, Wrench, Database, GraduationCap }

const colorMap = {
  '#00E5FF': { bg: 'bg-[#00E5FF11]', border: 'border-[#00E5FF33]', text: 'text-[#00E5FF]', bar: '#00E5FF' },
  '#8B5CF6': { bg: 'bg-[#8B5CF611]', border: 'border-[#8B5CF633]', text: 'text-[#8B5CF6]', bar: '#8B5CF6' },
  '#FF4D8D': { bg: 'bg-[#FF4D8D11]', border: 'border-[#FF4D8D33]', text: 'text-[#FF4D8D]', bar: '#FF4D8D' },
}

export default function Skills() {
  const [ref, inView] = useInView()

  return (
    <section id="skills" className="py-24 relative" aria-labelledby="skills-heading">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, #00E5FF04 0%, transparent 70%)',
        }}
      />

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="section-label">02. Skills &amp; Technologies</span>
          <h2 id="skills-heading" className="section-title mt-2">
            Tools and technologies{' '}
            <span className="gradient-text">I work with.</span>
          </h2>
          <p className="text-[#8A94A8] mt-4 max-w-2xl mx-auto">
            Focused on mobile development, software engineering, and cybersecurity. No fake
            percentages — just the technologies I'm learning and using.
          </p>
          <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] rounded-full" />
        </div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Skills by category">
          {skills.map((group) => {
            const Icon = iconMap[group.icon]
            const colors = colorMap[group.color] || colorMap['#00E5FF']

            return (
              <div
                key={group.category}
                role="listitem"
                className="glass-card-hover p-6"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}
                  >
                    {Icon && (
                      <Icon size={18} className={colors.text} aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="font-semibold text-white">{group.category}</h3>
                </div>

                {/* Skill badges */}
                <div className="flex flex-wrap gap-2" role="list" aria-label={`${group.category} skills`}>
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      role="listitem"
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono ${colors.bg} ${colors.border} border ${colors.text} hover:brightness-125 transition-all duration-200 cursor-default`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Bottom accent line */}
                <div
                  className="mt-4 h-0.5 rounded-full opacity-30"
                  style={{ background: `linear-gradient(to right, ${group.color}, transparent)` }}
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
