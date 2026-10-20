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
    let timeout
    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed)
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setWordIdx((w) => (w + 1) % words.length)
    }
    setDisplay(current.slice(0, charIdx))
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return display
}

export default function Hero({ darkMode }) {
  const typedText = useTyping(profile.taglines)
  const scrollTo = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-16"
      aria-label="Hero section"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: darkMode
            ? 'radial-gradient(ellipse 80% 60% at 50% 0%, #00E5FF08 0%, transparent 70%)'
            : 'radial-gradient(ellipse 80% 60% at 50% 0%, #0099CC0D 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Text ── */}
          <div className="space-y-6 order-2 lg:order-1">

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0099CC11] dark:bg-[#00E5FF11] border border-[#0099CC33] dark:border-[#00E5FF33] text-[#0077AA] dark:text-[#00E5FF] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#0099CC] dark:bg-[#00E5FF] animate-pulse" aria-hidden="true" />
              Open to opportunities
            </div>

            {/* Name */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">
              Hi, I'm{' '}
              <span className="gradient-text block mt-1">Mikiyas</span>
            </h1>

            {/* Typing */}
            <div className="flex items-center gap-2 font-mono text-sm sm:text-base">
              <span className="text-[#0099CC] dark:text-[#00E5FF]">&gt;_</span>
              <span className="text-slate-700 dark:text-[#E6EAF2]">{typedText}</span>
              <span className="animate-blink text-[#0099CC] dark:text-[#00E5FF]">|</span>
            </div>

            {/* Bio */}
            <p className="text-slate-500 dark:text-[#8A94A8] text-base sm:text-lg leading-relaxed max-w-lg">
              A student at Debre Berhan University building secure, practical software
              and growing into DevSecOps and mobile development.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => scrollTo('#projects')} className="btn-primary flex items-center gap-2">
                View Projects <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button onClick={() => scrollTo('#contact')} className="btn-outline flex items-center gap-2">
                <Mail size={16} aria-hidden="true" /> Contact Me
              </button>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-500 dark:text-[#8A94A8] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 text-sm font-semibold transition-all duration-200 hover:bg-slate-50 dark:hover:bg-white/5"
                aria-label="GitHub profile (opens in new tab)"
              >
                <Github size={16} aria-hidden="true" /> GitHub
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {profile.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold gradient-text">{s.value}</div>
                  <div className="text-xs text-slate-400 dark:text-[#8A94A8] font-mono mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Profile image ── */}
          <div className="flex justify-center order-1 lg:order-2" aria-hidden="true">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-pulse-glow" style={{ margin: '-8px' }} />
              {/* Spinning gradient ring */}
              <div
                className="absolute inset-0 rounded-full animate-spin-slow"
                style={{
                  margin: '-4px',
                  background: 'conic-gradient(from 0deg, #00E5FF, #8B5CF6, #FF4D8D, #00E5FF)',
                  padding: '2px',
                  borderRadius: '50%',
                }}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{ background: darkMode ? '#0B0F1A' : '#ffffff' }}
                />
              </div>
              {/* Image */}
              <div className="animate-float relative z-10">
                <img
                  src={profile.avatar}
                  alt="Mikiyas Afelew profile photo"
                  className="w-56 h-56 sm:w-72 sm:h-72 rounded-full object-cover"
                  style={{
                    boxShadow: darkMode
                      ? '0 0 0 3px #0B0F1A, 0 0 0 5px #00E5FF44'
                      : '0 0 0 3px #ffffff, 0 0 0 5px #0099CC44',
                  }}
                  loading="eager"
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 z-20 bg-white dark:bg-[#121829] border border-[#0099CC33] dark:border-[#00E5FF33] rounded-xl px-4 py-2 shadow-lg shadow-slate-200/50 dark:shadow-black/40">
                <span className="text-xs font-mono text-[#0099CC] dark:text-[#00E5FF]">SE</span>
                <span className="text-xs text-slate-400 dark:text-[#8A94A8] ml-1">@ DBU</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo('#about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-[#8A94A8] hover:text-[#0099CC] dark:hover:text-[#00E5FF] transition-colors duration-200 group"
        aria-label="Scroll to About section"
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" aria-hidden="true" />
      </button>
    </section>
  )
}
