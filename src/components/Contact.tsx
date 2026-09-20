import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ContactInfo } from '../types';
import { submitContactMessage } from '../services/api';

const infoItems = [
  { key: 'email', icon: Mail, color: 'var(--accent)', bg: 'var(--accent-light)' },
  { key: 'phone', icon: Phone, color: '#a855f7', bg: '#f5f3ff' },
  { key: 'location', icon: MapPin, color: '#6366f1', bg: '#eef2ff' },
  { key: 'working_hours', icon: Clock, color: '#10b981', bg: '#f0fdf4' },
];

export function Contact({ contactInfo }: { contactInfo: ContactInfo | null }) {
  if (!contactInfo || !contactInfo.is_active) return null;

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setErrMsg('Please fill in all required fields.');
      return;
    }
    setStatus('submitting');
    try {
      await submitContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err.response?.data?.error || 'Failed to send. Please try again.');
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm transition-all outline-none focus:ring-2";
  const inputStyle = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  } as React.CSSProperties;

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="section-pill mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </div>
          <h2 className="section-heading">Let's Work Together</h2>
          {contactInfo.availability_note && (
            <p className="section-sub">{contactInfo.availability_note}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="card-theme p-5 sm:p-6 space-y-5">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Contact Information</h3>
              {infoItems.map(({ key, icon: Icon, color, bg }) => {
                const val = (contactInfo as any)[key];
                if (!val) return null;
                return (
                  <div key={key} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: bg, color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{key.replace('_', ' ')}</p>
                      {key === 'email' ? (
                        <a href={`mailto:${val}`} className="text-sm font-semibold hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>{val}</a>
                      ) : key === 'phone' ? (
                        <a href={`tel:${val}`} className="text-sm font-semibold hover:text-purple-500 transition-colors" style={{ color: 'var(--text)' }}>{val}</a>
                      ) : (
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{val}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="card-theme p-5 sm:p-6 sm:p-8">
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Send a Message</h3>
              <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>I'll reply as soon as possible.</p>

              {status === 'success' ? (
                <div className="p-6 rounded-xl text-center space-y-3 border"
                  style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
                  <h4 className="font-bold text-slate-900">Message Sent!</h4>
                  <p className="text-xs text-slate-600">I'll get back to you soon.</p>
                  <button type="button" onClick={() => setStatus('idle')}
                    className="btn-ghost text-sm px-4 py-2">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <div className="flex items-center gap-2.5 p-3.5 rounded-xl text-xs border"
                      style={{ backgroundColor: '#fff1f2', borderColor: '#fecdd3', color: '#e11d48' }}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Name *</label>
                      <input type="text" required value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className={inputClass}
                        style={{ ...inputStyle, '--tw-ring-color': 'var(--accent-light)' } as any} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Email *</label>
                      <input type="email" required value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className={inputClass}
                        style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Subject</label>
                    <input type="text" value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      placeholder="Project discussion"
                      className={inputClass} style={inputStyle} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Message *</label>
                    <textarea required rows={5} value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell me about your project..."
                      className={`${inputClass} resize-y`} style={inputStyle} />
                  </div>

                  <button type="submit" disabled={status === 'submitting'}
                    className="btn-accent w-full sm:w-auto disabled:opacity-60">
                    {status === 'submitting' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending...</span></>
                    ) : (
                      <><Send className="w-4 h-4" /><span>Send Message</span></>
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
