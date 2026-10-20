import { GitFork, Mail, MessageCircle, Camera, ArrowUp } from 'lucide-react'
const Github = GitFork
const Instagram = Camera
import { profile, navLinks } from '../data/portfolio'

const socials = [
  { icon: Github,    href: profile.github,             label: 'GitHub' },
  { icon: Mail,      href: `mailto:${profile.email}`,  label: 'Email' },
  { icon: MessageCircle, href: profile.telegram,       label: 'Telegram' },
  { icon: Instagram, href: profile.instagram,          label: 'Instagram' },
]

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-[#0B0F1A]/80 backdrop-blur-sm">
      {/* Back to top */}
      <button
        onClick={scrollTop}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#121829] border border-[#0099CC33] dark:border-[#00E5FF33] flex items-center justify-center text-[#0099CC] dark:text-[#00E5FF] hover:bg-[#0099CC11] dark:hover:bg-[#00E5FF11] hover:border-[#0099CC] dark:hover:border-[#00E5FF] transition-all duration-200 shadow-md shadow-slate-200/60 dark:shadow-black/40"
        aria-label="Back to top"
      >
        <ArrowUp size={16} aria-hidden="true" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0099CC] to-[#7C3AED] dark:from-[#00E5FF] dark:to-[#8B5CF6] flex items-center justify-center text-white dark:text-[#0B0F1A] font-bold text-sm">
                MA
              </span>
              <span className="font-bold text-slate-800 dark:text-white">
                Mikiyas<span className="text-[#0099CC] dark:text-[#00E5FF]">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8A94A8] leading-relaxed max-w-xs">
              Software Engineering student at Debre Berhan University. Aspiring DevSecOps engineer and mobile developer.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="text-xs font-mono text-[#0099CC] dark:text-[#00E5FF] uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.querySelector(link.href)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="text-xs text-slate-400 dark:text-[#8A94A8] hover:text-[#0099CC] dark:hover:text-[#00E5FF] transition-colors duration-200 font-mono"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div>
            <h3 className="text-xs font-mono text-[#0099CC] dark:text-[#00E5FF] uppercase tracking-widest mb-4">
              Connect
            </h3>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-[#8A94A8] hover:text-[#0099CC] dark:hover:text-[#00E5FF] hover:border-[#0099CC44] dark:hover:border-[#00E5FF44] transition-all duration-200 shadow-sm"
                  aria-label={label}
                >
                  <Icon size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-[#8A94A8] font-mono">
          <p>© {new Date().getFullYear()} Mikiyas Afelew. All rights reserved.</p>
          <p>Built with passion, coffee and a little anime <span aria-label="sparkles">✨</span></p>
        </div>
      </div>
    </footer>
  )
}
