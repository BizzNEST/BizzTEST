"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, BookOpen, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Quiz Builder</h1>
        <p className="text-xl text-gray-600 mb-8">Create, share, and take quizzes easily</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create-quiz">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Create Quiz
            </Button>
          </Link>
          <Link href="/quizzes">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <BookOpen className="h-5 w-5 mr-2" />
              View All Quizzes
            </Button>
          </Link>
          <Link href="/results">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <BarChart3 className="h-5 w-5 mr-2" />
              View Results
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Create Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Build custom quizzes with multiple choice, true/false, and short answer questions. 
              Set point values and create both graded and open-ended questions.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Share & Take
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Share quiz links with others and take quizzes with automatic grading. 
              Results are saved and can be reviewed later.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Track Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              View detailed results and analytics for all quiz submissions. 
              See scores, individual answers, and overall performance.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
