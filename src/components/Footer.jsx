import { GitFork, Mail, MessageCircle, Camera, ArrowUp } from 'lucide-react'
const Github = GitFork
const Instagram = Camera
import { profile, navLinks } from '../data/portfolio'

const socials = [
  { icon: Github,        href: profile.github,            label: 'GitHub'    },
  { icon: Mail,          href: `mailto:${profile.email}`, label: 'Email'     },
  { icon: MessageCircle, href: profile.telegram,          label: 'Telegram'  },
  { icon: Instagram,     href: profile.instagram,         label: 'Instagram' },
]

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/[0.06] bg-slate-50/80 dark:bg-[#0A0A0A]/80 backdrop-blur-sm">

      {/* Back to top */}
      <button
        onClick={scrollTop}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full
                   bg-white dark:bg-[#141414]
                   border border-[#1E3A5F22] dark:border-[#1E3A5F44]
                   flex items-center justify-center
                   text-[#1E3A5F] dark:text-[#7BBFFF]
                   hover:bg-[#1E3A5F0D] dark:hover:bg-[#1E3A5F33]
                   hover:border-[#1E3A5F55] dark:hover:border-[#2A529888]
                   shadow-md transition-all duration-200"
        aria-label="Back to top"
      >
        <ArrowUp size={15} aria-hidden="true" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-xs">
                MA
              </span>
              <span className="font-bold text-[#0A0A0A] dark:text-white">
                Mikiyas<span className="text-[#1E3A5F] dark:text-[#4A90D9]">.</span>
              </span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed max-w-xs">
              Software Engineering student at Debre Berhan University. Aspiring DevSecOps engineer and mobile developer.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="text-xs font-mono text-[#1E3A5F] dark:text-[#7BBFFF] uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' }) }}
                    className="text-xs font-mono text-[#6B7280] hover:text-[#1E3A5F] dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div>
            <h3 className="text-xs font-mono text-[#1E3A5F] dark:text-[#7BBFFF] uppercase tracking-widest mb-4">
              Connect
            </h3>
            <div className="flex gap-2.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center
                             bg-white dark:bg-[#141414]
                             border border-slate-200 dark:border-white/[0.07]
                             text-[#6B7280]
                             hover:text-[#1E3A5F] dark:hover:text-[#7BBFFF]
                             hover:border-[#1E3A5F33] dark:hover:border-[#2A529866]
                             hover:bg-[#1E3A5F08] dark:hover:bg-[#1E3A5F22]
                             transition-all duration-200 shadow-sm"
                  aria-label={label}
                >
                  <Icon size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#6B7280] font-mono">
            © {new Date().getFullYear()} Mikiyas Afelew. All rights reserved.
          </p>
          <p className="text-xs text-[#6B7280] font-mono">
            Built with passion, coffee and a little anime <span aria-label="sparkles">✨</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
