import { useState } from 'react'
import { Code2, Smartphone, ShieldCheck, Wrench, Database, GraduationCap } from 'lucide-react'
import { skills } from '../data/portfolio'
import { useInView } from '../hooks/useInView'
import { useTilt } from '../hooks/useTilt'

const iconMap = { Code2, Smartphone, ShieldCheck, Wrench, Database, GraduationCap }

function SkillCard({ group, idx }) {
  const [hovered, setHovered] = useState(false)
  const { ref, onMouseMove, onMouseLeave: tiltLeave } = useTilt(5)
  const Icon = iconMap[group.icon]

  return (
    <div
      ref={ref}
      role="listitem"
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={(e) => { setHovered(false); tiltLeave(e) }}
      className="card-hover p-6 flex flex-col gap-4 group animate-fade-in-up"
      style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
    >
      {/* Mouse spotlight */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: 'radial-gradient(300px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(30,58,95,0.07), transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center
                     bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                     border border-[#1E3A5F1A] dark:border-[#2A529855]
                     group-hover:bg-[#1E3A5F18] dark:group-hover:bg-[#1E3A5F44]
                     group-hover:scale-110 transition-all duration-300"
        >
          {Icon && <Icon size={19} className="text-[#1E3A5F] dark:text-[#7BBFFF]" aria-hidden="true" />}
        </div>
        <h3 className="font-bold text-[#0A0A0A] dark:text-white text-sm">{group.category}</h3>
        {/* Count bubble */}
        <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded-full
                         bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                         border border-[#1E3A5F1A] dark:border-[#2A529844]
                         text-[#1E3A5F] dark:text-[#7BBFFF]">
          {group.items.length}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2" role="list" aria-label={`${group.category} skills`}>
        {group.items.map((skill) => (
          <span
            key={skill}
            role="listitem"
            className="px-2.5 py-1 rounded-lg text-xs font-mono border cursor-default
                       bg-[#1E3A5F08] dark:bg-[#1E3A5F22]
                       border-[#1E3A5F1A] dark:border-[#2A529844]
                       text-[#1E3A5F] dark:text-[#9CB8D9]
                       hover:bg-[#1E3A5F15] dark:hover:bg-[#1E3A5F33]
                       hover:text-[#0A0A0A] dark:hover:text-white
                       hover:-translate-y-0.5 transition-all duration-150"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Bottom accent */}
      <div
        className="mt-auto h-px rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to right, #1E3A5F, transparent)' }}
        aria-hidden="true"
      />
    </div>
  )
}

export default function Skills() {
  const [ref, inView] = useInView()

  return (
    <section id="skills" className="py-24 relative overflow-hidden" aria-labelledby="skills-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#1E3A5F] opacity-[0.03] blur-3xl" />
      </div>

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
            Focused on mobile development, software engineering, and cybersecurity.
            No fake percentages — just the technologies I'm learning and using.
          </p>
          <div className="section-divider" aria-hidden="true" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" role="list" aria-label="Skills by category">
          {skills.map((group, idx) => (
            <SkillCard key={group.category} group={group} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}
