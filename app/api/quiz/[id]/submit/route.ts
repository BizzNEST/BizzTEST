import { NextRequest, NextResponse } from 'next/server'
import { submitQuizAnswers } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = parseInt(params.id)
    
    if (isNaN(quizId)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 })
    }

    const body = await request.json()
    const { studentName, studentEmail, answers } = body

    if (!studentName || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    submitQuizAnswers(quizId, studentName, studentEmail || '', answers)

    return NextResponse.json({ success: true, message: 'Quiz submitted successfully' })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 