import { Submission } from './db'

// Helper function to escape CSV values
const escapeCSVValue = (value: string): string => {
  if (!value) return ''
  
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  
  return value
}

// Helper function to format date consistently
const formatDate = (dateString: string): string => {
  const date = new Date(dateString.includes('Z') ? dateString : dateString + 'Z')
  return date.toISOString().split('T')[0] // YYYY-MM-DD format
}

// Generate CSV for individual submission
export const generateSubmissionCSV = (submission: any): string => {
  const headers = [
    'Student Name',
    'Student Email', 
    'Quiz Name',
    'Submission Date',
    'Question Number',
    'Question Type',
    'Question Text',
    'Student Answer',
    'Correct Answer',
    'Points Earned',
    'Total Points',
    'Is Correct'
  ]

  const rows: string[] = []
  
  // Add header row
  rows.push(headers.join(','))
  
  // Process each question/answer
  if (submission.quiz && submission.quiz.questions) {
    submission.quiz.questions.forEach((question: any, index: number) => {
      const userAnswer = submission.answers[question.id.toString()] || ""
      let isCorrect = false
      
      if (question.has_correct_answer) {
        if (question.type === 'short-answer') {
          isCorrect = userAnswer.toLowerCase().trim() === question.correct_answer?.toLowerCase()
        } else if (question.type === 'multiple-choice-multiple') {
          if (question.correct_answer) {
            const userSelections = userAnswer.split(',').filter((a: string) => a !== '').sort()
            const correctSelections = question.correct_answer.split(',').sort()
            isCorrect = userSelections.length === correctSelections.length && 
                       userSelections.every((val: string, index: number) => val === correctSelections[index])
          }
        } else {
          isCorrect = userAnswer === question.correct_answer
        }
      }

      const earnedPoints = question.has_correct_answer && isCorrect ? question.points : 0
      
      const row = [
        escapeCSVValue(submission.studentName),
        escapeCSVValue(submission.studentEmail),
        escapeCSVValue(submission.quizName),
        formatDate(submission.submittedAt),
        `Q${index + 1}`,
        escapeCSVValue(question.type),
        escapeCSVValue(question.question),
        escapeCSVValue(userAnswer),
        escapeCSVValue(question.correct_answer || ''),
        earnedPoints.toString(),
        question.points.toString(),
        isCorrect ? 'Yes' : 'No'
      ]
      
      rows.push(row.join(','))
    })
  }
  
  return rows.join('\n')
}

// Generate CSV for bulk export (all submissions)
export const generateBulkCSV = (submissions: any[]): string => {
  const headers = [
    'Student Name',
    'Student Email',
    'Quiz Name', 
    'Submission Date',
    'Total Score',
    'Total Points',
    'Percentage',
    'Questions Correct',
    'Total Questions',
    'Time Taken (minutes)'
  ]

  const rows: string[] = []
  rows.push(headers.join(','))
  
  submissions.forEach(submission => {
    let questionsCorrect = 0
    let totalQuestions = 0
    
    if (submission.quiz && submission.quiz.questions) {
      submission.quiz.questions.forEach((question: any) => {
        if (question.has_correct_answer) {
          totalQuestions++
          const userAnswer = submission.answers[question.id.toString()] || ""
          let isCorrect = false
          
          if (question.type === 'short-answer') {
            isCorrect = userAnswer.toLowerCase().trim() === question.correct_answer?.toLowerCase()
          } else if (question.type === 'multiple-choice-multiple') {
            if (question.correct_answer) {
              const userSelections = userAnswer.split(',').filter((a: string) => a !== '').sort()
              const correctSelections = question.correct_answer.split(',').sort()
              isCorrect = userSelections.length === correctSelections.length && 
                         userSelections.every((val: string, index: number) => val === correctSelections[index])
            }
          } else {
            isCorrect = userAnswer === question.correct_answer
          }
          
          if (isCorrect) questionsCorrect++
        }
      })
    }
    
    const row = [
      escapeCSVValue(submission.studentName),
      escapeCSVValue(submission.studentEmail),
      escapeCSVValue(submission.quizName),
      formatDate(submission.submittedAt),
      submission.score.earned.toString(),
      submission.score.total.toString(),
      submission.score.percentage.toString(),
      questionsCorrect.toString(),
      totalQuestions.toString(),
      '0' // Time taken not currently tracked
    ]
    
    rows.push(row.join(','))
  })
  
  return rows.join('\n')
}

// Generate CSV for specific quiz
export const generateQuizCSV = (quizId: string, submissions: any[]): string => {
  const quizSubmissions = submissions.filter(sub => sub.quizId === quizId)
  return generateBulkCSV(quizSubmissions)
}

// Generate summary statistics CSV
export const generateSummaryCSV = (submissions: any[]): string => {
  const headers = [
    'Quiz Name',
    'Total Submissions',
    'Average Score (%)',
    'Highest Score (%)',
    'Lowest Score (%)',
    'Perfect Scores',
    'Passing Rate (70%+)'
  ]

  const rows: string[] = []
  rows.push(headers.join(','))
  
  // Group submissions by quiz
  const quizGroups: Record<string, { quizName: string, submissions: any[] }> = {}
  
  submissions.forEach(submission => {
    if (!quizGroups[submission.quizId]) {
      quizGroups[submission.quizId] = {
        quizName: submission.quizName,
        submissions: []
      }
    }
    quizGroups[submission.quizId].submissions.push(submission)
  })
  
  Object.values(quizGroups).forEach(group => {
    const scores = group.submissions.map((s: any) => s.score.percentage)
    const average = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
    const highest = Math.max(...scores)
    const lowest = Math.min(...scores)
    const perfect = scores.filter((s: number) => s === 100).length
    const passing = scores.filter((s: number) => s >= 70).length
    const passingRate = Math.round((passing / scores.length) * 100)
    
    const row = [
      escapeCSVValue(group.quizName),
      group.submissions.length.toString(),
      average.toString(),
      highest.toString(),
      lowest.toString(),
      perfect.toString(),
      passingRate.toString()
    ]
    
    rows.push(row.join(','))
  })
  
  return rows.join('\n')
} 