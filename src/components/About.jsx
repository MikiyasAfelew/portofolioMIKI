import { Monitor, Code2, Shield, Sparkles, MapPin, BookOpen, Calendar, TrendingUp } from 'lucide-react'
import { profile, passions, currentlyLearning } from '../data/portfolio'
import { useInView } from '../hooks/useInView'
import { useTilt } from '../hooks/useTilt'

const iconMap = { Monitor, Code2, Shield, Sparkles }

const quickFacts = [
  { icon: MapPin,   label: 'Location',   value: 'Ethiopia' },
  { icon: BookOpen, label: 'Status',     value: 'Student + Intern' },
  { icon: Calendar, label: 'Graduating', value: '2027' },
]

const infoGrid = [
  { label: 'University', value: 'Debre Berhan University', icon: '🎓' },
  { label: 'Degree',     value: 'Software Engineering',    icon: '📖' },
  { label: 'Graduation', value: 'Expected 2027',           icon: '📅' },
  { label: 'Focus',      value: 'Mobile · Security · DevSecOps', icon: '🎯' },
]

function TiltCard({ children, className = '' }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(5)
  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className={`card-hover ${className}`}>
      {children}
    </div>
  )
}

export default function About() {
  const [ref, inView] = useInView()

  return (
    <section id="about" className="py-24 relative overflow-hidden" aria-labelledby="about-heading">
      {/* Subtle bg blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-[#1E3A5F] opacity-[0.04] blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-[#1E3A5F] opacity-[0.03] blur-3xl" />
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label">01. About Me</span>
          <h2 id="about-heading" className="section-title mt-2">
            Building skills,{' '}
            <span className="gradient-text">one project at a time.</span>
          </h2>
          <p className="body-text mt-4 max-w-2xl mx-auto">
            Software Engineering student focused on building practical applications, mastering
            mobile development, and understanding cybersecurity fundamentals.
          </p>
          <div className="section-divider" aria-hidden="true" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── LEFT ── */}
          <div className="space-y-6">
            {profile.bio.map((para, i) => (
              <p key={i} className="body-text leading-relaxed text-base">{para}</p>
            ))}

            {/* Passion chips */}
            <div>
              <h3 className="text-xs font-mono text-[#1E3A5F] dark:text-[#7BBFFF] mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="w-4 h-px bg-[#1E3A5F] dark:bg-[#7BBFFF]" aria-hidden="true" />
                What I'm passionate about
              </h3>
              <div className="flex flex-wrap gap-2">
                {passions.map((p) => {
                  const Icon = iconMap[p.icon]
                  return (
                    <span
                      key={p.label}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                                 bg-slate-50 dark:bg-[#1A1A1A]
                                 border border-slate-200 dark:border-white/[0.07]
                                 text-sm text-[#374151] dark:text-[#D1D5DB]
                                 hover:border-[#1E3A5F66] dark:hover:border-white/20
                                 hover:text-[#1E3A5F] dark:hover:text-white
                                 hover:bg-[#1E3A5F08] dark:hover:bg-white/[0.05]
                                 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                    >
                      {Icon && <Icon size={13} aria-hidden="true" />}
                      {p.label}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {quickFacts.map(({ icon: Icon, label, value }) => (
                <TiltCard key={label} className="p-4 text-center">
                  {/* Corner accent */}
                  <div
                    className="absolute top-0 right-0 w-8 h-8 opacity-10 rounded-bl-2xl"
                    style={{ background: 'linear-gradient(135deg, transparent 50%, #1E3A5F 50%)' }}
                    aria-hidden="true"
                  />
                  <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center
                                  bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                                  border border-[#1E3A5F22] dark:border-[#2A529855]">
                    <Icon size={15} className="text-[#1E3A5F] dark:text-[#7BBFFF]" aria-hidden="true" />
                  </div>
                  <div className="text-xs text-[#6B7280] dark:text-[#6B7280] font-mono uppercase tracking-wider">{label}</div>
                  <div className="text-xs font-bold text-[#0A0A0A] dark:text-white mt-1 leading-tight">{value}</div>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="space-y-4">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {infoGrid.map((item, idx) => (
                <div
                  key={item.label}
                  className="card-glow group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
                >
                  <div className="card-glow-inner p-5 relative">
                    <div className="text-2xl mb-3 inline-block group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300" aria-hidden="true">
                      {item.icon}
                    </div>
                    <div className="text-xs font-mono uppercase tracking-widest text-[#1E3A5F] dark:text-[#4A90D9]">
                      {item.label}
                    </div>
                    <div className="text-sm font-semibold text-[#0A0A0A] dark:text-white mt-1 leading-snug">
                      {item.value}
                    </div>
                    {/* Bottom glow on hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to right, transparent, #1E3A5F, transparent)' }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Currently learning */}
            <div className="relative card overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#1E3A5F] dark:bg-[#2A5298]" aria-hidden="true" />
              <div className="absolute inset-0 bg-[#1E3A5F] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" aria-hidden="true" />
              <div className="relative p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#1E3A5F0D] dark:bg-[#1E3A5F44] flex items-center justify-center border border-[#1E3A5F22] dark:border-[#2A529866]">
                    <TrendingUp size={13} className="text-[#1E3A5F] dark:text-[#7BBFFF]" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-mono text-[#1E3A5F] dark:text-[#7BBFFF] uppercase tracking-widest">
                    Currently learning / building
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentlyLearning.map((item, i) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                 bg-[#1E3A5F0A] dark:bg-[#1E3A5F33]
                                 border border-[#1E3A5F1A] dark:border-[#2A529855]
                                 text-xs font-mono text-[#1E3A5F] dark:text-[#7BBFFF]
                                 hover:-translate-y-0.5 transition-all duration-200 cursor-default
                                 animate-fade-in-up"
                      style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                    >
                      <span className="text-[10px]" aria-hidden="true">✦</span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile mini-card */}
            <TiltCard className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={profile.avatar}
                    alt="Mikiyas Afelew"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#1E3A5F33] dark:border-[#2A529855]"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#1E3A5F] dark:bg-[#2A5298] border-2 border-white dark:border-[#141414] neon-dot" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#0A0A0A] dark:text-white truncate">{profile.name}</div>
                  <div className="text-xs text-[#6B7280] font-mono mt-0.5">
                    Software Engineer · Cybersecurity Enthusiast
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="flex items-center gap-1 text-xs
                                     text-[#1E3A5F] dark:text-[#7BBFFF]
                                     bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                                     border border-[#1E3A5F22] dark:border-[#2A529855]
                                     px-2 py-0.5 rounded-full font-mono">
                      <span className="w-1 h-1 rounded-full bg-[#1E3A5F] dark:bg-[#7BBFFF] animate-pulse" aria-hidden="true" />
                      Open to opportunities
                    </span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  )
}
