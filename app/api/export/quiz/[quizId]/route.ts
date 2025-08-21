import { NextRequest, NextResponse } from 'next/server'
import { getSubmissionsByQuizId, getQuizById } from '@/lib/db'
import { generateQuizCSV } from '@/lib/csv-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params
    
    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 })
    }

    const submissions = await getSubmissionsByQuizId(quizId)
    
    if (submissions.length === 0) {
      return NextResponse.json({ error: 'No submissions found for this quiz' }, { status: 404 })
    }

    // Get quiz details for filename
    const quiz = await getQuizById(quizId)
    const quizTitle = quiz?.title || 'Unknown Quiz'
    
    // Enrich submissions with quiz data and parse answers
    const enrichedSubmissions = await Promise.all(submissions.map(async (submission) => {
      const parsedAnswers = JSON.parse(submission.answers)
      
      return {
        id: submission.id.toString(),
        quizId: submission.quiz_id,
        quizName: quizTitle,
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

    // Generate CSV content
    const csvContent = generateQuizCSV(quizId, enrichedSubmissions)
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const safeQuizTitle = quizTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
    const filename = `quiz_${safeQuizTitle}_results_${timestamp}.csv`
    
    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting quiz results:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 