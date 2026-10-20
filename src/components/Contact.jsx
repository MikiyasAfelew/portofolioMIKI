import { useState } from 'react'
import { Mail, GitFork, Send, MessageCircle, Camera, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react'
const Github = GitFork
const Instagram = Camera
import { profile } from '../data/portfolio'
import { useInView } from '../hooks/useInView'
import { useTilt } from '../hooks/useTilt'

const contacts = [
  { icon: Mail,          label: 'Email',     value: profile.email,           href: `mailto:${profile.email}`, desc: 'Drop me a line anytime' },
  { icon: Github,        label: 'GitHub',    value: 'MikiyasAfelew',         href: profile.github,            desc: 'See my code & projects'  },
  { icon: MessageCircle, label: 'Telegram',  value: profile.telegramHandle,  href: profile.telegram,          desc: 'Quick chat welcome'       },
  { icon: Instagram,     label: 'Instagram', value: profile.instagramHandle, href: profile.instagram,         desc: 'Follow my journey'        },
]

function ContactCard({ c }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(5)
  const Icon = c.icon
  return (
    <a
      ref={ref}
      href={c.href}
      target={c.href.startsWith('mailto') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="card-hover flex items-center gap-4 p-4 group"
      aria-label={`${c.label}: ${c.value}`}
    >
      {/* Spotlight */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(300px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(30,58,95,0.08), transparent 60%)' }}
        aria-hidden="true"
      />

      {/* Icon */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                      bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                      border border-[#1E3A5F1A] dark:border-[#2A529855]
                      group-hover:bg-[#1E3A5F18] dark:group-hover:bg-[#1E3A5F44]
                      group-hover:scale-110 transition-all duration-300">
        <Icon size={17} className="text-[#1E3A5F] dark:text-[#7BBFFF]" aria-hidden="true" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">{c.label}</div>
        <div className="text-sm font-bold text-[#0A0A0A] dark:text-white truncate
                        group-hover:text-[#1E3A5F] dark:group-hover:text-[#7BBFFF] transition-colors duration-200">
          {c.value}
        </div>
        <div className="text-xs text-[#6B7280] mt-0.5">{c.desc}</div>
      </div>

      {/* Arrow */}
      <ArrowUpRight
        size={15}
        className="flex-shrink-0 text-slate-300 dark:text-white/10
                   group-hover:text-[#1E3A5F] dark:group-hover:text-[#7BBFFF]
                   group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                   transition-all duration-200"
        aria-hidden="true"
      />

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-40 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to right, transparent, #1E3A5F, transparent)' }}
        aria-hidden="true"
      />
    </a>
  )
}

export default function Contact() {
  const [ref, inView] = useInView()
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [errors, setErrors]   = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name = 'Name is required'
    if (!form.email.trim())   e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, '_blank')
    setTimeout(() => { setSubmitted(true); setSubmitting(false); setForm({ name:'', email:'', message:'' }) }, 800)
  }

  return (
    <section id="contact" className="py-24 relative overflow-hidden" aria-labelledby="contact-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/4 w-80 h-64 rounded-full bg-[#1E3A5F] opacity-[0.04] blur-3xl" />
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-16">
          <span className="section-label">07. Contact</span>
          <h2 id="contact-heading" className="section-title mt-2">
            Let's <span className="gradient-text">connect.</span>
          </h2>
          <p className="body-text mt-4 max-w-xl mx-auto">
            Open to internships, collaborations and learning opportunities. Feel free to reach out.
          </p>
          <div className="section-divider" aria-hidden="true" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* Contact cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-[#1E3A5F] dark:text-[#7BBFFF] uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[#1E3A5F] dark:bg-[#7BBFFF]" aria-hidden="true" /> Find me here
            </h3>
            {contacts.map((c) => <ContactCard key={c.label} c={c} />)}
          </div>

          {/* Form card */}
          <div className="card-glow">
            <div className="card-glow-inner p-8 relative overflow-hidden">
              {/* Corner decoration */}
              <div
                className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#1E3A5F] opacity-[0.05] blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              <h3 className="text-xs font-mono text-[#1E3A5F] dark:text-[#7BBFFF] uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-[#1E3A5F] dark:bg-[#7BBFFF]" aria-hidden="true" /> Send a message
              </h3>

              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-5 py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1E3A5F0D] dark:bg-[#1E3A5F33] border border-[#1E3A5F22] dark:border-[#2A529855] flex items-center justify-center">
                    <CheckCircle size={30} className="text-[#1E3A5F] dark:text-[#7BBFFF]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[#0A0A0A] dark:text-white font-bold text-lg">Message sent!</p>
                    <p className="text-[#6B7280] text-sm mt-1">Your mail client should have opened. I'll get back to you soon.</p>
                  </div>
                  <button onClick={() => setSubmitted(false)} className="text-sm text-[#1E3A5F] dark:text-[#7BBFFF] hover:underline font-mono">
                    ← Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {[
                    { id:'contact-name',  key:'name',  type:'text',  label:'Name',  ph:'Your name',      auto:'name'  },
                    { id:'contact-email', key:'email', type:'email', label:'Email', ph:'your@email.com', auto:'email' },
                  ].map(({ id, key, type, label, ph, auto }) => (
                    <div key={key}>
                      <label htmlFor={id} className="block text-xs font-mono text-[#6B7280] mb-1.5 uppercase tracking-widest">
                        {label}
                      </label>
                      <input
                        id={id} type={type} autoComplete={auto} value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={ph}
                        className={`form-input ${errors[key] ? 'form-input-error' : ''}`}
                        aria-describedby={errors[key] ? `${key}-error` : undefined}
                        aria-invalid={!!errors[key]}
                      />
                      {errors[key] && (
                        <p id={`${key}-error`} className="flex items-center gap-1 mt-1 text-xs text-red-500" role="alert">
                          <AlertCircle size={11} aria-hidden="true" /> {errors[key]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-mono text-[#6B7280] mb-1.5 uppercase tracking-widest">
                      Message
                    </label>
                    <textarea
                      id="contact-message" rows={5} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="What's on your mind?"
                      className={`form-input resize-none ${errors.message ? 'form-input-error' : ''}`}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p id="message-error" className="flex items-center gap-1 mt-1 text-xs text-red-500" role="alert">
                        <AlertCircle size={11} aria-hidden="true" /> {errors.message}
                      </p>
                    )}
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" /> Sending...</>
                      : <><Send size={14} aria-hidden="true" /> Send Message</>
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
