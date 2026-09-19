import { useState, useMemo, useRef, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { FolderGit2, ExternalLink, Github, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -7;
    const rY = ((x - centerX) / centerX) * 7;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-blue-500/40 backdrop-blur-md overflow-hidden flex flex-col justify-between group shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-colors"
    >
      <div>
        {/* Project Thumbnail with Hover Zoom */}
        {project.thumbnail && (
          <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
            <img
              src={project.thumbnail}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            {project.featured && (
              <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[11px] font-semibold backdrop-blur-md shadow-sm">
                <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
                <span>Featured</span>
              </div>
            )}

            {project.status && (
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/50 text-slate-300 text-[10px] font-mono backdrop-blur-md">
                {project.status}
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {project.category && (
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-medium block mb-1">
              {project.category}
            </span>
          )}

          <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
            {project.title}
          </h3>

          <p className="text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed">
            {project.short_description}
          </p>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-800/70 text-slate-300 border border-slate-700/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-800/60 mt-auto">
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Case Study</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="flex items-center gap-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="View Source Code"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.live_demo_url && (
            <a
              href={project.live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Open Live Application"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function Projects({ projects }: ProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  // Derive categories from existing projects
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/40 text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Projects & Systems Architecture
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Real-world applications, distributed systems, and developer tooling.
          </p>
        </div>

        {/* Category Pills */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id || project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
