import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ContactInfo } from '../types';
import { submitContactMessage } from '../services/api';

interface ContactProps {
  contactInfo: ContactInfo | null;
}

export function Contact({ contactInfo }: ContactProps) {
  if (!contactInfo || !contactInfo.is_active) {
    return null;
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      await submitContactMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.error || 'Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/40 text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Initiate Contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Let's Build Something Resilient
          </h2>
          {contactInfo.availability_note && (
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
              {contactInfo.availability_note}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Direct Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Contact Information
              </h3>

              {contactInfo.email && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-center text-blue-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Email</span>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {contactInfo.phone && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-center justify-center text-purple-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Phone</span>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-sm font-semibold text-slate-200 hover:text-purple-400 transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {contactInfo.location && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Location</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {contactInfo.location}
                    </span>
                  </div>
                </div>
              )}

              {contactInfo.working_hours && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Working Hours</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {contactInfo.working_hours}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="p-7 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-mono">
                Messages are stored directly into MongoDB and delivered to the admin dashboard.
              </p>

              {status === 'success' ? (
                <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Message Delivered</h4>
                  <p className="text-xs text-slate-300">
                    Thank you! Your message has been saved. I'll get back to you promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-center gap-2.5 text-rose-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Sarah Connor"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sarah@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Project discussion or consultation"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your vision, technical challenges, or requirements..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting to MongoDB...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
