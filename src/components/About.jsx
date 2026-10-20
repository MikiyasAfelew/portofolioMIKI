import { Monitor, Code2, Shield, Sparkles, MapPin, BookOpen, Calendar } from 'lucide-react'
import { profile, passions, currentlyLearning } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

const iconMap = { Monitor, Code2, Shield, Sparkles }

export default function About() {
  const [ref, inView] = useInView()

  return (
    <section id="about" className="py-24 relative" aria-labelledby="about-heading">
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
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label">01. About Me</span>
          <h2 id="about-heading" className="section-title mt-2">
            Building skills,{' '}
            <span className="gradient-text">one project at a time.</span>
          </h2>
          <p className="body-text mt-4 max-w-2xl mx-auto">
            Software Engineering student focused on building practical applications, mastering mobile
            development, and understanding cybersecurity fundamentals.
          </p>
          <div className="section-divider" aria-hidden="true" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── Left ── */}
          <div className="space-y-6">
            {profile.bio.map((para, i) => (
              <p key={i} className="body-text leading-relaxed">{para}</p>
            ))}

            {/* Passion chips */}
            <div>
              <h3 className="text-sm font-mono text-[#0099CC] dark:text-[#00E5FF] mb-3 uppercase tracking-widest">
                What I'm passionate about
              </h3>
              <div className="flex flex-wrap gap-2">
                {passions.map((p) => {
                  const Icon = iconMap[p.icon]
                  return (
                    <span
                      key={p.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#121829] border border-slate-200 dark:border-white/5 text-sm text-slate-700 dark:text-[#E6EAF2] hover:border-[#0099CC44] dark:hover:border-[#00E5FF44] hover:text-[#0099CC] dark:hover:text-[#00E5FF] transition-all duration-200"
                    >
                      {Icon && <Icon size={13} aria-hidden="true" />}
                      {p.label}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: MapPin, color: 'text-[#0099CC] dark:text-[#00E5FF]', label: 'Location', value: profile.location },
                { icon: BookOpen, color: 'text-[#7C3AED] dark:text-[#8B5CF6]', label: 'Status', value: profile.status },
                { icon: Calendar, color: 'text-[#e0396e] dark:text-[#FF4D8D]', label: 'Graduating', value: profile.graduating },
              ].map(({ icon: Icon, color, label, value }) => (
                <div key={label} className="glass-card p-4 text-center">
                  <Icon size={18} className={`${color} mx-auto mb-1`} aria-hidden="true" />
                  <div className="text-xs text-slate-400 dark:text-[#8A94A8] font-mono">{label}</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white mt-1">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right ── */}
          <div className="space-y-4">
            {/* University info grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'University', value: 'Debre Berhan University', icon: '🎓' },
                { label: 'Degree', value: 'Software Engineering', icon: '📖' },
                { label: 'Graduation', value: 'Expected 2027', icon: '📅' },
                { label: 'Focus', value: 'Mobile, Security, DevSecOps', icon: '🎯' },
              ].map((item) => (
                <div key={item.label} className="glass-card-hover p-4">
                  <div className="text-xl mb-2" aria-hidden="true">{item.icon}</div>
                  <div className="text-xs font-mono text-slate-400 dark:text-[#8A94A8] uppercase tracking-widest">
                    {item.label}
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white mt-1 leading-snug">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Currently learning */}
            <div className="glass-card p-5 border-l-2 border-[#0099CC] dark:border-[#00E5FF]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#0099CC22] dark:bg-[#00E5FF22] flex items-center justify-center">
                  <span className="text-[#0099CC] dark:text-[#00E5FF] text-xs" aria-hidden="true">⚡</span>
                </div>
                <span className="text-xs font-mono text-[#0099CC] dark:text-[#00E5FF] uppercase tracking-widest">
                  Currently learning / building
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentlyLearning.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0099CC0A] dark:bg-[#00E5FF0A] border border-[#0099CC22] dark:border-[#00E5FF22] text-xs font-mono text-[#0077AA] dark:text-[#00E5FF]"
                  >
                    <span aria-hidden="true">✦</span> {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Profile mini card */}
            <div className="glass-card p-4 flex items-center gap-4">
              <img
                src={profile.avatar}
                alt="Mikiyas Afelew"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#0099CC44] dark:border-[#00E5FF44]"
                loading="lazy"
              />
              <div>
                <div className="font-semibold text-slate-800 dark:text-white">{profile.name}</div>
                <div className="text-xs text-slate-400 dark:text-[#8A94A8] font-mono mt-0.5">
                  Software Engineer · Cybersecurity Enthusiast
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                  <span className="text-xs text-green-600 dark:text-green-400">Open to opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
