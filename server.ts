import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDb } from './server/db.js';
import { initialSeedData } from './server/seedData.js';
import {
  generateToken,
  hashPassword,
  comparePassword,
  requireAdminAuth,
  AuthRequest
} from './server/auth.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(cors());
  app.use(express.json());

  // Database initialization and default admin seeding
  const db = await getDb();

  // Initialize admin if none exists
  const adminsCol = db.collection('admins');
  const adminCount = await adminsCol.countDocuments();
  if (adminCount === 0) {
    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin_password_123';
    const passwordHash = await hashPassword(defaultPassword);
    await adminsCol.insertOne({
      username: defaultUsername,
      email: 'admin@portfolio.local',
      password_hash: passwordHash,
      role: 'superadmin',
      created_at: new Date().toISOString()
    });
    console.log(`Default admin created: ${defaultUsername}`);
  }

  // If local DB is completely empty on first launch, seed default demo data so user has immediate preview
  const profileCol = db.collection('profiles');
  const pCount = await profileCol.countDocuments();
  if (pCount === 0) {
    console.log('Seeding initial developer portfolio data...');
    await db.seed(initialSeedData);
  }

  // ==========================================
  // PUBLIC PORTFOLIO APIS (Match Django REST Spec)
  // ==========================================

  // GET /api/profile/
  app.get('/api/profile', async (req, res) => {
    try {
      const doc = await db.collection('profiles').findOne({ is_active: true });
      res.json(doc || null);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get('/api/profile/', (req, res) => res.redirect(301, '/api/profile'));

  // GET /api/about/
  app.get('/api/about', async (req, res) => {
    try {
      const doc = await db.collection('about').findOne({ is_active: true });
      res.json(doc || null);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get('/api/about/', (req, res) => res.redirect(301, '/api/about'));

  // GET /api/skills/
  app.get('/api/skills', async (req, res) => {
    try {
      const docs = await db.collection('skills').find({ is_active: true }, { display_order: 1 });
      res.json(docs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get('/api/skills/', (req, res) => res.redirect(301, '/api/skills'));

  // GET /api/experience/
  app.get('/api/experience', async (req, res) => {
    try {
      const docs = await db.collection('experiences').find({ is_active: true }, { display_order: 1 });
      res.json(docs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get('/api/experience/', (req, res) => res.redirect(301, '/api/experience'));

  // GET /api/education/
  app.get('/api/education', async (req, res) => {
    try {
      const docs = await db.collection('education').find({ is_active: true }, { display_order: 1 });
      res.json(docs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get('/api/education/', (req, res) => res.redirect(301, '/api/education'));

  // GET /api/projects/
  app.get('/api/projects', async (req, res) => {
    try {
      const docs = await db.collection('projects').find({ is_active: true }, { display_order: 1 });
      res.json(docs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get('/api/projects/', (req, res) => res.redirect(301, '/api/projects'));

  // GET /api/projects/:slug/
  app.get('/api/projects/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      const project = await db.collection('projects').findOne({ slug, is_active: true });
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/certifications/
  app.get('/api/certifications', async (req, res) => {
    try {
      const docs = await db.collection('certifications').find({ is_active: true }, { display_order: 1 });
      res.json(docs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get('/api/certifications/', (req, res) => res.redirect(301, '/api/certifications'));

  // GET /api/achievements/
  app.get('/api/achievements', async (req, res) => {
    try {
      const docs = await db.collection('achievements').find({ is_active: true }, { display_order: 1 });
      res.json(docs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get('/api/achievements/', (req, res) => res.redirect(301, '/api/achievements'));

  // GET /api/social-links/
  app.get('/api/social-links', async (req, res) => {
    try {
      const docs = await db.collection('social_links').find({ is_active: true }, { display_order: 1 });
      res.json(docs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get('/api/social-links/', (req, res) => res.redirect(301, '/api/social-links'));

  // GET /api/contact/
  app.get('/api/contact', async (req, res) => {
    try {
      const doc = await db.collection('contact_info').findOne({ is_active: true });
      res.json(doc || null);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get('/api/contact/', (req, res) => res.redirect(301, '/api/contact'));

  // POST /api/contact/ (Submit message)
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      const newMsg = await db.collection('contact_messages').insertOne({
        name: name.trim(),
        email: email.trim(),
        subject: (subject || 'Portfolio Inquiry').trim(),
        message: message.trim(),
        is_read: false,
        is_replied: false,
        created_at: new Date().toISOString()
      });

      res.status(201).json({ success: true, message: 'Message sent successfully!', data: newMsg });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/settings/
  app.get('/api/settings', async (req, res) => {
    try {
      const doc = await db.collection('site_settings').findOne({ is_active: true });
      res.json(doc || null);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/portfolio-summary/ (Aggregated endpoint for single-roundtrip fast render)
  app.get('/api/portfolio-summary', async (req, res) => {
    try {
      const [
        profile,
        about,
        skills,
        experiences,
        education,
        projects,
        certifications,
        achievements,
        socialLinks,
        contactInfo,
        siteSettings
      ] = await Promise.all([
        db.collection('profiles').findOne({ is_active: true }),
        db.collection('about').findOne({ is_active: true }),
        db.collection('skills').find({ is_active: true }, { display_order: 1 }),
        db.collection('experiences').find({ is_active: true }, { display_order: 1 }),
        db.collection('education').find({ is_active: true }, { display_order: 1 }),
        db.collection('projects').find({ is_active: true }, { display_order: 1 }),
        db.collection('certifications').find({ is_active: true }, { display_order: 1 }),
        db.collection('achievements').find({ is_active: true }, { display_order: 1 }),
        db.collection('social_links').find({ is_active: true }, { display_order: 1 }),
        db.collection('contact_info').findOne({ is_active: true }),
        db.collection('site_settings').findOne({ is_active: true })
      ]);

      res.json({
        profile: profile || null,
        about: about || null,
        skills: skills || [],
        experiences: experiences || [],
        education: education || [],
        projects: projects || [],
        certifications: certifications || [],
        achievements: achievements || [],
        social_links: socialLinks || [],
        contact_info: contactInfo || null,
        site_settings: siteSettings || null
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==========================================
  // ADMIN APIS (Protected by JWT)
  // ==========================================

  // POST /api/admin/login
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const adminUser = await db.collection('admins').findOne({ username });
      if (!adminUser) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const isMatch = await comparePassword(password, adminUser.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = generateToken({
        id: adminUser.id || adminUser._id.toString(),
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
      });

      res.json({
        token,
        admin: {
          id: adminUser.id || adminUser._id.toString(),
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/admin/me
  app.get('/api/admin/me', requireAdminAuth as any, (req: AuthRequest, res) => {
    res.json({ admin: req.admin });
  });

  // GET /api/admin/verify
  app.get('/api/admin/verify', requireAdminAuth as any, (req: AuthRequest, res) => {
    res.json({ valid: true, admin: req.admin });
  });

  // GET /api/admin/stats
  app.get('/api/admin/stats', requireAdminAuth as any, async (req, res) => {
    try {
      const stats = await db.stats();
      const unreadMessages = await db.collection('contact_messages').countDocuments({ is_read: false });
      const isAtlas = db.isAtlas;
      res.json({
        counts: stats,
        unread_messages: unreadMessages,
        is_atlas: isAtlas,
        database_type: isAtlas ? 'MongoDB Atlas (Remote)' : 'Local JSON Persistent Engine',
        connected: db.isConnected()
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // List all collections items (including inactive)
  const allowedCollections = [
    'profiles', 'about', 'skills', 'experiences', 'education',
    'projects', 'certifications', 'achievements', 'social_links',
    'contact_info', 'contact_messages', 'site_settings'
  ];

  app.get('/api/admin/collections/:collection', requireAdminAuth as any, async (req, res) => {
    try {
      const col = req.params.collection;
      if (!allowedCollections.includes(col)) {
        return res.status(400).json({ error: 'Invalid collection' });
      }
      const sort = col === 'contact_messages' ? { created_at: -1 } : { display_order: 1 };
      const items = await db.collection(col).find({}, sort);
      res.json(items);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Create item in collection
  app.post('/api/admin/collections/:collection', requireAdminAuth as any, async (req, res) => {
    try {
      const col = req.params.collection;
      if (!allowedCollections.includes(col)) {
        return res.status(400).json({ error: 'Invalid collection' });
      }
      const data = req.body;
      const created = await db.collection(col).insertOne(data);
      res.status(201).json(created);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Update item in collection
  app.put('/api/admin/collections/:collection/:id', requireAdminAuth as any, async (req, res) => {
    try {
      const col = req.params.collection;
      const id = req.params.id;
      if (!allowedCollections.includes(col)) {
        return res.status(400).json({ error: 'Invalid collection' });
      }
      const updateData = req.body;
      delete updateData._id;
      delete updateData.id;

      const updated = await db.collection(col).updateOne({ id }, updateData);
      if (!updated) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Delete item in collection
  app.delete('/api/admin/collections/:collection/:id', requireAdminAuth as any, async (req, res) => {
    try {
      const col = req.params.collection;
      const id = req.params.id;
      if (!allowedCollections.includes(col)) {
        return res.status(400).json({ error: 'Invalid collection' });
      }
      const deleted = await db.collection(col).deleteOne({ id });
      res.json({ success: deleted });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Reorder items in collection
  app.post('/api/admin/collections/:collection/reorder', requireAdminAuth as any, async (req, res) => {
    try {
      const col = req.params.collection;
      if (!allowedCollections.includes(col)) {
        return res.status(400).json({ error: 'Invalid collection' });
      }
      const { items } = req.body; // array of { id, display_order }
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Items array is required' });
      }

      for (const item of items) {
        await db.collection(col).updateOne({ id: item.id }, { display_order: item.display_order });
      }
      res.json({ success: true, message: 'Reordered successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Seed sample developer data
  app.post('/api/admin/seed', requireAdminAuth as any, async (req, res) => {
    try {
      await db.seed(initialSeedData);
      res.json({ success: true, message: 'Database successfully seeded with realistic developer data!' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Feed / sync directly to configured MongoDB Atlas cluster
  app.post('/api/admin/feed-atlas', requireAdminAuth as any, async (req, res) => {
    try {
      const { feedAtlasDatabase } = await import('./scripts/feedAtlas.js');
      const uri = req.body?.uri || process.env.MONGODB_URI;
      const dbName = req.body?.db_name || process.env.MONGODB_DB_NAME || 'portfolio_db';
      
      if (!uri) {
        return res.status(400).json({ error: 'No MongoDB URI configured or provided in request.' });
      }

      await feedAtlasDatabase(uri, dbName);
      res.json({
        success: true,
        message: `Successfully connected to MongoDB Atlas and seeded all collections in database "${dbName}"!`
      });
    } catch (e: any) {
      const isIpWhitelistIssue = e.message?.includes('SSL alert number 80') || e.message?.includes('tlsv1 alert internal error') || e.message?.includes('whitelist');
      res.status(500).json({
        error: e.message,
        is_ip_whitelist_issue: isIpWhitelistIssue,
        ip_hint: 'In MongoDB Atlas -> Network Access -> Add IP Address: Add 0.0.0.0/0 (Allow Access from Anywhere).'
      });
    }
  });

  // Wipe all portfolio data (test empty state)
  app.post('/api/admin/wipe', requireAdminAuth as any, async (req, res) => {
    try {
      await db.wipe();
      res.json({ success: true, message: 'Database wiped successfully. Portfolio will now show 0 sections.' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==========================================
  // VITE OR STATIC FRONTEND SERVING / HEALTH CHECK
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(indexPath);
      });
    } else {
      app.get('/', (req, res) => {
        res.json({
          status: 'ok',
          message: 'Portfolio Backend API is running smoothly.',
          endpoints: {
            summary: '/api/portfolio-summary',
            profile: '/api/profile',
            skills: '/api/skills',
            projects: '/api/projects'
          }
        });
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
});
