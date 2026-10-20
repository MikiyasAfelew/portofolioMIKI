import { Smartphone, Home, Users, ShieldCheck, ArrowRight } from 'lucide-react'
import { services } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

const iconMap = { Smartphone, Home, Users, ShieldCheck }

const colorMap = {
  '#00E5FF': { bg: 'bg-[#00E5FF11]', border: 'border-[#00E5FF33]', text: 'text-[#00E5FF]', hover: 'hover:border-[#00E5FF66]' },
  '#8B5CF6': { bg: 'bg-[#8B5CF611]', border: 'border-[#8B5CF633]', text: 'text-[#8B5CF6]', hover: 'hover:border-[#8B5CF666]' },
  '#FF4D8D': { bg: 'bg-[#FF4D8D11]', border: 'border-[#FF4D8D33]', text: 'text-[#FF4D8D]', hover: 'hover:border-[#FF4D8D66]' },
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
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, #8B5CF606 0%, transparent 70%)',
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
          <span className="section-label">05. Services</span>
          <h2 id="services-heading" className="section-title mt-2">
            What I can <span className="gradient-text">build for you.</span>
          </h2>
          <p className="text-[#8A94A8] mt-4 max-w-2xl mx-auto">
            A focused set of services based on real projects and skills I've been developing.
          </p>
          <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] rounded-full" />
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Services">
          {services.map((service) => {
            const Icon = iconMap[service.icon]
            const colors = colorMap[service.color] || colorMap['#00E5FF']

            return (
              <div
                key={service.title}
                role="listitem"
                className={`glass-card border ${colors.border} ${colors.hover} p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-2 group`}
                style={{
                  '--hover-shadow': `0 16px 40px ${service.color}22`,
                }}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  {Icon && <Icon size={22} className={colors.text} aria-hidden="true" />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-[#8A94A8] leading-relaxed">{service.description}</p>
                </div>

                {/* CTA */}
                <button
                  onClick={scrollToContact}
                  className={`flex items-center gap-1.5 text-sm ${colors.text} font-mono hover:gap-3 transition-all duration-200`}
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
