import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ContactInfo } from '../types';
import { submitContactMessage } from '../services/api';

const INFO = [
  { key: 'email', icon: Mail, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  { key: 'phone', icon: Phone, color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
  { key: 'location', icon: MapPin, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  { key: 'working_hours', icon: Clock, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
];

export function Contact({ contactInfo }: { contactInfo: ContactInfo | null }) {
  if (!contactInfo || !contactInfo.is_active) return null;

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error'); setErrMsg('Please fill in all required fields.'); return;
    }
    setStatus('loading');
    try {
      await submitContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err.response?.data?.error || 'Failed to send message.');
    }
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-muted)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '0.875rem',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="pill mb-3"><Mail className="w-3.5 h-3.5" /> Contact</div>
          <h2 className="heading">Let's Work Together</h2>
          {contactInfo.availability_note && (
            <p className="subtext">{contactInfo.availability_note}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-5 sm:p-6 space-y-4 lg:col-span-2"
          >
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text)' }}>Contact Info</h3>
            {INFO.map(({ key, icon: Icon, color, bg }) => {
              const val = (contactInfo as any)[key];
              if (!val) return null;
              return (
                <div key={key} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg, color }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
                      {key.replace('_', ' ')}
                    </p>
                    {key === 'email'
                      ? <a href={`mailto:${val}`} className="text-sm font-semibold hover:text-blue-500 transition-colors" style={{ color: 'var(--text)' }}>{val}</a>
                      : key === 'phone'
                      ? <a href={`tel:${val}`} className="text-sm font-semibold hover:text-purple-500 transition-colors" style={{ color: 'var(--text)' }}>{val}</a>
                      : <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{val}</p>
                    }
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card p-5 sm:p-6 lg:col-span-3"
          >
            <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>Send a Message</h3>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>I reply within 24 hours.</p>

            {status === 'success' ? (
              <div className="p-6 rounded-2xl text-center space-y-3 border"
                style={{ backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' }}>
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
                <h4 className="font-bold" style={{ color: 'var(--text)' }}>Message Sent!</h4>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>I'll get back to you soon.</p>
                <button type="button" onClick={() => setStatus('idle')} className="btn-outline text-sm px-4 py-2 w-auto">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl text-xs"
                    style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                    <AlertCircle className="w-4 h-4 shrink-0" /> {errMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Name *</label>
                    <input type="text" required value={form.name}
                      onChange={e => { setForm({ ...form, name: e.target.value }); if (status === 'error') setStatus('idle'); }}
                      placeholder="Your name" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Email *</label>
                    <input type="email" required value={form.email}
                      onChange={e => { setForm({ ...form, email: e.target.value }); if (status === 'error') setStatus('idle'); }}
                      placeholder="you@email.com" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Subject</label>
                  <input type="text" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="Project discussion" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>Message *</label>
                  <textarea required rows={5} value={form.message}
                    onChange={e => { setForm({ ...form, message: e.target.value }); if (status === 'error') setStatus('idle'); }}
                    placeholder="Tell me about your project..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
                </div>

                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full sm:w-auto" style={{ opacity: status === 'loading' ? 0.65 : 1 }}>
                  {status === 'loading' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
