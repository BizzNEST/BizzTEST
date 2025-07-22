"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, ChevronRight, Search, Download, BarChart3, Users } from "lucide-react"

// Types
interface QuizSubmission {
  id: string
  quizName: string
  studentName: string
  studentEmail: string
  submittedAt: string
  completionTime: string
  score: {
    earned: number
    total: number
    percentage: number
  }
  answers: Answer[]
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

// Mock data
const mockSubmissions: QuizSubmission[] = [
  {
    id: "sub-001",
    quizName: "Introduction to Web Development",
    studentName: "Alex Johnson",
    studentEmail: "alex.j@example.com",
    submittedAt: "2025-07-21T14:30:00Z",
    completionTime: "12m 45s",
    score: {
      earned: 8,
      total: 10,
      percentage: 80,
    },
    answers: [
      {
        questionId: "q1",
        questionText: "What is HTML?",
        questionType: "multiple-choice",
        studentAnswer: "1",
        correctAnswer: "1",
        isCorrect: true,
        points: 2,
        earnedPoints: 2,
        options: ["A programming language", "HyperText Markup Language", "A database system", "A styling language"],
        hasCorrectAnswer: true,
      },
      {
        questionId: "q2",
        questionText: "CSS is used for styling web pages.",
        questionType: "true-false",
        studentAnswer: "true",
        correctAnswer: "true",
        isCorrect: true,
        points: 1,
        earnedPoints: 1,
        hasCorrectAnswer: true,
      },
      {
        questionId: "q3",
        questionText: "What does API stand for?",
        questionType: "short-answer",
        studentAnswer: "Application Programming Interface",
        correctAnswer: "Application Programming Interface",
        isCorrect: true,
        points: 2,
        earnedPoints: 2,
        hasCorrectAnswer: true,
      },
      {
        questionId: "q4",
        questionText: "Which framework do you prefer for frontend development?",
        questionType: "multiple-choice",
        studentAnswer: "0",
        options: ["React", "Vue", "Angular", "Svelte", "Other"],
        points: 1,
        earnedPoints: 1,
        hasCorrectAnswer: false,
      },
      {
        questionId: "q5",
        questionText: "JavaScript is the same as Java.",
        questionType: "true-false",
        studentAnswer: "false",
        correctAnswer: "false",
        isCorrect: true,
        points: 2,
        earnedPoints: 2,
        hasCorrectAnswer: true,
      },
      {
        questionId: "q6",
        questionText: "Describe your experience with web development.",
        questionType: "short-answer",
        studentAnswer:
          "I've been learning web development for about 6 months now. I'm comfortable with HTML, CSS, and basic JavaScript.",
        points: 2,
        earnedPoints: 0,
        hasCorrectAnswer: false,
      },
    ],
  },
  {
    id: "sub-002",
    quizName: "Introduction to Web Development",
    studentName: "Taylor Smith",
    studentEmail: "taylor.smith@example.com",
    submittedAt: "2025-07-21T15:45:00Z",
    completionTime: "9m 12s",
    score: {
      earned: 5,
      total: 10,
      percentage: 50,
    },
    answers: [
      {
        questionId: "q1",
        questionText: "What is HTML?",
        questionType: "multiple-choice",
        studentAnswer: "0",
        correctAnswer: "1",
        isCorrect: false,
        points: 2,
        earnedPoints: 0,
        options: ["A programming language", "HyperText Markup Language", "A database system", "A styling language"],
        hasCorrectAnswer: true,
      },
      {
        questionId: "q2",
        questionText: "CSS is used for styling web pages.",
        questionType: "true-false",
        studentAnswer: "true",
        correctAnswer: "true",
        isCorrect: true,
        points: 1,
        earnedPoints: 1,
        hasCorrectAnswer: true,
      },
      {
        questionId: "q3",
        questionText: "What does API stand for?",
        questionType: "short-answer",
        studentAnswer: "Application Protocol Interface",
        correctAnswer: "Application Programming Interface",
        isCorrect: false,
        points: 2,
        earnedPoints: 0,
        hasCorrectAnswer: true,
      },
      {
        questionId: "q4",
        questionText: "Which framework do you prefer for frontend development?",
        questionType: "multiple-choice",
        studentAnswer: "2",
        options: ["React", "Vue", "Angular", "Svelte", "Other"],
        points: 1,
        earnedPoints: 1,
        hasCorrectAnswer: false,
      },
      {
        questionId: "q5",
        questionText: "JavaScript is the same as Java.",
        questionType: "true-false",
        studentAnswer: "false",
        correctAnswer: "false",
        isCorrect: true,
        points: 2,
        earnedPoints: 2,
        hasCorrectAnswer: true,
      },
      {
        questionId: "q6",
        questionText: "Describe your experience with web development.",
        questionType: "short-answer",
        studentAnswer: "I'm just starting to learn web development. I've completed a few online tutorials.",
        points: 2,
        earnedPoints: 1,
        hasCorrectAnswer: false,
      },
    ],
  },
  {
    id: "sub-003",
    quizName: "Introduction to Web Development",
    studentName: "Jordan Lee",
    studentEmail: "jordan.lee@example.com",
    submittedAt: "2025-07-22T09:15:00Z",
    completionTime: "15m 30s",
    score: {
      earned: 10,
      total: 10,
      percentage: 100,
    },
    answers: [
      {
        questionId: "q1",
        questionText: "What is HTML?",
        questionType: "multiple-choice",
        studentAnswer: "1",
        correctAnswer: "1",
        isCorrect: true,
        points: 2,
        earnedPoints: 2,
        options: ["A programming language", "HyperText Markup Language", "A database system", "A styling language"],
        hasCorrectAnswer: true,
      },
      {
        questionId: "q2",
        questionText: "CSS is used for styling web pages.",
        questionType: "true-false",
        studentAnswer: "true",
        correctAnswer: "true",
        isCorrect: true,
        points: 1,
        earnedPoints: 1,
        hasCorrectAnswer: true,
      },
      {
        questionId: "q3",
        questionText: "What does API stand for?",
        questionType: "short-answer",
        studentAnswer: "Application Programming Interface",
        correctAnswer: "Application Programming Interface",
        isCorrect: true,
        points: 2,
        earnedPoints: 2,
        hasCorrectAnswer: true,
      },
      {
        questionId: "q4",
        questionText: "Which framework do you prefer for frontend development?",
        questionType: "multiple-choice",
        studentAnswer: "0",
        options: ["React", "Vue", "Angular", "Svelte", "Other"],
        points: 1,
        earnedPoints: 1,
        hasCorrectAnswer: false,
      },
      {
        questionId: "q5",
        questionText: "JavaScript is the same as Java.",
        questionType: "true-false",
        studentAnswer: "false",
        correctAnswer: "false",
        isCorrect: true,
        points: 2,
        earnedPoints: 2,
        hasCorrectAnswer: true,
      },
      {
        questionId: "q6",
        questionText: "Describe your experience with web development.",
        questionType: "short-answer",
        studentAnswer: "I've been working as a frontend developer for 2 years, primarily with React and TypeScript.",
        points: 2,
        earnedPoints: 2,
        hasCorrectAnswer: false,
      },
    ],
  },
]

export default function QuizResults() {
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null)

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

