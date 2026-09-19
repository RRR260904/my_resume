import fs from 'fs';
import path from 'path';
import { MongoClient, Db, ObjectId } from 'mongodb';

export interface DatabaseAdapter {
  isAtlas: boolean;
  collection: (name: string) => CollectionAdapter;
  stats: () => Promise<Record<string, number>>;
  seed: (data: any) => Promise<void>;
  wipe: () => Promise<void>;
  isConnected: () => boolean;
}

export interface CollectionAdapter {
  find: (query?: any, sort?: any) => Promise<any[]>;
  findOne: (query: any) => Promise<any | null>;
  insertOne: (doc: any) => Promise<any>;
  updateOne: (query: any, update: any) => Promise<any>;
  deleteOne: (query: any) => Promise<boolean>;
  countDocuments: (query?: any) => Promise<number>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class LocalDatabaseAdapter implements DatabaseAdapter {
  isAtlas = false;
  private data: Record<string, any[]> = {};

  constructor() {
    this.load();
  }

  isConnected(): boolean {
    return true;
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = {};
        this.save();
      }
    } catch (e) {
      console.error('Failed to read local DB, initializing empty', e);
      this.data = {};
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save local DB file', e);
    }
  }

  collection(name: string): CollectionAdapter {
    if (!this.data[name]) {
      this.data[name] = [];
    }

    const self = this;

    return {
      async find(query = {}, sort = { display_order: 1 }) {
        let items = [...(self.data[name] || [])];

        // Basic query filtering
        items = items.filter(item => {
          for (const key of Object.keys(query)) {
            if (key === '$or') {
              const matched = query.$or.some((subQ: any) => {
                return Object.keys(subQ).every(k => item[k] === subQ[k]);
              });
              if (!matched) return false;
            } else if (item[key] !== query[key]) {
              return false;
            }
          }
          return true;
        });

        // Basic sorting
        if (sort) {
          const sortKey = Object.keys(sort)[0];
          const sortDir = sort[sortKey];
          if (sortKey) {
            items.sort((a, b) => {
              const valA = a[sortKey] ?? 0;
              const valB = b[sortKey] ?? 0;
              if (valA < valB) return sortDir === -1 ? 1 : -1;
              if (valA > valB) return sortDir === -1 ? -1 : 1;
              return 0;
            });
          }
        }

        return items;
      },

      async findOne(query: any) {
        const items = await this.find(query);
        return items.length > 0 ? items[0] : null;
      },

      async insertOne(doc: any) {
        const id = doc._id || new ObjectId().toString();
        const newDoc = {
          ...doc,
          _id: id,
          id: id,
          created_at: doc.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        self.data[name].push(newDoc);
        self.save();
        return newDoc;
      },

      async updateOne(query: any, update: any) {
        const items = self.data[name] || [];
        const index = items.findIndex(item => {
          for (const k of Object.keys(query)) {
            if (item[k] !== query[k]) return false;
          }
          return true;
        });

        if (index !== -1) {
          const payload = update.$set ? update.$set : update;
          self.data[name][index] = {
            ...self.data[name][index],
            ...payload,
            updated_at: new Date().toISOString(),
          };
          self.save();
          return self.data[name][index];
        }
        return null;
      },

      async deleteOne(query: any) {
        const initialLength = (self.data[name] || []).length;
        self.data[name] = (self.data[name] || []).filter(item => {
          for (const k of Object.keys(query)) {
            if (item[k] === query[k]) return false;
          }
          return true;
        });
        const deleted = self.data[name].length < initialLength;
        if (deleted) self.save();
        return deleted;
      },

      async countDocuments(query = {}) {
        const items = await this.find(query);
        return items.length;
      },
    };
  }

  async stats(): Promise<Record<string, number>> {
    const res: Record<string, number> = {};
    for (const key of Object.keys(this.data)) {
      res[key] = (this.data[key] || []).length;
    }
    return res;
  }

  async seed(seedData: Record<string, any[]>) {
    for (const [colName, docs] of Object.entries(seedData)) {
      this.data[colName] = docs.map(d => ({
        ...d,
        _id: d._id || new ObjectId().toString(),
        id: d.id || d._id || new ObjectId().toString(),
        created_at: d.created_at || new Date().toISOString(),
      }));
    }
    this.save();
  }

  async wipe() {
    const keepAdmins = this.data['admins'] || [];
    this.data = {
      admins: keepAdmins,
    };
    this.save();
  }
}

class MongoAtlasDatabaseAdapter implements DatabaseAdapter {
  isAtlas = true;
  private client: MongoClient;
  private db: Db;
  private connected = false;

