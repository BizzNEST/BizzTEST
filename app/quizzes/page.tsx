"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Copy, ExternalLink, Plus, BookOpen, Loader2, CheckCircle, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface Quiz {
  id: string
  title: string
  description: string
  created_at: string
}

export default function QuizzesPage() {
  const { isAuthenticated } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/quizzes')
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes')
        }
        const data = await response.json()
        setQuizzes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quizzes')
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  const handleShareQuiz = async (quizId: string) => {
    const quizUrl = `${window.location.origin}/quiz/${quizId}`
    
    try {
      await navigator.clipboard.writeText(quizUrl)
      setCopiedId(quizId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const handleDeleteQuiz = async () => {
    if (!deleteQuizId) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/quiz/${deleteQuizId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete quiz')
      }

      // Remove the quiz from the local state
      setQuizzes(prev => prev.filter(quiz => quiz.id !== deleteQuizId))
      setDeleteQuizId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quiz')
    } finally {
      setDeleting(false)
    }
  }

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Quizzes</h1>
          <p className="text-muted-foreground">Browse available quizzes{isAuthenticated ? ' and manage your creations' : ''}</p>
        </div>
        {isAuthenticated && (
          <Link href="/create-quiz">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Quiz
            </Button>
          </Link>
        )}
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quizzes yet</h3>
            <p className="text-muted-foreground mb-4">
              {isAuthenticated ? "Create your first quiz to get started" : "Come back later when quizzes are available!"}
            </p>
            {isAuthenticated && (
              <Link href="/create-quiz">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {quiz.description || "No description provided"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="outline" className="text-xs">
                    Created {formatDate(quiz.created_at)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="space-y-2">
                  <Link href={`/quiz/${quiz.id}`} className="w-full">
                    <Button className="w-full" variant="default">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Take Quiz
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleShareQuiz(quiz.id)}
                  >
                    {copiedId === quiz.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Share Quiz
                      </>
                    )}
                  </Button>
                  {isAuthenticated && (
                    <div className="flex gap-2">
                      <Link href={`/edit-quiz/${quiz.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteQuizId(quiz.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteQuizId} onOpenChange={() => setDeleteQuizId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quiz? This action cannot be undone and will also delete all associated submissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuiz}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Quiz"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 