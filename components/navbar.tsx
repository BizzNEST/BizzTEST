"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Plus, BarChart3 } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">QuizMaster</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </Link>
            <Link href="/test-quiz">
              <Button variant="ghost">Take Test Quiz</Button>
            </Link>
            <Link href="/results">
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Results
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
