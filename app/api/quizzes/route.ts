import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { promisify } from 'util'

const dbAll = promisify(db.all.bind(db)) as (sql: string, params?: any[]) => Promise<any[]>

export async function GET() {
  try {
    const quizzes = await dbAll('SELECT * FROM quizzes ORDER BY created_at DESC')
    
    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 