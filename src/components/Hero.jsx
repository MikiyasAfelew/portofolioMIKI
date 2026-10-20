import { useState, useEffect } from 'react'
import { GitFork, ChevronDown, ArrowRight, Mail } from 'lucide-react'
const Github = GitFork
import { profile } from '../data/portfolio'

function useTyping(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    let t
    if (!deleting && charIdx <= current.length)      t = setTimeout(() => setCharIdx(c => c + 1), speed)
    else if (!deleting && charIdx > current.length)  t = setTimeout(() => setDeleting(true), pause)
    else if (deleting && charIdx > 0)                t = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    else { setDeleting(false); setWordIdx(w => (w + 1) % words.length) }
    setDisplay(current.slice(0, charIdx))
    return () => clearTimeout(t)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return display
}

export default function Hero({ darkMode }) {
  const typed = useTyping(profile.taglines)
  const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16" aria-label="Hero section">

      {/* Subtle top radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(30,58,95,0.07) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── TEXT ── */}
          <div className="space-y-7 order-2 lg:order-1">

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                            border border-[#1E3A5F22] dark:border-[#2A529855]
                            text-[#1E3A5F] dark:text-[#7BBFFF] text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F] dark:bg-[#7BBFFF] animate-pulse" aria-hidden="true" />
              Open to opportunities
            </div>

            {/* Name */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight text-[#0A0A0A] dark:text-white">
              Hi, I'm{' '}
              <span className="gradient-text block mt-1">Mikiyas</span>
            </h1>

            {/* Typing */}
            <div className="flex items-center gap-2 font-mono text-sm sm:text-base">
              <span className="text-[#1E3A5F] dark:text-[#4A90D9]">&gt;_</span>
              <span className="text-[#1A1A1A] dark:text-white">{typed}</span>
              <span className="animate-blink text-[#1E3A5F] dark:text-[#4A90D9]">|</span>
            </div>

            {/* Bio */}
            <p className="body-text text-base sm:text-lg leading-relaxed max-w-lg">
              A student at Debre Berhan University building secure, practical software
              and growing into DevSecOps and mobile development.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => go('#projects')} className="btn-primary flex items-center gap-2">
                View Projects <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button onClick={() => go('#contact')} className="btn-outline flex items-center gap-2">
                <Mail size={15} aria-hidden="true" /> Contact Me
              </button>
              <a
                href={profile.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                           text-[#6B7280] dark:text-[#9CA3AF]
                           border border-slate-200 dark:border-white/[0.08]
                           hover:border-[#1E3A5F44] dark:hover:border-white/20
                           hover:text-[#1E3A5F] dark:hover:text-white
                           hover:bg-slate-50 dark:hover:bg-white/[0.04]
                           transition-all duration-200"
                aria-label="GitHub profile"
              >
                <Github size={15} aria-hidden="true" /> GitHub
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-2">
              {profile.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold gradient-text">{s.value}</div>
                  <div className="text-xs text-[#6B7280] dark:text-[#6B7280] font-mono mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── IMAGE ── */}
          <div className="flex justify-center order-1 lg:order-2" aria-hidden="true">
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full animate-pulse-glow" style={{ margin: '-8px' }} />
              {/* Spinning ring — dark blue only */}
              <div
                className="absolute inset-0 rounded-full animate-spin-slow"
                style={{
                  margin: '-4px',
                  background: 'conic-gradient(from 0deg, #1E3A5F, #2A5298, #0A0A0A, #1E3A5F)',
                  padding: '2px',
                  borderRadius: '50%',
                }}
              >
                <div className="w-full h-full rounded-full" style={{ background: darkMode ? '#0A0A0A' : '#ffffff' }} />
              </div>
              {/* Photo */}
              <div className="animate-float relative z-10">
                <img
                  src={profile.avatar}
                  alt="Mikiyas Afelew profile photo"
                  className="w-56 h-56 sm:w-72 sm:h-72 rounded-full object-cover"
                  style={{
                    boxShadow: darkMode
                      ? '0 0 0 3px #0A0A0A, 0 0 0 5px #1E3A5F66'
                      : '0 0 0 3px #ffffff, 0 0 0 5px #1E3A5F44',
                  }}
                  loading="eager"
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 z-20 bg-white dark:bg-[#141414] border border-[#1E3A5F22] dark:border-white/[0.08] rounded-xl px-4 py-2 shadow-lg">
                <span className="text-xs font-mono font-bold text-[#1E3A5F] dark:text-[#7BBFFF]">SE</span>
                <span className="text-xs text-[#6B7280] dark:text-[#6B7280] ml-1">@ DBU</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={() => go('#about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#1E3A5F] dark:hover:text-white transition-colors duration-200"
        aria-label="Scroll to About"
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" aria-hidden="true" />
      </button>
    </section>
  )
}
