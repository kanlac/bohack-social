import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initDatabase() {
  console.log('Creating users table...')

  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      -- Create users table
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

      -- Create index for faster queries
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

      -- Enable Row Level Security
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Allow public read access" ON users;
      DROP POLICY IF EXISTS "Allow public insert access" ON users;
      DROP POLICY IF EXISTS "Allow users to update their own data" ON users;

      -- Create policy to allow public read access
      CREATE POLICY "Allow public read access" ON users
        FOR SELECT
        USING (true);

      -- Create policy to allow public insert access
      CREATE POLICY "Allow public insert access" ON users
        FOR INSERT
        WITH CHECK (true);

      -- Create policy to allow users to update their own data
      CREATE POLICY "Allow users to update their own data" ON users
        FOR UPDATE
        USING (true)
        WITH CHECK (true);
    `
  })

  if (error) {
    console.error('Error creating table:', error)
    process.exit(1)
  }

  console.log('Database initialized successfully!')
}

initDatabase()
