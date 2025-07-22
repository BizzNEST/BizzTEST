"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Award, Loader2 } from "lucide-react"

interface Question {
  id: number
  type: "multiple-choice" | "true-false" | "short-answer"
  question: string
  options?: string[]
  correct_answer?: string
  points: number
  has_correct_answer: boolean
}

interface Quiz {
  id: number
  title: string
  description: string
  questions: Question[]
}

export default function QuizPage() {
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${quizId}`)
        if (!response.ok) {
          throw new Error('Quiz not found')
        }
        const quizData = await response.json()
        setQuiz(quizData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      fetchQuiz()
    }
  }, [quizId])

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const calculateScore = () => {
    if (!quiz) return { correctAnswers: 0, totalGradableQuestions: 0, earnedPoints: 0, totalGradablePoints: 0, percentage: 0 }

    let correctAnswers = 0
    let totalGradablePoints = 0
    let earnedPoints = 0

    quiz.questions.forEach((question) => {
      if (question.has_correct_answer) {
        totalGradablePoints += question.points
        const userAnswer = answers[question.id.toString()]

        if (question.type === "short-answer") {
          if (userAnswer?.toLowerCase().trim() === question.correct_answer?.toLowerCase()) {
            correctAnswers++
            earnedPoints += question.points
          }
        } else {
          if (userAnswer === question.correct_answer) {
            correctAnswers++
            earnedPoints += question.points
          }
        }
      }
    })

    return {
      correctAnswers,
      totalGradableQuestions: quiz.questions.filter((q) => q.has_correct_answer).length,
      earnedPoints,
      totalGradablePoints,
      percentage: totalGradablePoints > 0 ? Math.round((earnedPoints / totalGradablePoints) * 100) : 0,
    }
  }

  const handleSubmit = async () => {
    if (!quiz) return

    const unansweredQuestions = quiz.questions.filter((q) => !isAnswered(q.id.toString()))

    if (unansweredQuestions.length > 0) {
      setShowWarning(true)
      return
    }

    await submitQuiz()
  }

  const submitQuiz = async () => {
    if (!quiz) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: 'Anonymous',
          studentEmail: '',
          answers: answers,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit quiz')
      }

      setSubmitted(true)
    } catch (err) {
      setError('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitAnyway = () => {
    setShowWarning(false)
    submitQuiz()
  }

  const isAnswered = (questionId: string) => {
    return answers[questionId] && answers[questionId].trim() !== ""
  }

  const getAnswerStatus = (question: Question) => {
    if (!question.has_correct_answer) return "open-ended"

    const userAnswer = answers[question.id.toString()]
    if (!userAnswer) return "unanswered"

    if (question.type === "short-answer") {
      return userAnswer.toLowerCase().trim() === question.correct_answer?.toLowerCase() ? "correct" : "incorrect"
    }

    return userAnswer === question.correct_answer ? "correct" : "incorrect"
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Error</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Quiz not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    const score = calculateScore()

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Award className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            <CardDescription>Here are your results for "{quiz.title}"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {score.correctAnswers}/{score.totalGradableQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {score.earnedPoints}/{score.totalGradablePoints}
                </div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">{score.percentage}%</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Review Your Answers</h2>
          {quiz.questions.map((question, index) => {
            const status = getAnswerStatus(question)
            const userAnswer = answers[question.id.toString()] || "No answer provided"

            return (
              <Card key={question.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{question.points} pts</Badge>
                      {status === "correct" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {status === "incorrect" && <XCircle className="h-5 w-5 text-red-500" />}
                      {status === "open-ended" && <Clock className="h-5 w-5 text-blue-500" />}
                    </div>
                  </div>
                  <p className="text-base font-normal">{question.question}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Your Answer:</Label>
                    <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                      {question.type === "multiple-choice" && question.options
                        ? question.options[Number.parseInt(userAnswer)] || userAnswer
                        : userAnswer}
                    </p>
                  </div>

                  {question.has_correct_answer && (
                    <div>
                      <Label className="text-sm font-medium text-green-700">Correct Answer:</Label>
                      <p className="text-sm bg-green-50 p-2 rounded mt-1">
                        {question.type === "multiple-choice" && question.options
                          ? question.options[Number.parseInt(question.correct_answer!)]
                          : question.correct_answer}
                      </p>
                    </div>
                  )}

                  {!question.has_correct_answer && (
                    <p className="text-sm text-blue-600 italic">
                      This is an open-ended question - no automatic grading applied.
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Button onClick={() => window.location.reload()} size="lg">
            Take Quiz Again
          </Button>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Badge>
        </div>
        {quiz.description && (
          <p className="text-muted-foreground mb-4">{quiz.description}</p>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{question.points} points</Badge>
              {!question.has_correct_answer && <Badge variant="secondary">Open-ended</Badge>}
            </div>
          </div>
          <CardDescription className="text-base text-foreground">{question.question}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === "multiple-choice" && (
            <RadioGroup
              value={answers[question.id.toString()] || ""}
              onValueChange={(value) => handleAnswerChange(question.id.toString(), value)}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "true-false" && (
            <RadioGroup
              value={answers[question.id.toString()] || ""}
              onValueChange={(value) => handleAnswerChange(question.id.toString(), value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="cursor-pointer">
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="cursor-pointer">
                  False
                </Label>
              </div>
            </RadioGroup>
          )}

          {question.type === "short-answer" && (
            <div>
              <Textarea
                placeholder="Enter your answer here..."
                value={answers[question.id.toString()] || ""}
                onChange={(e) => handleAnswerChange(question.id.toString(), e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button 
            onClick={handleSubmit} 
            className="bg-green-600 hover:bg-green-700"
            disabled={submitting}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={() => setCurrentQuestion((prev) => Math.min(quiz.questions.length - 1, prev + 1))}>
            Next
          </Button>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Progress Overview</h3>
        <div className="grid grid-cols-6 gap-2">
          {quiz.questions.map((_, index) => (
            <div
              key={index}
              className={`h-8 rounded flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                index === currentQuestion
                  ? "bg-blue-600 text-white"
                  : isAnswered(quiz.questions[index].id.toString())
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Click on a number to jump to that question</p>
      </div>

      {showWarning && (
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-orange-800">Incomplete Quiz</h3>
                <div className="mt-2 text-sm text-orange-700">
                  <p>
                    You have {quiz.questions.filter((q) => !isAnswered(q.id.toString())).length} unanswered questions. Are you sure
                    you want to submit?
                  </p>
                  <ul className="mt-2 list-disc list-inside">
                    {quiz.questions
                      .filter((q) => !isAnswered(q.id.toString()))
                      .map((q, index) => (
                        <li key={q.id}>Question {quiz.questions.indexOf(q) + 1}</li>
                      ))}
                  </ul>
                </div>
                <div className="mt-4 flex space-x-3">
                  <Button size="sm" variant="outline" onClick={() => setShowWarning(false)}>
                    Continue Answering
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSubmitAnyway} 
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Submit Anyway
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 