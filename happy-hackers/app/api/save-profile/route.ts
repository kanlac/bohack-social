import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface Answer {
  question: string
  selectedOptions: string[]
  customInput: string
}

interface RequestData {
  emoji: string
  title: string
  project: string
  bio: string
  interests: string[]
  moods: string[]
  wechat?: string
  answers: Answer[]
  tags?: string[]
  uniqueQuote?: string
  background?: string
}

export async function POST(req: NextRequest) {
  try {
    const data: RequestData = await req.json()

    // Validate required fields
    if (!data.emoji || !data.title || !data.project || !data.bio ||
        !data.interests || !data.moods || !data.answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user_id from cookie
    const userId = req.cookies.get('bohack_user_id')?.value
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found. Please refresh the page.' },
        { status: 400 }
      )
    }

    // Insert or update user profile in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .upsert([
        {
          id: userId,
          emoji: data.emoji,
          title: data.title,
          project: data.project,
          bio: data.bio,
          interests: data.interests,
          moods: data.moods,
          wechat: data.wechat || null,
          answers: data.answers,
          tags: data.tags || [],
          unique_quote: data.uniqueQuote || null,
          background: data.background || null,
        },
      ], { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return NextResponse.json(
        {
          error: 'Failed to save profile',
          details: error.message,
          hint: error.hint,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
