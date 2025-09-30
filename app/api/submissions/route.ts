import { NextResponse } from 'next/server'
import { getAllSubmissions, getQuizById, deleteSubmission } from '@/lib/db'
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing submission id' }, { status: 400 })
    }
    await deleteSubmission(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting submission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const submissions = await getAllSubmissions()
    
    // Enrich submissions with quiz data and parse answers
    const enrichedSubmissions = await Promise.all(submissions.map(async (submission) => {
      const quiz = await getQuizById(submission.quiz_id)
      const parsedAnswers = JSON.parse(submission.answers)
      
      return {
        id: submission.id.toString(),
        quizId: submission.quiz_id,
        quizName: quiz?.title || 'Unknown Quiz',
        studentName: submission.student_name,
        studentEmail: submission.student_email,
        submittedAt: submission.submitted_at,
        score: {
          earned: submission.score,
          total: submission.total_points,
          percentage: submission.total_points > 0 ? Math.round((submission.score / submission.total_points) * 100) : 0
        },
        answers: parsedAnswers,
        quiz: quiz
      }
    }))

    return NextResponse.json(enrichedSubmissions)
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 