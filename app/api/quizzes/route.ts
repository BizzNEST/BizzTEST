import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const quizzes = db.prepare('SELECT * FROM quizzes ORDER BY created_at DESC').all()
    
    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 