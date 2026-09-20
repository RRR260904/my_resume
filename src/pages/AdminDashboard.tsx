import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Database,
  RefreshCw,
  FolderGit2,
  Terminal,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Share2,
  Mail,
  Sliders,
  Sparkles,
  Info,
  User,
  ArrowUp,
  ArrowDown,
  Inbox,
  AlertCircle,
  Loader2,
  Cloud,
  HardDrive,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Link2,
} from 'lucide-react';
import {
  fetchAdminStats,
  fetchAdminCollection,
  createAdminItem,
  updateAdminItem,
  deleteAdminItem,
  reorderAdminItems,
  seedDatabase,
  wipeDatabase,
  feedAtlasDatabaseApi,
  adminLogout,
  getAdminUser,
  verifyAdminToken,
} from '../services/api';
import { AdminStats } from '../types';

type TabKey =
  | 'overview'
  | 'profiles'
  | 'about'
  | 'skills'
  | 'experiences'
  | 'education'
  | 'projects'
  | 'certifications'
  | 'achievements'
  | 'social_links'
  | 'contact_info'
  | 'contact_messages'
  | 'site_settings';

interface TabConfig {
  id: TabKey;
  label: string;
  icon: any;
  singular: string;
}

const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview & Stats', icon: Database, singular: 'Stat' },
  { id: 'profiles', label: 'Profile', icon: User, singular: 'Profile' },
  { id: 'about', label: 'About', icon: Info, singular: 'About' },
  { id: 'skills', label: 'Skills', icon: Terminal, singular: 'Skill' },
  { id: 'experiences', label: 'Experience', icon: Briefcase, singular: 'Experience' },
  { id: 'education', label: 'Education', icon: GraduationCap, singular: 'Education' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, singular: 'Project' },
  { id: 'certifications', label: 'Certifications', icon: Award, singular: 'Certification' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, singular: 'Achievement' },
  { id: 'social_links', label: 'Social Links', icon: Share2, singular: 'Social Link' },
  { id: 'contact_info', label: 'Contact Info', icon: Mail, singular: 'Contact Info' },
  { id: 'contact_messages', label: 'Messages', icon: Inbox, singular: 'Message' },
  { id: 'site_settings', label: 'Site Settings', icon: Sliders, singular: 'Settings' },
// Helper to compress and convert image file to optimized Base64 data URL for MongoDB storage
function compressAndConvertImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to parse image file'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

