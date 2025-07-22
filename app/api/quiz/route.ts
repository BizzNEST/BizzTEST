import { NextRequest, NextResponse } from 'next/server'
import { createQuiz } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, questions } = body

    if (!name || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (questions.length === 0) {
      return NextResponse.json({ error: 'At least one question is required' }, { status: 400 })
    }

    // Transform the frontend question format to match the database format
    const dbQuestions = questions.map((q: any) => ({
      type: q.type,
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      points: q.points || 1,
      has_correct_answer: q.type === 'short-answer' ? 
        (q.correctAnswer && q.correctAnswer.trim() !== '') : 
        (q.correctAnswer !== undefined && q.correctAnswer !== '')
    }))

    const quizId = createQuiz(name, description || '', dbQuestions)

    return NextResponse.json({ id: quizId, message: 'Quiz created successfully' })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 