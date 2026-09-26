import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, KeyRound, User, Loader2, AlertCircle, ArrowLeft, Terminal } from 'lucide-react';
import { adminLogin } from '../services/api';

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin_password_123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await adminLogin(username.trim(), password.trim());
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login failure:', err);
      setError(err.response?.data?.error || 'Invalid credentials. Check server logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDefaults = (user = 'Roshan') => {
    setUsername(user);
    setPassword('admin_password_123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col justify-center items-center px-4 sm:px-6 relative selection:bg-blue-600">
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute w-[450px] h-[350px] bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-transparent blur-[120px] rounded-full pointer-events-none"
      />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Back to Live Portfolio</span>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
            <Terminal className="w-3 h-3 text-slate-500" />
            <span>JWT Security</span>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl shadow-2xl shadow-black/60">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] mx-auto mb-3 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-blue-400">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage MongoDB collections, projects, and settings
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-center gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Token...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick preset credentials helper */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <span className="text-[11px] font-mono text-slate-500 block mb-2">
              Development Default Credentials
            </span>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleFillDefaults('Roshan')}
                className="text-xs text-blue-400 hover:text-blue-300 font-mono underline underline-offset-4 cursor-pointer"
              >
                Autofill Roshan
              </button>
              <span className="text-slate-600 text-xs">|</span>
              <button
                type="button"
                onClick={() => handleFillDefaults('admin')}
                className="text-xs text-slate-400 hover:text-slate-300 font-mono underline underline-offset-4 cursor-pointer"
              >
                Autofill admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
