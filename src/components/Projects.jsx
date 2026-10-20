import { useState } from 'react'
import { GitFork, ExternalLink, Star } from 'lucide-react'
const Github = GitFork
import { projects } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

const filters = ['All', 'Mobile', 'Security', 'Web']

const statusColors = {
  'In Progress': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Completed: 'text-green-400 bg-green-400/10 border-green-400/20',
}

const categoryColors = {
  Mobile: 'bg-[#00E5FF11] text-[#00E5FF] border-[#00E5FF33]',
  Security: 'bg-[#FF4D8D11] text-[#FF4D8D] border-[#FF4D8D33]',
  Web: 'bg-[#8B5CF611] text-[#8B5CF6] border-[#8B5CF633]',
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [ref, inView] = useInView()

  const filtered =
    activeFilter === 'All'
      ? projects
      : projects.filter(
          (p) =>
            p.category === activeFilter ||
            p.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase())
        )

  return (
    <section id="projects" className="py-24 relative" aria-labelledby="projects-heading">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, #8B5CF606 0%, transparent 70%)',
        }}
      />

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="section-label">06. Projects</span>
          <h2 id="projects-heading" className="section-title mt-2">
            Projects that show <span className="gradient-text">my growth.</span>
          </h2>
          <p className="text-[#8A94A8] mt-4 max-w-2xl mx-auto">
            A selection of personal and academic projects. Focused on mobile, security, and
            practical software.
          </p>
          <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] rounded-full" />
        </div>

        {/* Filter bar */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-10"
          role="group"
          aria-label="Filter projects by category"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-mono transition-all duration-200 border ${
                activeFilter === f
                  ? 'bg-[#00E5FF] text-navy-950 border-[#00E5FF] font-semibold'
                  : 'text-[#8A94A8] border-white/10 hover:border-[#00E5FF44] hover:text-[#00E5FF]'
              }`}
              aria-pressed={activeFilter === f}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Projects">
          {filtered.map((project) => (
            <article
              key={project.title}
              role="listitem"
              className="glass-card-hover flex flex-col overflow-hidden group"
            >
              {/* Card top bar */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(to right, ${project.color}, transparent)`,
                }}
                aria-hidden="true"
              />

              <div className="p-6 flex flex-col flex-1 gap-4">
                {/* Meta row */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                      categoryColors[project.category] || categoryColors['Web']
                    }`}
                  >
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.featured && (
                      <span className="flex items-center gap-1 text-xs font-mono text-[#8B5CF6] bg-[#8B5CF611] border border-[#8B5CF633] px-2 py-0.5 rounded-full">
                        <Star size={10} aria-hidden="true" /> Featured
                      </span>
                    )}
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                        statusColors[project.status]
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Title & description */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#8A94A8] leading-relaxed mt-2">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="skill-badge">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-auto pt-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#8A94A8] hover:text-white transition-colors duration-200"
                    aria-label={`View ${project.title} on GitHub (opens in new tab)`}
                  >
                    <Github size={15} aria-hidden="true" />
                    GitHub
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#00E5FF] hover:underline transition-colors duration-200 ml-auto"
                    aria-label={`View details for ${project.title} (opens in new tab)`}
                  >
                    View Details <ExternalLink size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* See all button */}
        <div className="text-center mt-12">
          <a
            href="https://github.com/MikiyasAfelew"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
            aria-label="See all projects on GitHub (opens in new tab)"
          >
            <Github size={16} aria-hidden="true" />
            See all projects on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
