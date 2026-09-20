import { MongoClient, ObjectId } from 'mongodb';
import { initialSeedData } from '../server/seedData.js';
import { hashPassword } from '../server/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const ATLAS_URI = process.env.MONGODB_URI || 'mongodb+srv://roshanhabakkuk0926_db_user:cGQ8zyyV4dTgBrzm@cluster0.bqaklsx.mongodb.net/?appName=Cluster0';
const DB_NAME = process.env.MONGODB_DB_NAME || 'portfolio_db';

export async function feedAtlasDatabase(uri = ATLAS_URI, dbName = DB_NAME) {
  console.log(`Connecting to MongoDB Atlas at: ${uri.replace(/:([^:@]+)@/, ':****@')}`);
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log(`Successfully connected to MongoDB Atlas! Targeting database: "${dbName}"`);
    const db = client.db(dbName);

    const defaultPassHash = await hashPassword('admin_password_123');

    // 1. Seed Admins
    const adminsCol = db.collection('admins');
    await adminsCol.deleteMany({});
    await adminsCol.insertMany([
      {
        _id: new ObjectId(),
        username: 'Roshan',
        email: 'roshanhabakkuk0926@gmail.com',
        password_hash: defaultPassHash,
        role: 'superadmin',
        created_at: new Date().toISOString(),
      },
      {
        _id: new ObjectId(),
        username: 'admin',
        email: 'roshanhabakkuk0926@gmail.com',
        password_hash: defaultPassHash,
        role: 'superadmin',
        created_at: new Date().toISOString(),
      }
    ]);
    console.log('✓ Admins seeded (Roshan & admin / admin_password_123)');

    // 2. Seed All Portfolio Collections
    for (const [colName, docs] of Object.entries(initialSeedData)) {
      const col = db.collection(colName);
      await col.deleteMany({});
      if (docs && docs.length > 0) {
        const prepared = (docs as any[]).map(d => ({
          ...d,
          _id: new ObjectId(),
          created_at: d.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        await col.insertMany(prepared);
        console.log(`✓ Seeded ${prepared.length} documents into "${colName}" collection`);
      }
    }

    console.log('\nSUCCESS! MongoDB Atlas has been completely populated with Roshan Madheswaran portfolio data.');
    await client.close();
    return { success: true };
  } catch (error: any) {
    console.error('\nError connecting or seeding Atlas database:', error.message);
    await client.close().catch(() => {});
    throw error;
  }
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('feedAtlas.ts') || process.argv[1]?.endsWith('feedAtlas.js')) {
  feedAtlasDatabase().catch(() => {
    console.log('Finished with error.');
  });
}