// Reusable Image Upload and Preview field for MongoDB CMS
function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = 'https://... or click Upload to choose from device',
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (.jpg, .png, .webp)');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const dataUrl = await compressAndConvertImage(file);
      onChange(dataUrl);
    } catch (err: any) {
      setError('Error uploading image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono uppercase text-blue-400 font-semibold">
          {label}
        </label>
        {value && (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            Image Loaded
          </span>
        )}
      </div>

      {/* Live Preview if present */}
      {value && (
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 shrink-0 flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs text-slate-300 font-medium block">
              Active Preview
            </span>
            <span className="text-[10px] text-slate-500 font-mono truncate block">
              {value.startsWith('data:image') ? 'Base64 image stored in MongoDB' : value}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/50 text-[11px] font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Inputs (File Upload button + Direct URL input) */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value && value.startsWith('data:image') ? '[Uploaded Image from Device]' : (value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
          />
          <Link2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <label className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-blue-200 text-xs font-medium cursor-pointer transition-colors shrink-0">
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          <span>{uploading ? 'Processing Image...' : '📁 Upload Photo from Device'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-[11px] text-rose-400 font-mono">{error}</p>}
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [items, setItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [atlasSyncing, setAtlasSyncing] = useState(false);
  const [atlasStatusNotice, setAtlasStatusNotice] = useState<string | null>(null);

  // Edit / Add Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Check auth & verify JWT validity
  useEffect(() => {
    const user = getAdminUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }
    setAdminUser(user);

    verifyAdminToken().then((isValid) => {
      if (!isValid) {
        navigate('/admin/login');
      } else {
        loadStats();
      }
    });
  }, [navigate]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load stats', err);
      if (err.response?.status === 401) {
        adminLogout();
        navigate('/admin/login');
      }
    } finally {
      setStatsLoading(false);
    }
  };

  const loadCollectionItems = async (col: TabKey) => {
    if (col === 'overview') return;
    try {
      setItemsLoading(true);
      setActionError(null);
      const data = await fetchAdminCollection(col);
      setItems(data);
    } catch (err: any) {
      console.error(`Failed to load ${col}`, err);
      setActionError(`Could not load ${col} from MongoDB.`);
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      loadStats();
    } else {
      loadCollectionItems(activeTab);
    }
  }, [activeTab]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const handleSeedData = async () => {
    if (!window.confirm('Seed database with realistic demo developer data? This will populate all collections.')) {
      return;
    }
    try {
      setStatsLoading(true);
      await seedDatabase();
      setActionSuccess('MongoDB successfully populated with developer portfolio data!');
      await loadStats();
      if (activeTab !== 'overview') {
        await loadCollectionItems(activeTab);
      }
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Failed to seed database.');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleWipeData = async () => {
    if (!window.confirm('DANGER: Wipe all portfolio data from MongoDB? This will remove all items to test the zero-data empty state.')) {
      return;
    }
    try {
      setStatsLoading(true);
      await wipeDatabase();
      setActionSuccess('Database wiped successfully! Portfolio will now render 0 sections.');
      await loadStats();
      if (activeTab !== 'overview') {
        await loadCollectionItems(activeTab);
      }
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Failed to wipe database.');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleFeedAtlas = async () => {
    try {
      setAtlasSyncing(true);
      setActionError(null);
      setActionSuccess(null);
      setAtlasStatusNotice(null);
      const res = await feedAtlasDatabaseApi();
      setActionSuccess(res.message || 'Successfully fed all portfolio data into MongoDB Atlas!');
      await loadStats();
      if (activeTab !== 'overview') {
        await loadCollectionItems(activeTab);
      }
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.is_ip_whitelist_issue) {
        setActionError('MongoDB Atlas Connection Blocked: IP Address is not whitelisted in Atlas.');
        setAtlasStatusNotice(
          'Atlas rejected the connection with TLS Alert 80 because IP access is restricted. To resolve: Log in to MongoDB Atlas -> Network Access -> Add IP Address -> Select "Allow Access from Anywhere" (0.0.0.0/0) -> Confirm. Once added, click this button again!'
        );
      } else {
        setActionError(data?.error || err.message || 'Failed to feed MongoDB Atlas.');
      }
    } finally {
      setAtlasSyncing(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (item: any) => {
    try {
      const updated = await updateAdminItem(activeTab, item.id || item._id, {
        is_active: !item.is_active,
      });
      setItems((prev) =>
        prev.map((it) => ((it.id || it._id) === (item.id || item._id) ? updated : it))
      );
      loadStats();
    } catch (err: any) {
      setActionError('Failed to update status.');
    }
  };

  // Reorder items
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const reorderedPayload = newItems.map((item, idx) => ({
      id: item.id || item._id,
      display_order: idx + 1,
    }));

    setItems(newItems);

    try {
      await reorderAdminItems(activeTab, reorderedPayload);
    } catch (err) {
      console.error('Reorder error', err);
      loadCollectionItems(activeTab);
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document from MongoDB?')) return;
    try {
      await deleteAdminItem(activeTab, id);
      setItems((prev) => prev.filter((it) => (it.id || it._id) !== id));
      setActionSuccess('Document deleted.');
      loadStats();
    } catch (err: any) {
      setActionError('Failed to delete item.');
    }
  };

  // Open Modal for Add / Edit
  const handleOpenModal = (item?: any) => {
    setActionError(null);
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      // Default structure based on tab
      const defaults: Record<string, any> = {
        is_active: true,
        display_order: items.length + 1,
      };

      if (activeTab === 'projects') {
        defaults.title = '';
        defaults.slug = '';
        defaults.short_description = '';
        defaults.full_description = '';
        defaults.thumbnail = '';
        defaults.technologies = '';
        defaults.features = '';
        defaults.category = 'Full-Stack Web';
        defaults.status = 'Completed';
        defaults.featured = false;
      } else if (activeTab === 'skills') {
        defaults.name = '';
        defaults.category = 'Frontend';
        defaults.proficiency = 90;
        defaults.icon = 'Code';
        defaults.featured = false;
      } else if (activeTab === 'experiences') {
        defaults.company = '';
        defaults.role = '';
        defaults.period = '';
        defaults.description = '';
        defaults.responsibilities = '';
        defaults.technologies = '';
        defaults.is_current = false;
      } else if (activeTab === 'social_links') {
        defaults.platform = 'GitHub';
        defaults.url = '';
        defaults.username = '';
      }

      setFormData(defaults);
    }
    setModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = async (e: FormEvent) => {
    e.preventDefault();
    setActionError(null);

    // Prepare payload
    const payload = { ...formData };
    delete payload._id;
    delete payload.id;

    // Convert comma strings to arrays if applicable
    const arrayFields = ['technologies', 'features', 'highlights', 'hobbies', 'skills', 'activities', 'gallery'];
    for (const field of arrayFields) {
      if (typeof payload[field] === 'string') {
        payload[field] = payload[field]
          .split('\n')
          .map((s: string) => s.trim())
          .filter(Boolean);
        if (payload[field].length === 0) {
          payload[field] = payload[field].flatMap((s: string) => s.split(',')).map((s: string) => s.trim()).filter(Boolean);
        }
      }
    }

    // Auto slug for projects if empty
    if (activeTab === 'projects' && !payload.slug && payload.title) {
      payload.slug = payload.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    try {
      if (editingItem) {
        const id = editingItem.id || editingItem._id;
        const updated = await updateAdminItem(activeTab, id, payload);
        setItems((prev) => prev.map((it) => ((it.id || it._id) === id ? updated : it)));
        setActionSuccess('Item updated in MongoDB.');
      } else {
        const created = await createAdminItem(activeTab, payload);
        setItems((prev) => [...prev, created]);
        setActionSuccess('Item inserted into MongoDB.');
      }
      setModalOpen(false);
      loadStats();
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Failed to save item to MongoDB.');
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-blue-600">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  Portfolio Control Center
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-800/50">
                  MongoDB DRF API
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Logged in as: {adminUser?.username || 'admin'} ({adminUser?.role || 'superadmin'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/50 text-xs font-medium text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 mb-4">
            <div className="flex items-center gap-2 mb-1 text-white font-semibold">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>{stats?.database_type || 'MongoDB Engine'}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Single Source of Truth Active
            </div>
          </div>

          <div className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tab.id !== 'overview' && stats?.counts ? stats.counts[tab.id] : null;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {typeof count === 'number' && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Actions (Seed / Wipe) */}
          <div className="pt-6 border-t border-slate-900 space-y-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block px-1">
              Data Controls
            </span>
            <button
              type="button"
              onClick={handleFeedAtlas}
              disabled={atlasSyncing}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/50 text-xs font-semibold text-emerald-400 transition-colors cursor-pointer"
            >
              {atlasSyncing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Feed to MongoDB Atlas</span>
            </button>
            <button
              type="button"
              onClick={handleSeedData}
              disabled={statsLoading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-blue-400 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Seed Local Data</span>
            </button>
            <button
              type="button"
              onClick={handleWipeData}
              disabled={statsLoading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 text-xs font-semibold text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Wipe / Empty DB</span>
            </button>
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 sm:p-7 backdrop-blur-md overflow-hidden">
          {/* Notifications */}
          {actionSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
              <span>{actionSuccess}</span>
              <button onClick={() => setActionSuccess(null)} className="p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {actionError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
              <span>{actionError}</span>
              <button onClick={() => setActionError(null)} className="p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    MongoDB System Overview
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time collection statistics & database state
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadStats}
                  disabled={statsLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Stats</span>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    Projects
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {stats?.counts?.projects ?? 0}
                  </div>
                  <span className="text-[10px] text-blue-400">Database Items</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    Skills
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {stats?.counts?.skills ?? 0}
                  </div>
                  <span className="text-[10px] text-purple-400">Technical Assets</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    Experience
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {stats?.counts?.experiences ?? 0}
                  </div>
                  <span className="text-[10px] text-emerald-400">Positions</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    Messages
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {stats?.counts?.contact_messages ?? 0}
                  </div>
                  <span className="text-[10px] text-amber-400">
                    {stats?.unread_messages ?? 0} Unread
                  </span>
                </div>
              </div>

              {/* MongoDB Atlas Cloud Sync Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-900/80 border border-emerald-800/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">MongoDB Atlas Cloud Database</h3>
                      <span className="text-[11px] font-mono text-emerald-400 block">
                        cluster0.bqaklsx.mongodb.net / portfolio_db
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFeedAtlas}
                    disabled={atlasSyncing}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 cursor-pointer disabled:opacity-50"
                  >
                    {atlasSyncing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>{atlasSyncing ? 'Connecting & Seeding...' : 'Feed / Sync Data to Atlas'}</span>
                  </button>
                </div>

                {atlasStatusNotice && (
                  <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs leading-relaxed">
                    <p className="font-semibold mb-1 flex items-center gap-1.5 text-amber-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Atlas Network Access Requirement
                    </p>
                    <p>{atlasStatusNotice}</p>
                  </div>
                )}

                <div className="text-xs text-slate-300 space-y-1 pt-1">
                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-200">How to authorize connection:</strong> In MongoDB Atlas, navigate to <code className="text-emerald-400 font-mono">Security → Network Access</code>, click <code className="text-emerald-400 font-mono">Add IP Address</code>, select <code className="text-emerald-400 font-mono">Allow Access From Anywhere (0.0.0.0/0)</code>, and save.
                  </p>
                </div>
              </div>

              {/* Database Architecture Info */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span>Dynamic Rendering Rule Compliance</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every section on the public website is 100% database-driven. If MongoDB has 0 items in a collection, that section completely hides and will not render any placeholders or empty cards.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSeedData}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md cursor-pointer"
                  >
                    Seed Full Developer Data
                  </button>
                  <button
                    type="button"
                    onClick={handleWipeData}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Wipe Database (Test Empty State)
                  </button>
                </div>
              </div>

              {/* Collections breakdown */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Collections Document Count
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {Object.entries(stats?.counts || {}).map(([col, count]) => (
                    <div
                      key={col}
                      className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between"
                    >
                      <span className="text-slate-400">{col}</span>
                      <span className="font-bold text-blue-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* COLLECTION CRUD TAB */}
          {activeTab !== 'overview' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white capitalize">
                    {TABS.find((t) => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage documents in MongoDB collection: <code className="text-blue-400 font-mono">{activeTab}</code>
                  </p>
                </div>

                {activeTab !== 'contact_messages' && (
                  <button
                    type="button"
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add {TABS.find((t) => t.id === activeTab)?.singular}</span>
                  </button>
                )}
              </div>

              {/* Items List */}
              {itemsLoading ? (
                <div className="py-16 text-center text-slate-500 text-xs font-mono flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span>Fetching documents from MongoDB...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs font-mono border-2 border-dashed border-slate-800 rounded-xl p-8 space-y-3">
                  <Database className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Collection <span className="text-blue-400 font-bold">{activeTab}</span> has 0 documents in MongoDB.</p>
                  {activeTab !== 'contact_messages' && (
                    <button
                      type="button"
                      onClick={() => handleOpenModal()}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      Create First Document
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((item, index) => {
                    const id = item.id || item._id;
                    const titleText =
                      item.title || item.name || item.company || item.institution || item.platform || item.subject || item.email || `Item #${index + 1}`;
                    const subtitleText =
                      item.role || item.category || item.issuer || item.degree || item.url || item.metric || item.created_at;

                    return (
                      <div
                        key={id}
                        className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {/* Reorder arrows */}
                          {activeTab !== 'contact_messages' && (
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveOrder(index, 'up')}
                                className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={index === items.length - 1}
                                onClick={() => handleMoveOrder(index, 'down')}
                                className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-white truncate">
                                {titleText}
                              </h4>
                              {item.is_active === false && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-500 border border-slate-700">
                                  Inactive
                                </span>
                              )}
                              {item.featured && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-400 border border-purple-800">
                                  Featured
                                </span>
                              )}
                              {activeTab === 'contact_messages' && !item.is_read && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800">
                                  New
                                </span>
                              )}
                            </div>
                            {subtitleText && (
                              <p className="text-xs text-slate-400 truncate mt-0.5 font-mono">
                                {subtitleText}
                              </p>
                            )}
                            {item.message && (
                              <p className="text-xs text-slate-300 mt-1 italic line-clamp-2">
                                "{item.message}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {activeTab !== 'contact_messages' && (
                            <button
                              type="button"
                              onClick={() => handleToggleActive(item)}
                              className={`p-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                                item.is_active
                                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
                              }`}
                              title={item.is_active ? 'Deactivate item' : 'Activate item'}
                            >
                              {item.is_active ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {activeTab !== 'contact_messages' ? (
                            <button
                              type="button"
                              onClick={() => handleOpenModal(item)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <a
                              href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject || 'Portfolio Inquiry')}`}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                            >
                              Reply
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteItem(id)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* EDIT / CREATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-base font-bold text-white">
                {editingItem ? `Edit ${TABS.find((t) => t.id === activeTab)?.singular}` : `Add New ${TABS.find((t) => t.id === activeTab)?.singular}`}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Dynamic inputs based on active tab */}
              {activeTab === 'projects' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Slug (URL identifier)</label>
                      <input
                        type="text"
                        placeholder="auto-generated from title"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Short Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.short_description || ''}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Full Description / Architecture</label>
                    <textarea
                      rows={4}
                      value={formData.full_description || ''}
                      onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-4">
                    <ImageUploadField
                      label="Thumbnail Image"
                      value={formData.thumbnail || ''}
                      onChange={(val) => setFormData({ ...formData, thumbnail: val })}
                    />

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Category</label>
                      <input
                        type="text"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Full-Stack Web, Cloud Infrastructure, etc."
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Technologies (one per line or comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : (formData.technologies || '')}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="Python, Django, MongoDB, React, Docker"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Key Features (one per line)</label>
                    <textarea
                      rows={3}
                      value={Array.isArray(formData.features) ? formData.features.join('\n') : (formData.features || '')}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="Real-time telemetry ingestion&#10;Sub-second inventory lock"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Problem</label>
                      <textarea
                        rows={2}
                        value={formData.problem || ''}
                        onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Solution</label>
                      <textarea
                        rows={2}
                        value={formData.solution || ''}
                        onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Challenges</label>
                      <textarea
                        rows={2}
                        value={formData.challenges || ''}
                        onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        value={formData.github_url || ''}
                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={formData.live_demo_url || ''}
                        onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-800 text-blue-600"
                      />
                      <span>Featured Project</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active !== false}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-800 text-blue-600"
                      />
                      <span>Active (Show on Portfolio)</span>
                    </label>
                  </div>
                </>
              )}

              {/* SKILLS FORM */}
              {activeTab === 'skills' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Skill Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Python, React, MongoDB..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Category *</label>
                      <input
                        type="text"
                        required
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Frontend, Backend, Database & Cloud, DevOps & Tools"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Proficiency % (0 - 100)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formData.proficiency || 90}
                        onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Icon Name</label>
                      <input
                        type="text"
                        value={formData.icon || 'Code'}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="Code, Server, Database, Cloud, Container..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-800 text-blue-600"
                      />
                      <span>Featured Skill</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active !== false}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-800 text-blue-600"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </>
              )}

              {/* EXPERIENCES FORM */}
              {activeTab === 'experiences' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Company *</label>
                      <input
                        type="text"
                        required
                        value={formData.company || ''}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Role / Job Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Period</label>
                      <input
                        type="text"
                        placeholder="2022 - Present"
                        value={formData.period || ''}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Company URL</label>
                      <input
                        type="text"
                        value={formData.company_url || ''}
                        onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Responsibilities (one per line)</label>
                    <textarea
                      rows={3}
                      value={Array.isArray(formData.responsibilities) ? formData.responsibilities.join('\n') : (formData.responsibilities || '')}
                      onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Technologies Used (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : (formData.technologies || '')}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData.is_current}
                        onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-800 text-blue-600"
                      />
                      <span>Current Position</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active !== false}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-800 text-blue-600"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </>
              )}

              {/* GENERIC FORM FOR OTHER COLLECTIONS */}
              {!['projects', 'skills', 'experiences'].includes(activeTab) && (
                <div className="space-y-3">
                  {Object.keys(formData).map((key) => {
                    if (['_id', 'id', 'created_at', 'updated_at'].includes(key)) return null;

                    const val = formData[key];
                    const isBool = typeof val === 'boolean';
                    const isArray = Array.isArray(val);

                    if (isBool) {
                      return (
                        <label key={key} className="flex items-center gap-2 text-xs font-mono cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={val}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                            className="rounded bg-slate-950 border-slate-800 text-blue-600"
                          />
                          <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                        </label>
                      );
                    }

                    const isImageField =
                      key.includes('image') ||
                      key.includes('avatar') ||
                      key.includes('thumbnail') ||
                      key.includes('badge') ||
                      key.includes('photo') ||
                      key.includes('og_image');

                    if (isImageField && !isArray) {
                      return (
                        <ImageUploadField
                          key={key}
                          label={key.replace(/_/g, ' ')}
                          value={typeof val === 'string' ? val : ''}
                          onChange={(newVal) => setFormData({ ...formData, [key]: newVal })}
                        />
                      );
                    }

                    return (
                      <div key={key}>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          {key.replace(/_/g, ' ')} {isArray ? '(one per line)' : ''}
                        </label>
                        {isArray || key.includes('description') || key.includes('bio') ? (
                          <textarea
                            rows={3}
                            value={isArray ? val.join('\n') : (val || '')}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                          />
                        ) : (
                          <input
                            type={typeof val === 'number' ? 'number' : 'text'}
                            value={val ?? ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [key]: typeof val === 'number' ? parseFloat(e.target.value) || 0 : e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  Save to MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
