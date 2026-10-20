import { useState } from 'react'
import { Mail, GitFork, Send, MessageCircle, Camera, CheckCircle, AlertCircle } from 'lucide-react'
const Github = GitFork
const Instagram = Camera
import { profile } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    color: '#00E5FF',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'MikiyasAfelew',
    href: profile.github,
    color: '#8B5CF6',
  },
  {
    icon: MessageCircle,
    label: 'Telegram',
    value: profile.telegramHandle,
    href: profile.telegram,
    color: '#00E5FF',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: profile.instagramHandle,
    href: profile.instagram,
    color: '#FF4D8D',
  },
]

export default function Contact() {
  const [ref, inView] = useInView()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)

    // Opens the user's mail client with pre-filled content
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, '_blank')

    setTimeout(() => {
      setSubmitted(true)
      setSubmitting(false)
      setForm({ name: '', email: '', message: '' })
    }, 800)
  }

  return (
    <section id="contact" className="py-24 relative" aria-labelledby="contact-heading">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, #00E5FF06 0%, transparent 70%)',
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
          <span className="section-label">07. Contact</span>
          <h2 id="contact-heading" className="section-title mt-2">
            Let's <span className="gradient-text">connect.</span>
          </h2>
          <p className="text-[#8A94A8] mt-4 max-w-xl mx-auto">
            Open to internships, collaborations and learning opportunities. Feel free to reach out.
          </p>
          <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left: contact cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-[#00E5FF] uppercase tracking-widest mb-6">
              Find me here
            </h3>

            {contacts.map((c) => {
              const Icon = c.icon
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="glass-card-hover flex items-center gap-4 p-4 group"
                  aria-label={`${c.label}: ${c.value}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${c.color}15`,
                      border: `1px solid ${c.color}33`,
                    }}
                  >
                    <Icon size={18} style={{ color: c.color }} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#8A94A8] uppercase tracking-widest">
                      {c.label}
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#00E5FF] transition-colors duration-200">
                      {c.value}
                    </div>
                  </div>
                  <div className="ml-auto text-[#8A94A8] group-hover:text-[#00E5FF] transition-colors duration-200">
                    →
                  </div>
                </a>
              )
            })}
          </div>

          {/* Right: contact form */}
          <div className="glass-card p-8">
            <h3 className="text-sm font-mono text-[#00E5FF] uppercase tracking-widest mb-6">
              Send a message
            </h3>

            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <CheckCircle size={48} className="text-green-400" aria-hidden="true" />
                <div>
                  <p className="text-white font-semibold">Message sent!</p>
                  <p className="text-[#8A94A8] text-sm mt-1">
                    Your mail client should have opened. I'll get back to you soon.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-[#00E5FF] hover:underline font-mono"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-mono text-[#8A94A8] mb-1.5 uppercase tracking-widest"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className={`w-full bg-navy-900/80 border rounded-xl px-4 py-3 text-sm text-white placeholder-[#8A94A8] focus:outline-none focus:ring-2 focus:ring-[#00E5FF44] transition-colors duration-200 ${
                      errors.name ? 'border-red-500/60' : 'border-white/10 focus:border-[#00E5FF55]'
                    }`}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    aria-invalid={!!errors.name}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p id="name-error" className="flex items-center gap-1 mt-1 text-xs text-red-400" role="alert">
                      <AlertCircle size={11} aria-hidden="true" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-mono text-[#8A94A8] mb-1.5 uppercase tracking-widest"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className={`w-full bg-navy-900/80 border rounded-xl px-4 py-3 text-sm text-white placeholder-[#8A94A8] focus:outline-none focus:ring-2 focus:ring-[#00E5FF44] transition-colors duration-200 ${
                      errors.email ? 'border-red-500/60' : 'border-white/10 focus:border-[#00E5FF55]'
                    }`}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p id="email-error" className="flex items-center gap-1 mt-1 text-xs text-red-400" role="alert">
                      <AlertCircle size={11} aria-hidden="true" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono text-[#8A94A8] mb-1.5 uppercase tracking-widest"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What's on your mind?"
                    rows={5}
                    className={`w-full bg-navy-900/80 border rounded-xl px-4 py-3 text-sm text-white placeholder-[#8A94A8] focus:outline-none focus:ring-2 focus:ring-[#00E5FF44] transition-colors duration-200 resize-none ${
                      errors.message ? 'border-red-500/60' : 'border-white/10 focus:border-[#00E5FF55]'
                    }`}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p id="message-error" className="flex items-center gap-1 mt-1 text-xs text-red-400" role="alert">
                      <AlertCircle size={11} aria-hidden="true" /> {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-navy-950/40 border-t-navy-950 rounded-full animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
