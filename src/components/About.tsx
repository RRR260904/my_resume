import { motion } from 'motion/react';
import { CheckCircle2, Quote, Sparkles, Heart } from 'lucide-react';
import { About as AboutType } from '../types';

interface AboutProps {
  about: AboutType | null;
}

export function About({ about }: AboutProps) {
  if (!about || !about.is_active) {
    return null;
  }

  const hasHighlights = about.highlights && about.highlights.length > 0;
  const hasHobbies = about.hobbies && about.hobbies.length > 0;

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Background & Profile</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About Me
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Story & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`space-y-6 ${about.avatar_secondary ? 'lg:col-span-7' : 'lg:col-span-12'}`}
          >
            {about.title && (
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {about.title}
              </h3>
            )}

            {about.description && (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {about.description}
              </p>
            )}

            {/* Quote */}
            {about.quote && (
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 relative overflow-hidden">
                <Quote className="absolute -bottom-3 -right-3 w-16 h-16 text-blue-100 pointer-events-none" />
                <p className="italic text-slate-600 text-sm sm:text-base leading-relaxed relative z-10">
                  "{about.quote}"
                </p>
              </div>
            )}

            {/* Highlights */}
            {hasHighlights && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold">
                  Core Principles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {about.highlights!.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hobbies / Interests */}
            {hasHobbies && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Passions & Interests</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {about.hobbies!.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Secondary Avatar / Workspace Image */}
          {about.avatar_secondary && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xl shadow-slate-100 group">
                <img
                  src={about.avatar_secondary}
                  alt="Workspace"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200">
                  <span className="text-xs font-mono text-blue-600"># Continuous Learning & Deep Work</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
