"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, ChevronRight, Search, Download, BarChart3, Users, Loader2 } from "lucide-react"

// Types
interface QuizSubmission {
  id: string
  quizId: string
  quizName: string
  studentName: string
  studentEmail: string
  submittedAt: string
  score: {
    earned: number
    total: number
    percentage: number
  }
  answers: Record<string, string>
  quiz: any
}

interface Answer {
  questionId: string
  questionText: string
  questionType: "multiple-choice" | "true-false" | "short-answer"
  studentAnswer: string
  correctAnswer?: string
  isCorrect?: boolean
  points: number
  earnedPoints: number
  options?: string[]
  hasCorrectAnswer: boolean
}

export default function QuizResults() {
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null)
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/submissions')
        if (!response.ok) {
          throw new Error('Failed to fetch submissions')
        }
        const data = await response.json()
        setSubmissions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load submissions')
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-blue-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800"
    if (percentage >= 70) return "bg-blue-100 text-blue-800"
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getAnswersForDisplay = (submission: QuizSubmission): Answer[] => {
    if (!submission.quiz || !submission.quiz.questions) return []
    
    return submission.quiz.questions.map((question: any, index: number) => {
      const userAnswer = submission.answers[question.id.toString()] || ""
      let isCorrect = false
      
      if (question.has_correct_answer) {
        if (question.type === 'short-answer') {
          isCorrect = userAnswer.toLowerCase().trim() === question.correct_answer?.toLowerCase()
        } else {
          isCorrect = userAnswer === question.correct_answer
        }
      }

      return {
        questionId: question.id.toString(),
        questionText: question.question,
        questionType: question.type,
        studentAnswer: userAnswer,
        correctAnswer: question.correct_answer,
        isCorrect,
        points: question.points,
        earnedPoints: question.has_correct_answer && isCorrect ? question.points : 0,
        options: question.options,
        hasCorrectAnswer: question.has_correct_answer
      }
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (selectedSubmission) {
    const answersForDisplay = getAnswersForDisplay(selectedSubmission)
    
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setSelectedSubmission(null)} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Results
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Results
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Student</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{getInitials(selectedSubmission.studentName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedSubmission.studentName}</p>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.studentEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quiz Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{selectedSubmission.quizName}</p>
                <p className="text-sm text-muted-foreground">Submitted: {formatDate(selectedSubmission.submittedAt)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">
                    {selectedSubmission.score.earned}/{selectedSubmission.score.total} points
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {answersForDisplay.filter((a) => a.hasCorrectAnswer && a.isCorrect).length}/
                    {answersForDisplay.filter((a) => a.hasCorrectAnswer).length} correct answers
                  </p>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(selectedSubmission.score.percentage)}`}>
                  {selectedSubmission.score.percentage}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Responses</CardTitle>
            <CardDescription>Detailed breakdown of student responses for each question</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {answersForDisplay.map((answer, index) => (
                <div key={answer.questionId} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Q{index + 1}</Badge>
                      <h3 className="font-medium">{answer.questionText}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{answer.points} pts</Badge>
                      {answer.hasCorrectAnswer ? (
                        answer.isCorrect ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" /> Correct
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" /> Incorrect
                          </Badge>
                        )
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Clock className="h-3 w-3 mr-1" /> Open-ended
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {answer.questionType === "multiple-choice" && answer.options && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Options:</p>
                        <div className="space-y-1">
                          {answer.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-2 rounded text-sm ${
                                answer.studentAnswer === optionIndex.toString()
                                  ? answer.hasCorrectAnswer && answer.isCorrect
                                    ? "bg-green-50 border border-green-200"
                                    : answer.hasCorrectAnswer
                                    ? "bg-red-50 border border-red-200"
                                    : "bg-blue-50 border border-blue-200"
                                  : answer.correctAnswer === optionIndex.toString() && answer.hasCorrectAnswer
                                  ? "bg-green-50 border border-green-200"
                                  : "bg-gray-50"
                              }`}
                            >
                              <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                              {answer.studentAnswer === optionIndex.toString() && (
                                <span className="ml-2 text-xs font-medium">Your answer</span>
                              )}
                              {answer.correctAnswer === optionIndex.toString() && answer.hasCorrectAnswer && (
                                <span className="ml-2 text-xs font-medium text-green-600">Correct answer</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(answer.questionType === "true-false" || answer.questionType === "short-answer") && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Your answer:</p>
                        <p className="text-sm bg-gray-50 p-2 rounded">
                          {answer.studentAnswer || "No answer provided"}
                        </p>
                        {answer.hasCorrectAnswer && answer.correctAnswer && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-muted-foreground">Correct answer:</p>
                            <p className="text-sm bg-green-50 p-2 rounded text-green-800">{answer.correctAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quiz Results</h1>
          <p className="text-muted-foreground">View and analyze student quiz submissions</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search submissions..."
              className="pl-8 h-10 w-full sm:w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No quiz submissions found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{submissions.length}</div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-blue-600">
                    {submissions.length > 0 
                      ? Math.round(submissions.reduce((acc, sub) => acc + sub.score.percentage, 0) / submissions.length)
                      : 0
                    }%
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Perfect Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-green-600">
                    {submissions.filter((sub) => sub.score.percentage === 100).length}
                  </div>
                  <CheckCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Submissions</TabsTrigger>
                <TabsTrigger value="graded">Graded</TabsTrigger>
                <TabsTrigger value="needs-review">Needs Review</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Submissions</CardTitle>
                  <CardDescription>View all student submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissions.map((submission) => {
                      const answersForDisplay = getAnswersForDisplay(submission)
                      return (
                        <Card key={submission.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
                              <div className="p-4 flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{getInitials(submission.studentName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{submission.studentName}</p>
                                  <p className="text-sm text-muted-foreground">{submission.studentEmail}</p>
                                </div>
                              </div>

                              <div className="p-4">
                                <p className="text-sm text-muted-foreground">Quiz</p>
                                <p className="font-medium">{submission.quizName}</p>
                                <p className="text-sm text-muted-foreground">Submitted: {formatDate(submission.submittedAt)}</p>
                              </div>

                              <div className="p-4">
                                <p className="text-sm text-muted-foreground">Score</p>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">
                                    {submission.score.earned}/{submission.score.total} points
                                  </p>
                                  <Badge className={getScoreBadgeColor(submission.score.percentage)}>
                                    {submission.score.percentage}%
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {answersForDisplay.filter((a) => a.hasCorrectAnswer && a.isCorrect).length}/
                                  {answersForDisplay.filter((a) => a.hasCorrectAnswer).length} correct answers
                                </p>
                              </div>

                              <div className="p-4 flex items-center justify-end">
                                <Button onClick={() => setSelectedSubmission(submission)}>View Details</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <div className="text-sm text-muted-foreground">Showing {submissions.length} of {submissions.length} submissions</div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="graded" className="mt-4">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">All submissions have been automatically graded</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="needs-review" className="mt-4">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No submissions need manual review at this time</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
