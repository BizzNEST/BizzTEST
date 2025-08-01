"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Plus, BarChart3, List, LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BizzTEST</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/quizzes">
              <Button variant="ghost">
                <List className="h-4 w-4 mr-2" />
                All Quizzes
              </Button>
            </Link>

            {isAuthenticated && (
              <>
                <Link href="/create-quiz">
                  <Button variant="ghost">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Quiz
                  </Button>
                </Link>
                <Link href="/results">
                  <Button variant="ghost">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <Button onClick={logout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button>
                  <LogIn className="h-4 w-4 mr-2" />
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
