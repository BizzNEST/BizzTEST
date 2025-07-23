import { NextRequest, NextResponse } from 'next/server'
import { submitQuizAnswers } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const quizId = id
    
    if (!quizId || quizId.trim() === '') {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 })
    }

    const body = await request.json()
    const { studentName, studentEmail, answers } = body

    if (!studentName || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await submitQuizAnswers(quizId, studentName, studentEmail || '', answers)

    return NextResponse.json({ success: true, message: 'Quiz submitted successfully' })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 