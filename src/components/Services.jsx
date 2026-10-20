import { Smartphone, Home, Users, ShieldCheck, ArrowRight } from 'lucide-react'
import { services } from '../data/portfolio'
import { useInView } from '../hooks/useInView'
import { useTilt } from '../hooks/useTilt'

const iconMap = { Smartphone, Home, Users, ShieldCheck }

function ServiceCard({ service, idx }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(6)
  const Icon = iconMap[service.icon]

  return (
    <div
      ref={ref}
      role="listitem"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="card-hover p-6 flex flex-col gap-5 group animate-fade-in-up"
      style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
    >
      {/* Spotlight */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(350px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(30,58,95,0.07), transparent 60%)' }}
        aria-hidden="true"
      />

      {/* Top strip */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-30 group-hover:opacity-80 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to right, transparent, #1E3A5F, transparent)' }}
        aria-hidden="true"
      />

      {/* Icon + number */}
      <div className="flex items-start justify-between">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center
                     bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                     border border-[#1E3A5F1A] dark:border-[#2A529855]
                     group-hover:bg-[#1E3A5F18] dark:group-hover:bg-[#1E3A5F44]
                     group-hover:scale-110 transition-all duration-300"
        >
          {Icon && <Icon size={24} className="text-[#1E3A5F] dark:text-[#7BBFFF]" aria-hidden="true" />}
        </div>
        <span className="text-xs font-mono font-bold text-slate-200 dark:text-white/[0.07] select-none">
          0{idx + 1}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className="font-bold text-[#0A0A0A] dark:text-white text-base
                       group-hover:text-[#1E3A5F] dark:group-hover:text-[#7BBFFF] transition-colors duration-200">
          {service.title}
        </h3>
        <p className="text-sm text-[#4A5568] dark:text-[#9CA3AF] leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
        className="flex items-center gap-2 text-sm font-mono font-semibold w-fit
                   text-[#1E3A5F] dark:text-[#7BBFFF]
                   hover:gap-3 transition-all duration-200"
        aria-label={`Get in touch about ${service.title}`}
      >
        Get in touch
        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
      </button>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-50 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to right, transparent, #1E3A5F, transparent)' }}
        aria-hidden="true"
      />
    </div>
  )
}

export default function Services() {
  const [ref, inView] = useInView()

  return (
    <section id="services" className="py-24 relative overflow-hidden" aria-labelledby="services-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#1E3A5F] opacity-[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#1E3A5F] opacity-[0.03] blur-3xl" />
      </div>

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" role="list" aria-label="Services">
          {services.map((s, idx) => <ServiceCard key={s.title} service={s} idx={idx} />)}
        </div>
      </div>
    </section>
  )
}
