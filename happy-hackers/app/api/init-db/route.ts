import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Try to query the table first to see if it exists
    const { error: checkError } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: 'Table already exists',
        tableExists: true,
      })
    }

    // If table doesn't exist, provide instructions
    if (checkError.message?.includes('does not exist') || checkError.code === '42P01') {
      return NextResponse.json({
        success: false,
        message: 'Table does not exist. Please run the SQL in Supabase Dashboard.',
        instructions: {
          step1: 'Go to https://supabase.com/dashboard/project/gtyiplbprppjiohwpaxd/sql',
          step2: 'Copy the SQL from supabase/migrations/create_users_table.sql',
          step3: 'Paste and run it in the SQL editor',
        },
        sql: `CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji TEXT NOT NULL,
  title TEXT NOT NULL,
  project TEXT NOT NULL,
  bio TEXT NOT NULL,
  interests TEXT[] NOT NULL,
  moods TEXT[] NOT NULL,
  wechat TEXT,
  answers JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  unique_quote TEXT,
  background TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update their own data" ON users FOR UPDATE USING (true) WITH CHECK (true);`,
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: checkError.message,
    }, { status: 500 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
