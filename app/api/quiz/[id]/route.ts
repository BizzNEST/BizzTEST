import { NextRequest, NextResponse } from 'next/server'
import { getQuizById, updateQuiz, deleteQuiz } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const quizId = id
    
    if (!quizId || quizId.trim() === '') {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 })
    }

    const quiz = await getQuizById(quizId)
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
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
      correct_answer: q.type === 'multiple-choice-multiple' && Array.isArray(q.correctAnswer) 
        ? q.correctAnswer.join(',') 
        : q.correctAnswer,
      points: q.points || 1,
      has_correct_answer: q.type === 'short-answer' ? 
        (q.correctAnswer && q.correctAnswer.trim() !== '') : 
        q.type === 'file-upload' ? false :
        (q.correctAnswer !== undefined && q.correctAnswer !== '' && 
         !(Array.isArray(q.correctAnswer) && q.correctAnswer.length === 0))
    }))

    await updateQuiz(quizId, name, description || '', dbQuestions)

    return NextResponse.json({ message: 'Quiz updated successfully' })
  } catch (error) {
    console.error('Error updating quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const quizId = id
    
    if (!quizId || quizId.trim() === '') {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 })
    }

    // Check if quiz exists
    const quiz = await getQuizById(quizId)
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    await deleteQuiz(quizId)

    return NextResponse.json({ message: 'Quiz deleted successfully' })
  } catch (error) {
    console.error('Error deleting quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 