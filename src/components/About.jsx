import { Monitor, Code2, Shield, Sparkles, MapPin, BookOpen, Calendar } from 'lucide-react'
import { profile, passions, currentlyLearning } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

const iconMap = { Monitor, Code2, Shield, Sparkles }

export default function About() {
  const [ref, inView] = useInView()

  return (
    <section id="about" className="py-24 relative" aria-labelledby="about-heading">
      {/* Subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 100% 50%, #8B5CF608 0%, transparent 70%)',
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
          <span className="section-label">01. About Me</span>
          <h2 id="about-heading" className="section-title mt-2">
            Building skills,{' '}
            <span className="gradient-text">one project at a time.</span>
          </h2>
          <p className="text-[#8A94A8] mt-4 max-w-2xl mx-auto">
            Software Engineering student focused on building practical applications, mastering mobile
            development, and understanding cybersecurity fundamentals.
          </p>
          <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Bio + passions */}
          <div className="space-y-6">
            {profile.bio.map((para, i) => (
              <p key={i} className="text-[#8A94A8] leading-relaxed">
                {para}
              </p>
            ))}

            {/* Passions */}
            <div>
              <h3 className="text-sm font-mono text-[#00E5FF] mb-3 uppercase tracking-widest">
                What I'm passionate about
              </h3>
              <div className="flex flex-wrap gap-2">
                {passions.map((p) => {
                  const Icon = iconMap[p.icon]
                  return (
                    <span
                      key={p.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-800 border border-white/5 text-sm text-[#E6EAF2] hover:border-[#00E5FF44] hover:text-[#00E5FF] transition-all duration-200"
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
              <div className="glass-card p-4 text-center">
                <MapPin size={18} className="text-[#00E5FF] mx-auto mb-1" aria-hidden="true" />
                <div className="text-xs text-[#8A94A8] font-mono">Location</div>
                <div className="text-sm font-semibold text-white mt-1">{profile.location}</div>
              </div>
              <div className="glass-card p-4 text-center">
                <BookOpen size={18} className="text-[#8B5CF6] mx-auto mb-1" aria-hidden="true" />
                <div className="text-xs text-[#8A94A8] font-mono">Status</div>
                <div className="text-sm font-semibold text-white mt-1">{profile.status}</div>
              </div>
              <div className="glass-card p-4 text-center">
                <Calendar size={18} className="text-[#FF4D8D] mx-auto mb-1" aria-hidden="true" />
                <div className="text-xs text-[#8A94A8] font-mono">Graduating</div>
                <div className="text-sm font-semibold text-white mt-1">{profile.graduating}</div>
              </div>
            </div>
          </div>

          {/* Right: Info cards + Currently learning */}
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
                  <div className="text-xs font-mono text-[#8A94A8] uppercase tracking-widest">
                    {item.label}
                  </div>
                  <div className="text-sm font-semibold text-white mt-1 leading-snug">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Currently learning card */}
            <div className="glass-card p-5 border-l-2 border-[#00E5FF]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#00E5FF22] flex items-center justify-center">
                  <span className="text-[#00E5FF] text-xs" aria-hidden="true">⚡</span>
                </div>
                <span className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest">
                  Currently learning / building
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentlyLearning.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00E5FF0A] border border-[#00E5FF22] text-xs font-mono text-[#00E5FF]"
                  >
                    <span aria-hidden="true">✦</span> {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Profile image in About */}
            <div className="glass-card p-4 flex items-center gap-4">
              <img
                src={profile.avatar}
                alt="Mikiyas Afelew"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#00E5FF44]"
                loading="lazy"
              />
              <div>
                <div className="font-semibold text-white">{profile.name}</div>
                <div className="text-xs text-[#8A94A8] font-mono mt-0.5">
                  Software Engineer · Cybersecurity Enthusiast
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                  <span className="text-xs text-green-400">Open to opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