  if (selectedSubmission) {
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
                <p className="text-sm text-muted-foreground">Completion Time: {selectedSubmission.completionTime}</p>
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
                    {selectedSubmission.answers.filter((a) => a.hasCorrectAnswer && a.isCorrect).length}/
                    {selectedSubmission.answers.filter((a) => a.hasCorrectAnswer).length} correct answers
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
              {selectedSubmission.answers.map((answer, index) => (
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Student Answer:</p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                        {answer.questionType === "multiple-choice" && answer.options ? (
                          answer.options[Number.parseInt(answer.studentAnswer)]
                        ) : answer.questionType === "true-false" ? (
                          answer.studentAnswer
                        ) : (
                          <p className="whitespace-pre-wrap">{answer.studentAnswer}</p>
                        )}
                      </div>
                    </div>

                    {answer.hasCorrectAnswer && (
                      <div>
                        <p className="text-sm font-medium mb-1 text-green-700">Correct Answer:</p>
                        <div className="bg-green-50 p-3 rounded-md text-sm">
                          {answer.questionType === "multiple-choice" && answer.options ? (
                            answer.options[Number.parseInt(answer.correctAnswer!)]
                          ) : answer.questionType === "true-false" ? (
                            answer.correctAnswer
                          ) : (
                            <p className="whitespace-pre-wrap">{answer.correctAnswer}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!answer.hasCorrectAnswer && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Instructor Feedback:</p>
                      <div className="bg-blue-50 p-3 rounded-md text-sm flex items-center justify-between">
                        <p>
                          {answer.earnedPoints === answer.points
                            ? "Full points awarded"
                            : answer.earnedPoints > 0
                              ? "Partial points awarded"
                              : "No points awarded"}
                        </p>
                        <Badge variant="outline">
                          {answer.earnedPoints}/{answer.points} pts
                        </Badge>
                      </div>
                    </div>
                  )}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{mockSubmissions.length}</div>
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
                {Math.round(
                  mockSubmissions.reduce((acc, sub) => acc + sub.score.percentage, 0) / mockSubmissions.length,
                )}
                %
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
                {mockSubmissions.filter((sub) => sub.score.percentage === 100).length}
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
              <CardDescription>View all student submissions for "Introduction to Web Development"</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSubmissions.map((submission) => (
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
                          <p className="text-sm text-muted-foreground">Submitted</p>
                          <p className="font-medium">{formatDate(submission.submittedAt)}</p>
                          <p className="text-sm text-muted-foreground">Completion time: {submission.completionTime}</p>
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
                            {submission.answers.filter((a) => a.hasCorrectAnswer && a.isCorrect).length}/
                            {submission.answers.filter((a) => a.hasCorrectAnswer).length} correct answers
                          </p>
                        </div>

                        <div className="p-4 flex items-center justify-end">
                          <Button onClick={() => setSelectedSubmission(submission)}>View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">Showing 3 of 3 submissions</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
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
    </div>
  )
}
