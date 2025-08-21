import { NextRequest, NextResponse } from 'next/server'
import { getAllSubmissions, getQuizById } from '@/lib/db'
import { generateBulkCSV, generateSummaryCSV } from '@/lib/csv-generator'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'bulk' // 'bulk' or 'summary'
    
    const submissions = await getAllSubmissions()
    
    if (submissions.length === 0) {
      return NextResponse.json({ error: 'No submissions found' }, { status: 404 })
    }
    
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

    let csvContent: string
    let filename: string
    
    if (format === 'summary') {
      csvContent = generateSummaryCSV(enrichedSubmissions)
      filename = `quiz_summary_${new Date().toISOString().split('T')[0]}.csv`
    } else {
      csvContent = generateBulkCSV(enrichedSubmissions)
      filename = `all_quiz_results_${new Date().toISOString().split('T')[0]}.csv`
    }
    
    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting submissions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 