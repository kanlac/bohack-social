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

    // Insert user profile into Supabase
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          emoji: data.emoji,
          title: data.title,
          project: data.project,
          bio: data.bio,
          interests: data.interests,
          moods: data.moods,
          wechat: data.wechat || null,
          answers: data.answers,
        },
      ])
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
