import { useState } from 'react'
import { GitFork, ExternalLink, Star, Folder } from 'lucide-react'
const Github = GitFork
import { projects } from '../data/portfolio'
import { useInView } from '../hooks/useInView'
import { useTilt } from '../hooks/useTilt'

const filters = ['All', 'Mobile', 'Security', 'Web']

function ProjectCard({ project, idx }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(5)
  const isInProgress = project.status === 'In Progress'

  return (
    <article
      ref={ref}
      role="listitem"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="card-hover flex flex-col overflow-hidden group animate-fade-in-up"
      style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
    >
      {/* Spotlight */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(350px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(30,58,95,0.08), transparent 60%)' }}
        aria-hidden="true"
      />

      {/* Top bar */}
      <div
        className="h-1.5 w-full flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, #1E3A5F, #2A5298 60%, transparent)' }}
        aria-hidden="true"
      />

      <div className="p-6 flex flex-col flex-1 gap-4">

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border
                           bg-[#1E3A5F08] dark:bg-[#1E3A5F22]
                           border-[#1E3A5F1A] dark:border-[#2A529844]
                           text-[#1E3A5F] dark:text-[#9CB8D9]">
            <Folder size={10} aria-hidden="true" />
            {project.category}
          </span>
          <div className="flex items-center gap-2">
            {project.featured && (
              <span className="flex items-center gap-1 text-xs font-mono
                               text-[#1E3A5F] dark:text-[#7BBFFF]
                               bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                               border border-[#1E3A5F22] dark:border-[#2A529855]
                               px-2 py-0.5 rounded-full">
                <Star size={9} fill="currentColor" aria-hidden="true" /> Featured
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border ${
              isInProgress
                ? 'text-[#1E3A5F] dark:text-[#7BBFFF] bg-[#1E3A5F0D] dark:bg-[#1E3A5F2A] border-[#1E3A5F22] dark:border-[#2A529855]'
                : 'text-[#0A0A0A] dark:text-white bg-[#0A0A0A0D] dark:bg-white/[0.07] border-[#0A0A0A1A] dark:border-white/10'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isInProgress ? 'bg-[#1E3A5F] dark:bg-[#7BBFFF] animate-pulse' : 'bg-[#0A0A0A] dark:bg-white'}`} aria-hidden="true" />
              {project.status}
            </span>
          </div>
        </div>

        {/* Title block */}
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5
                       bg-[#1E3A5F0D] dark:bg-[#1E3A5F33]
                       border border-[#1E3A5F1A] dark:border-[#2A529844]"
            aria-hidden="true"
          >
            <Github size={14} className="text-[#1E3A5F] dark:text-[#7BBFFF]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0A0A0A] dark:text-white leading-tight
                           group-hover:text-[#1E3A5F] dark:group-hover:text-[#7BBFFF] transition-colors duration-200">
              {project.title}
            </h3>
            <p className="text-xs text-[#6B7280] font-mono mt-0.5">{project.tags[0]}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#4A5568] dark:text-[#9CA3AF] leading-relaxed">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg text-xs font-mono border cursor-default
                         bg-[#1E3A5F08] dark:bg-[#1E3A5F1A]
                         border-[#1E3A5F15] dark:border-[#2A529833]
                         text-[#1E3A5F] dark:text-[#9CB8D9]
                         hover:-translate-y-0.5 transition-transform duration-150"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-auto pt-3 border-t border-slate-100 dark:border-white/[0.05]">
          <a
            href={project.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono
                       text-[#6B7280] hover:text-[#1E3A5F] dark:hover:text-white
                       transition-colors duration-200"
            aria-label={`View ${project.title} on GitHub`}
          >
            <Github size={13} aria-hidden="true" /> View source
          </a>
          <a
            href={project.github} target="_blank" rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 text-xs font-mono font-semibold
                       text-[#1E3A5F] dark:text-[#7BBFFF]
                       hover:gap-2.5 transition-all duration-200"
            aria-label={`Open ${project.title}`}
          >
            Open project <ExternalLink size={11} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [ref, inView] = useInView()

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p =>
        p.category === activeFilter ||
        p.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase())
      )

  return (
    <section id="projects" className="py-24 relative overflow-hidden" aria-labelledby="projects-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 right-0 w-80 h-64 rounded-full bg-[#1E3A5F] opacity-[0.04] blur-3xl" />
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-12">
          <span className="section-label">06. Projects</span>
          <h2 id="projects-heading" className="section-title mt-2">
            Projects that show <span className="gradient-text">my growth.</span>
          </h2>
          <p className="body-text mt-4 max-w-2xl mx-auto">
            Personal and academic projects focused on mobile, security, and practical software.
          </p>
          <div className="section-divider" aria-hidden="true" />
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-mono transition-all duration-200 border ${
                activeFilter === f
                  ? 'bg-[#1E3A5F] dark:bg-[#1E3A5F] text-white border-[#1E3A5F] font-semibold shadow-[0_0_16px_rgba(30,58,95,0.35)]'
                  : 'text-[#6B7280] dark:text-[#9CA3AF] border-slate-200 dark:border-white/[0.08] hover:border-[#1E3A5F44] dark:hover:border-white/20 hover:text-[#1E3A5F] dark:hover:text-white hover:bg-[#1E3A5F06]'
              }`}
              aria-pressed={activeFilter === f}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" role="list" aria-label="Projects">
          {filtered.map((project, idx) => (
            <ProjectCard key={project.title} project={project} idx={idx} />
          ))}
        </div>

        {/* See all */}
        <div className="text-center mt-12">
          <a
            href="https://github.com/MikiyasAfelew"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            <Github size={14} aria-hidden="true" />
            See all projects on GitHub
            <ExternalLink size={12} className="opacity-60" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
