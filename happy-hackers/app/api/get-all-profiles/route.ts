import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    // Get user_id from cookie (to exclude current user)
    const currentUserId = req.cookies.get('bohack_user_id')?.value

    // Fetch all user profiles from Supabase
    const { data: users, error } = await supabase
      .from('users')
      .select('id, emoji, title, project, bio, interests, moods')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch profiles' },
        { status: 500 }
      )
    }

    // Filter out current user if they have a profile
    const filteredUsers = currentUserId
      ? users.filter(user => user.id !== currentUserId)
      : users

    return NextResponse.json({
      success: true,
      users: filteredUsers
    })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
