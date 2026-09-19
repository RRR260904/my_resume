import fs from 'fs';
import path from 'path';
import { initialSeedData } from '../server/seedData.js';
import { ObjectId } from 'mongodb';
import { hashPassword } from '../server/auth.js';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

async function seedRoshan() {
  let existingAdmins: any[] = [];
  if (fs.existsSync(DB_FILE)) {
    try {
      const current = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      existingAdmins = current.admins || [];
    } catch (e) {
      console.error('Failed to parse existing DB', e);
    }
  }

  const defaultPassHash = await hashPassword('admin_password_123');

  const admins = [
    {
      _id: new ObjectId().toString(),
      id: new ObjectId().toString(),
      username: 'Roshan',
      email: 'roshanhabakkuk0926@gmail.com',
      password_hash: defaultPassHash,
      role: 'superadmin',
      created_at: new Date().toISOString(),
    },
    {
      _id: new ObjectId().toString(),
      id: new ObjectId().toString(),
      username: 'admin',
      email: 'roshanhabakkuk0926@gmail.com',
      password_hash: defaultPassHash,
      role: 'superadmin',
      created_at: new Date().toISOString(),
    }
  ];

  const newData: Record<string, any[]> = {
    admins,
  };

  for (const [colName, docs] of Object.entries(initialSeedData)) {
    newData[colName] = (docs as any[]).map(d => ({
      ...d,
      _id: d._id || new ObjectId().toString(),
      id: d.id || d._id || new ObjectId().toString(),
      created_at: d.created_at || new Date().toISOString(),
    }));
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(newData, null, 2), 'utf-8');
  console.log('Successfully seeded database with Roshan Madheswaran portfolio data!');
}

seedRoshan().catch(console.error);
