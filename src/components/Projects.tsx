import { useState, useMemo, useRef, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { FolderGit2, ExternalLink, Github, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const r = cardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top - r.height / 2) / r.height) * -5,
      y: ((e.clientX - r.left - r.width / 2) / r.width) * 5,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 0.15s ease-out' }}
      className="card-theme flex flex-col h-full overflow-hidden group"
    >
      {/* Thumbnail */}
      {project.thumbnail && (
        <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
          <img
            src={project.thumbnail}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          {project.featured && (
            <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-semibold"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-accent)', color: 'var(--accent)' }}>
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}
          {project.status && (
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full backdrop-blur-md text-[10px] font-mono"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {project.status}
            </div>
          )}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {project.category && (
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
            {project.category}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-3 mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
          {project.short_description}
        </p>

        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 5).map((t, i) => <span key={i} className="tag">{t}</span>)}
            {project.technologies.length > 5 && (
              <span className="tag">+{project.technologies.length - 5}</span>
            )}
          </div>
        )}
      </div>

      <div className="px-5 pb-5 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--border)' }}>
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:gap-2"
          style={{ color: 'var(--accent)' }}
        >
          <span>Case Study</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
        <div className="flex items-center gap-1">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
              style={{ color: 'var(--text-muted)' }} title="Source Code">
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.live_demo_url && (
            <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
              style={{ color: 'var(--text-muted)' }} title="Live Demo">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  if (!projects?.length) return null;

  const categories = useMemo(() => {
    const s = new Set<string>();
    projects.forEach(p => { if (p.category?.trim()) s.add(p.category.trim()); });
    return ['All', ...Array.from(s)];
  }, [projects]);

  const [active, setActive] = useState('All');
  const filtered = useMemo(() =>
    active === 'All' ? projects : projects.filter(p => p.category === active),
    [projects, active]
  );

  return (
    <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="section-pill mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </div>
          <h2 className="section-heading">Projects & Work</h2>
          <p className="section-sub">Real-world applications and systems I've built.</p>
        </div>

        {categories.length > 2 && (
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 mx-auto flex-nowrap px-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                    active === cat ? 'bg-[var(--accent)] text-white shadow-lg' : ''
                  }`}
                  style={active !== cat ? { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id || project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
