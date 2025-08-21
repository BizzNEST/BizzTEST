import { NextRequest, NextResponse } from 'next/server'
import { getSubmissionById, getQuizById } from '@/lib/db'
import { generateSubmissionCSV } from '@/lib/csv-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const submissionId = parseInt(id)
    
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    const submission = await getSubmissionById(submissionId)
    
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Enrich submission with quiz data
    const quiz = await getQuizById(submission.quiz_id)
    const parsedAnswers = JSON.parse(submission.answers)
    
    const enrichedSubmission = {
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

    // Generate CSV content
    const csvContent = generateSubmissionCSV(enrichedSubmission)
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `quiz_result_${enrichedSubmission.studentName.replace(/\s+/g, '_')}_${timestamp}.csv`
    
    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting submission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 