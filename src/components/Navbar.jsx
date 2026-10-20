import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { navLinks } from '../data/portfolio'
import { useScrollSpy } from '../hooks/useScrollSpy'

const sectionIds = navLinks.map((l) => l.href.replace('#', ''))

export default function Navbar({ darkMode, toggleDark }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useScrollSpy(sectionIds)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/92 dark:bg-[#0A0A0A]/92 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.06] shadow-sm'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16" aria-label="Main navigation">

        {/* Logo */}
        <a href="#home" onClick={(e) => { e.preventDefault(); go('#home') }} className="flex items-center gap-2.5 group" aria-label="Home">
          <span className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-xs tracking-wide">
            MA
          </span>
          <span className="hidden sm:block font-bold text-[#0A0A0A] dark:text-white group-hover:text-[#1E3A5F] dark:group-hover:text-[#7BBFFF] transition-colors duration-200">
            Mikiyas<span className="text-[#1E3A5F] dark:text-[#4A90D9]">.</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-0.5" role="list">
          {navLinks.map(({ label, href }) => {
            const id = href.replace('#', '')
            const isActive = active === id
            return (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => { e.preventDefault(); go(href) }}
                  className={`relative px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-[#1E3A5F] dark:text-white font-semibold'
                      : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1E3A5F] dark:bg-white rounded-full" />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1E3A5F] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all duration-200"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all duration-200"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
          bg-white/96 dark:bg-[#0A0A0A]/96 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.06]`}
      >
        <ul className="px-4 py-3 flex flex-col gap-0.5">
          {navLinks.map(({ label, href }) => {
            const isActive = active === href.replace('#', '')
            return (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => { e.preventDefault(); go(href) }}
                  className={`block px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-[#1E3A5F] dark:text-white font-semibold bg-[#1E3A5F0D] dark:bg-white/[0.07]'
                      : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </header>
  )
}
