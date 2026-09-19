import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Video,
  Layers,
  Calendar,
  Star,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { fetchProjectBySlug } from '../services/api';
import { Project } from '../types';

export function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!slug) return;

    setLoading(true);
    setError(null);
    fetchProjectBySlug(slug)
      .then((data) => {
        setProject(data);
        if (data.title) {
          document.title = `${data.title} | Case Study`;
        }
      })
      .catch((err) => {
        console.error('Project fetch error:', err);
        setError('Project not found or currently deactivated in the database.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <span className="text-xs font-mono tracking-wider uppercase">
          Querying MongoDB for project [{slug}]...
        </span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 max-w-md rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Project Not Found</h2>
          <p className="text-sm text-slate-400">{error || 'This project record does not exist in MongoDB.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = [
    ...(project.thumbnail ? [project.thumbnail] : []),
    ...(project.gallery || []),
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-600">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Projects</span>
          </Link>

          <div className="flex items-center gap-2">
            {project.status && (
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
                {project.status}
              </span>
            )}
            {project.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                <span>Featured</span>
              </span>
            )}
          </div>
        </div>

        {/* Header Title & Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {project.category && (
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
              {project.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl">
            {project.short_description}
          </p>
        </motion.div>

        {/* Action Links (GitHub, Live Demo, Video) */}
        {(project.live_demo_url || project.github_url || project.video_url) && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all"
              >
                <span>Launch Live Application</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium transition-all"
              >
                <Github className="w-4 h-4" />
                <span>Source Repository</span>
              </a>
            )}

            {project.video_url && (
              <a
                href={project.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium transition-all"
              >
                <Video className="w-4 h-4 text-purple-400" />
                <span>Watch Video Walkthrough</span>
              </a>
            )}
          </div>
        )}

        {/* Gallery / Image Showcase */}
        {galleryImages.length > 0 && (
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img
                src={galleryImages[activeImageIndex]}
                alt={`${project.title} screenshot`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnail gallery strip */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tech Stack Pills */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Architectural Technologies & Libraries</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-800/80 text-blue-300 border border-slate-700/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Description */}
        {project.full_description && (
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Detailed Overview
            </h2>
            <div className="p-7 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {project.full_description}
            </div>
          </div>
        )}

        {/* Architecture Triad: Problem, Solution, Challenges */}
        {(project.problem || project.solution || project.challenges) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.problem && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">The Problem</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.problem}
                </p>
              </div>
            )}

            {project.solution && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-400">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">The Solution</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            )}

            {project.challenges && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Technical Challenges</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.challenges}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Key Features Checklist */}
        {project.features && project.features.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Key Features & Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {project.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="pt-8 border-t border-slate-900 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm font-semibold text-slate-200 hover:text-white transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Main Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