  constructor(client: MongoClient, db: Db) {
    this.client = client;
    this.db = db;
    this.connected = true;
  }

  isConnected(): boolean {
    return this.connected;
  }

  collection(name: string): CollectionAdapter {
    const col = this.db.collection(name);
    return {
      async find(query = {}, sort = { display_order: 1 }) {
        const safeQuery = { ...query };
        if (safeQuery.id && !safeQuery._id) {
          safeQuery._id = ObjectId.isValid(safeQuery.id) ? new ObjectId(safeQuery.id) : safeQuery.id;
          delete safeQuery.id;
        }
        const cursor = col.find(safeQuery);
        if (sort) cursor.sort(sort);
        const docs = await cursor.toArray();
        return docs.map(d => ({
          ...d,
          id: d._id.toString(),
        }));
      },

      async findOne(query: any) {
        const safeQuery = { ...query };
        if (safeQuery.id && !safeQuery._id) {
          safeQuery._id = ObjectId.isValid(safeQuery.id) ? new ObjectId(safeQuery.id) : safeQuery.id;
          delete safeQuery.id;
        }
        const doc = await col.findOne(safeQuery);
        if (!doc) return null;
        return {
          ...doc,
          id: doc._id.toString(),
        };
      },

      async insertOne(doc: any) {
        const toInsert = {
          ...doc,
          created_at: doc.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const result = await col.insertOne(toInsert);
        return {
          ...toInsert,
          _id: result.insertedId,
          id: result.insertedId.toString(),
        };
      },

      async updateOne(query: any, update: any) {
        const safeQuery = { ...query };
        if (safeQuery.id && !safeQuery._id) {
          safeQuery._id = ObjectId.isValid(safeQuery.id) ? new ObjectId(safeQuery.id) : safeQuery.id;
          delete safeQuery.id;
        }
        const updatePayload = update.$set ? update : { $set: { ...update, updated_at: new Date().toISOString() } };
        await col.updateOne(safeQuery, updatePayload);
        const updated = await col.findOne(safeQuery);
        return updated ? { ...updated, id: updated._id.toString() } : null;
      },

      async deleteOne(query: any) {
        const safeQuery = { ...query };
        if (safeQuery.id && !safeQuery._id) {
          safeQuery._id = ObjectId.isValid(safeQuery.id) ? new ObjectId(safeQuery.id) : safeQuery.id;
          delete safeQuery.id;
        }
        const result = await col.deleteOne(safeQuery);
        return (result.deletedCount ?? 0) > 0;
      },

      async countDocuments(query = {}) {
        return await col.countDocuments(query);
      },
    };
  }

  async stats(): Promise<Record<string, number>> {
    const collections = [
      'profiles', 'about', 'skills', 'experiences', 'education',
      'projects', 'certifications', 'achievements', 'social_links',
      'contact_info', 'contact_messages', 'site_settings', 'admins'
    ];
    const res: Record<string, number> = {};
    for (const name of collections) {
      try {
        res[name] = await this.db.collection(name).countDocuments();
      } catch {
        res[name] = 0;
      }
    }
    return res;
  }

  async seed(seedData: Record<string, any[]>) {
    for (const [colName, docs] of Object.entries(seedData)) {
      const col = this.db.collection(colName);
      await col.deleteMany({});
      if (docs.length > 0) {
        await col.insertMany(docs.map(d => ({
          ...d,
          created_at: d.created_at || new Date().toISOString(),
        })));
      }
    }
  }

  async wipe() {
    const collections = [
      'profiles', 'about', 'skills', 'experiences', 'education',
      'projects', 'certifications', 'achievements', 'social_links',
      'contact_info', 'contact_messages', 'site_settings'
    ];
    for (const colName of collections) {
      await this.db.collection(colName).deleteMany({});
    }
  }
}

let activeDb: DatabaseAdapter | null = null;

export async function getDb(): Promise<DatabaseAdapter> {
  if (activeDb) return activeDb;

  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && mongoUri.trim() !== '') {
    try {
      console.log('Connecting to MongoDB Atlas / Remote MongoDB URI...');
      const client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      await client.connect();
      const dbName = process.env.MONGODB_DB_NAME || 'portfolio_db';
      const db = client.db(dbName);
      console.log(`Successfully connected to MongoDB database: ${dbName}`);
      activeDb = new MongoAtlasDatabaseAdapter(client, db);
      return activeDb;
    } catch (err) {
      console.warn('Could not connect to specified MongoDB URI, falling back to local persistent store:', err);
    }
  }

  console.log('Using local persistent MongoDB-compatible JSON storage engine in ./data/database.json');
  activeDb = new LocalDatabaseAdapter();
  return activeDb;
}
