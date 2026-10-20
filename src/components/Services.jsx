import { Smartphone, Home, Users, ShieldCheck, ArrowRight } from 'lucide-react'
import { services } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

const iconMap = { Smartphone, Home, Users, ShieldCheck }

const colorMap = {
  '#00E5FF': {
    bg:     'bg-[#0099CC11] dark:bg-[#00E5FF11]',
    border: 'border-[#0099CC33] dark:border-[#00E5FF33]',
    hover:  'hover:border-[#0099CC66] dark:hover:border-[#00E5FF66]',
    text:   'text-[#0077AA] dark:text-[#00E5FF]',
    shadow: 'rgba(0,153,204,0.12)',
  },
  '#8B5CF6': {
    bg:     'bg-[#7C3AED11] dark:bg-[#8B5CF611]',
    border: 'border-[#7C3AED33] dark:border-[#8B5CF633]',
    hover:  'hover:border-[#7C3AED66] dark:hover:border-[#8B5CF666]',
    text:   'text-[#6D28D9] dark:text-[#8B5CF6]',
    shadow: 'rgba(124,58,237,0.12)',
  },
  '#FF4D8D': {
    bg:     'bg-[#e0396e11] dark:bg-[#FF4D8D11]',
    border: 'border-[#e0396e33] dark:border-[#FF4D8D33]',
    hover:  'hover:border-[#e0396e66] dark:hover:border-[#FF4D8D66]',
    text:   'text-[#c0185a] dark:text-[#FF4D8D]',
    shadow: 'rgba(224,57,110,0.12)',
  },
}

export default function Services() {
  const [ref, inView] = useInView()
  const scrollToContact = () => {
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="services" className="py-24 relative" aria-labelledby="services-heading">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, #8B5CF605 0%, transparent 70%)' }}
      />

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-16">
          <span className="section-label">05. Services</span>
          <h2 id="services-heading" className="section-title mt-2">
            What I can <span className="gradient-text">build for you.</span>
          </h2>
          <p className="body-text mt-4 max-w-2xl mx-auto">
            A focused set of services based on real projects and skills I've been developing.
          </p>
          <div className="section-divider" aria-hidden="true" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Services">
          {services.map((service) => {
            const Icon = iconMap[service.icon]
            const c = colorMap[service.color] || colorMap['#00E5FF']

            return (
              <div
                key={service.title}
                role="listitem"
                className={`glass-card border ${c.border} ${c.hover} p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-2 group`}
              >
                <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {Icon && <Icon size={22} className={c.text} aria-hidden="true" />}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-[#8A94A8] leading-relaxed">{service.description}</p>
                </div>

                <button
                  onClick={scrollToContact}
                  className={`flex items-center gap-1.5 text-sm ${c.text} font-mono hover:gap-3 transition-all duration-200`}
                  aria-label={`Get in touch about ${service.title}`}
                >
                  Get in touch <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
