const { Client } = require('pg')
require('dotenv').config({ path: '.env.local' })

// Remove sslmode from connection string and handle SSL separately
const connectionString = process.env.POSTGRES_URL_NON_POOLING?.replace(/\?.*$/, '')

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

async function createTable() {
  try {
    console.log('Connecting to database...')
    await client.connect()
    console.log('Connected!')

    console.log('Creating users table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        emoji TEXT NOT NULL,
        title TEXT NOT NULL,
        project TEXT NOT NULL,
        bio TEXT NOT NULL,
        interests TEXT[] NOT NULL,
        moods TEXT[] NOT NULL,
        wechat TEXT,
        answers JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)
    console.log('Table created!')

    console.log('Creating index...')
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
    `)
    console.log('Index created!')

    console.log('Enabling RLS...')
    await client.query(`
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    `)
    console.log('RLS enabled!')

    console.log('Dropping existing policies...')
    await client.query(`
      DROP POLICY IF EXISTS "Allow public read access" ON users;
      DROP POLICY IF EXISTS "Allow public insert access" ON users;
      DROP POLICY IF EXISTS "Allow users to update their own data" ON users;
    `)
    console.log('Old policies dropped!')

    console.log('Creating policies...')
    await client.query(`
      CREATE POLICY "Allow public read access" ON users
        FOR SELECT
        USING (true);
    `)
    await client.query(`
      CREATE POLICY "Allow public insert access" ON users
        FOR INSERT
        WITH CHECK (true);
    `)
    await client.query(`
      CREATE POLICY "Allow users to update their own data" ON users
        FOR UPDATE
        USING (true)
        WITH CHECK (true);
    `)
    console.log('Policies created!')

    console.log('✅ Database setup complete!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

createTable()
