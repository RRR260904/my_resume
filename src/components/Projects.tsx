import { useState, useMemo, useRef, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { FolderGit2, ExternalLink, Github, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || window.innerWidth < 768) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top - r.height / 2) / r.height) * -4,
      y: ((e.clientX - r.left - r.width / 2) / r.width) * 4,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 0.18s ease' }}
      className="card flex flex-col h-full overflow-hidden group"
    >
      {/* Thumbnail */}
      {project.thumbnail && (
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: 'var(--bg-muted)' }}>
          <img src={project.thumbnail} alt={project.title} referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          {project.featured && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-accent)', color: 'var(--accent)' }}>
              <Star className="w-2.5 h-2.5 fill-current" /> Featured
            </div>
          )}
          {project.status && (
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {project.status}
            </div>
          )}
        </div>
      )}

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {project.category && (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
            {project.category}
          </span>
        )}
        <h3 className="text-base font-bold mb-2 group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text)' }}>
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>
          {project.short_description}
        </p>

        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.technologies.slice(0, 4).map((t, i) => <span key={i} className="chip">{t}</span>)}
            {project.technologies.length > 4 && <span className="chip">+{project.technologies.length - 4}</span>}
          </div>
        )}
      </div>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold transition-colors hover:gap-2"
          style={{ color: 'var(--accent)' }}>
          <span>Case Study</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform" />
        </Link>
        <div className="flex items-center gap-1">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-[var(--bg-muted)]"
              style={{ color: 'var(--text-muted)' }}>
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.live_demo_url && (
            <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-[var(--accent-light)] hover:text-blue-500"
              style={{ color: 'var(--text-muted)' }}>
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
  const filtered = useMemo(
    () => active === 'All' ? projects : projects.filter(p => p.category === active),
    [projects, active]
  );

  return (
    <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="pill mb-3"><FolderGit2 className="w-3.5 h-3.5" /> Portfolio</div>
          <h2 className="heading">Projects & Work</h2>
          <p className="subtext">Real-world applications and systems I've built.</p>
        </div>

        {categories.length > 2 && (
          <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
            <div className="flex gap-2 mx-auto flex-nowrap px-1">
              {categories.map(cat => (
                <button key={cat} type="button" onClick={() => setActive(cat)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                  style={
                    active === cat
                      ? { backgroundColor: 'var(--accent)', color: '#fff', boxShadow: '0 4px 14px rgba(59,130,246,0.35)' }
                      : { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }
                  }>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((project, i) => (
            <motion.div key={project.id || project.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex">
              <div className="w-full"><ProjectCard project={project} /></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
