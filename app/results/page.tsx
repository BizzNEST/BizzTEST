"use client"

import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import QuizResults from "../../quiz-results"

export default function ResultsPage() {
  const { isAuthenticated, requireAuth } = useAuth()
  
  requireAuth()

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render the component if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  return <QuizResults />
}
