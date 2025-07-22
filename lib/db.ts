import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(process.cwd(), 'database.db'))

// Function to generate random quiz ID
const generateQuizId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('multiple-choice-single', 'multiple-choice-multiple', 'true-false', 'short-answer')),
    question TEXT NOT NULL,
    options TEXT, -- JSON string for multiple choice options
    correct_answer TEXT,
    points INTEGER DEFAULT 1,
    has_correct_answer BOOLEAN DEFAULT 1,
    FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id TEXT NOT NULL,
    student_name TEXT,
    student_email TEXT,
    answers TEXT, -- JSON string of answers
    score INTEGER,
    total_points INTEGER,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
  );
`)

export interface Quiz {
  id: string
  title: string
  description: string
  created_at: string
}

export interface Question {
  id: number
  quiz_id: string
  type: 'multiple-choice-single' | 'multiple-choice-multiple' | 'true-false' | 'short-answer'
  question: string
  options?: string[]
  correct_answer?: string
  points: number
  has_correct_answer: boolean
}

interface RawQuestion {
  id: number
  quiz_id: string
  type: 'multiple-choice-single' | 'multiple-choice-multiple' | 'true-false' | 'short-answer'
  question: string
  options?: string // JSON string in database
  correct_answer?: string
  points: number
  has_correct_answer: number // SQLite boolean as number
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[]
}

// Quiz functions
export const getQuizById = (id: string): QuizWithQuestions | null => {
  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(id) as Quiz | undefined
  if (!quiz) return null

  const questions = db.prepare('SELECT * FROM questions WHERE quiz_id = ?').all(id) as RawQuestion[]
  
  // Parse options JSON
  const parsedQuestions: Question[] = questions.map(q => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : undefined,
    has_correct_answer: Boolean(q.has_correct_answer)
  }))

  return {
    ...quiz,
    questions: parsedQuestions
  }
}

export const createQuiz = (title: string, description: string, questions: Omit<Question, 'id' | 'quiz_id'>[]): string => {
  const quizId = generateQuizId()
  const insertQuiz = db.prepare('INSERT INTO quizzes (id, title, description) VALUES (?, ?, ?)')
  const insertQuestion = db.prepare(`
    INSERT INTO questions (quiz_id, type, question, options, correct_answer, points, has_correct_answer) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const transaction = db.transaction(() => {
    insertQuiz.run(quizId, title, description)

    for (const question of questions) {
      insertQuestion.run(
        quizId,
        question.type,
        question.question,
        question.options ? JSON.stringify(question.options) : null,
        question.correct_answer,
        question.points,
        question.has_correct_answer ? 1 : 0
      )
    }

    return quizId
  })

  return transaction()
}

export const submitQuizAnswers = (quizId: string, studentName: string, studentEmail: string, answers: Record<string, string>): void => {
  const quiz = getQuizById(quizId)
  if (!quiz) throw new Error('Quiz not found')

  let score = 0
  let totalPoints = 0

  quiz.questions.forEach(question => {
    if (question.has_correct_answer) {
      totalPoints += question.points
      const userAnswer = answers[question.id.toString()]

      if (question.type === 'short-answer') {
        if (userAnswer?.toLowerCase().trim() === question.correct_answer?.toLowerCase()) {
          score += question.points
        }
      } else if (question.type === 'multiple-choice-multiple') {
        // For multiple choice multiple, both user answer and correct answer are comma-separated strings
        if (userAnswer && question.correct_answer) {
          const userSelections = userAnswer.split(',').sort()
          const correctSelections = question.correct_answer.split(',').sort()
          if (userSelections.length === correctSelections.length && 
              userSelections.every((val, index) => val === correctSelections[index])) {
            score += question.points
          }
        }
      } else {
        if (userAnswer === question.correct_answer) {
          score += question.points
        }
      }
    }
  })

  const insertSubmission = db.prepare(`
    INSERT INTO submissions (quiz_id, student_name, student_email, answers, score, total_points) 
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  insertSubmission.run(quizId, studentName, studentEmail, JSON.stringify(answers), score, totalPoints)
}

export interface Submission {
  id: number
  quiz_id: string
  student_name: string
  student_email: string
  answers: string
  score: number
  total_points: number
  submitted_at: string
}

export const getAllSubmissions = (): Submission[] => {
  const submissions = db.prepare('SELECT * FROM submissions ORDER BY submitted_at DESC').all() as Submission[]
  return submissions
}

export const getSubmissionsByQuizId = (quizId: string): Submission[] => {
  const submissions = db.prepare('SELECT * FROM submissions WHERE quiz_id = ? ORDER BY submitted_at DESC').all(quizId) as Submission[]
  return submissions
}

export default db 