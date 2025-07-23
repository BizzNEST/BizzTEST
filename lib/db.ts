import sqlite3 from 'sqlite3'
import path from 'path'
import { promisify } from 'util'

// Enable verbose mode for debugging
const Database = sqlite3.verbose().Database

// Create database connection
const dbPath = path.join(process.cwd(), 'database.db')
const db = new Database(dbPath)

// Promisify database methods for easier async/await usage
const dbRun = promisify(db.run.bind(db)) as (sql: string, params?: any[]) => Promise<void>
const dbGet = promisify(db.get.bind(db)) as (sql: string, params?: any[]) => Promise<any>
const dbAll = promisify(db.all.bind(db)) as (sql: string, params?: any[]) => Promise<any[]>

// Function to generate random quiz ID
const generateQuizId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Initialize database tables
const initializeDatabase = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await dbRun(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('multiple-choice-single', 'multiple-choice-multiple', 'true-false', 'short-answer', 'file-upload')),
      question TEXT NOT NULL,
      options TEXT, -- JSON string for multiple choice options
      correct_answer TEXT,
      points INTEGER DEFAULT 1,
      has_correct_answer BOOLEAN DEFAULT 1,
      FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
    )
  `)

  await dbRun(`
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
    )
  `)
}

// Initialize database on module load
initializeDatabase().catch(console.error)

export interface Quiz {
  id: string
  title: string
  description: string
  created_at: string
}

export interface Question {
  id: number
  quiz_id: string
  type: 'multiple-choice-single' | 'multiple-choice-multiple' | 'true-false' | 'short-answer' | 'file-upload'
  question: string
  options?: string[]
  correct_answer?: string
  points: number
  has_correct_answer: boolean
}

interface RawQuestion {
  id: number
  quiz_id: string
  type: 'multiple-choice-single' | 'multiple-choice-multiple' | 'true-false' | 'short-answer' | 'file-upload'
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
export const getQuizById = async (id: string): Promise<QuizWithQuestions | null> => {
  const quiz = await dbGet('SELECT * FROM quizzes WHERE id = ?', [id]) as Quiz | undefined
  if (!quiz) return null

  const questions = await dbAll('SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_index', [id]) as RawQuestion[]
  
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

export const createQuiz = async (title: string, description: string, questions: Omit<Question, 'id' | 'quiz_id'>[]): Promise<string> => {
  const quizId = generateQuizId()
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      
      db.run('INSERT INTO quizzes (id, title, description) VALUES (?, ?, ?)', [quizId, title, description], function(err) {
        if (err) {
          db.run('ROLLBACK')
          reject(err)
          return
        }

        if (questions.length === 0) {
          db.run('COMMIT')
          resolve(quizId)
          return
        }

        // Insert questions sequentially to maintain order
        const insertQuestion = (index: number) => {
          if (index >= questions.length) {
            db.run('COMMIT')
            resolve(quizId)
            return
          }

          const question = questions[index]
          db.run(`
            INSERT INTO questions (quiz_id, order_index, type, question, options, correct_answer, points, has_correct_answer) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            quizId,
            index,
            question.type,
            question.question,
            question.options ? JSON.stringify(question.options) : null,
            question.correct_answer,
            question.points,
            question.has_correct_answer ? 1 : 0
          ], function(err) {
            if (err) {
              db.run('ROLLBACK')
              reject(err)
              return
            }

            // Insert next question
            insertQuestion(index + 1)
          })
        }

        // Start inserting from the first question
        insertQuestion(0)
      })
    })
  })
}

export const submitQuizAnswers = async (quizId: string, studentName: string, studentEmail: string, answers: Record<string, string>): Promise<void> => {
  const quiz = await getQuizById(quizId)
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

  await dbRun(`
    INSERT INTO submissions (quiz_id, student_name, student_email, answers, score, total_points) 
    VALUES (?, ?, ?, ?, ?, ?)
  `, [quizId, studentName, studentEmail, JSON.stringify(answers), score, totalPoints])
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

export const getAllSubmissions = async (): Promise<Submission[]> => {
  const submissions = await dbAll('SELECT * FROM submissions ORDER BY submitted_at DESC') as Submission[]
  return submissions
}

export const getSubmissionsByQuizId = async (quizId: string): Promise<Submission[]> => {
  const submissions = await dbAll('SELECT * FROM submissions WHERE quiz_id = ? ORDER BY submitted_at DESC', [quizId]) as Submission[]
  return submissions
}

export const updateQuiz = async (id: string, title: string, description: string, questions: Omit<Question, 'id' | 'quiz_id'>[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      
      db.run('UPDATE quizzes SET title = ?, description = ? WHERE id = ?', [title, description, id], function(err) {
        if (err) {
          db.run('ROLLBACK')
          reject(err)
          return
        }

        db.run('DELETE FROM questions WHERE quiz_id = ?', [id], function(err) {
          if (err) {
            db.run('ROLLBACK')
            reject(err)
            return
          }

          if (questions.length === 0) {
            db.run('COMMIT')
            resolve()
            return
          }

          // Insert questions sequentially to maintain order
          const insertQuestion = (index: number) => {
            if (index >= questions.length) {
              db.run('COMMIT')
              resolve()
              return
            }

            const question = questions[index]
            db.run(`
              INSERT INTO questions (quiz_id, order_index, type, question, options, correct_answer, points, has_correct_answer) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              id,
              index,
              question.type,
              question.question,
              question.options ? JSON.stringify(question.options) : null,
              question.correct_answer,
              question.points,
              question.has_correct_answer ? 1 : 0
            ], function(err) {
              if (err) {
                db.run('ROLLBACK')
                reject(err)
                return
              }

              // Insert next question
              insertQuestion(index + 1)
            })
          }

          // Start inserting from the first question
          insertQuestion(0)
        })
      })
    })
  })
}

export const deleteQuiz = async (id: string): Promise<void> => {
  await dbRun('DELETE FROM quizzes WHERE id = ?', [id])
}

export default db 