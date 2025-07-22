"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("authenticated")
      setIsAuthenticated(auth === "true")
    }

    checkAuth()
    
    // Listen for storage changes (in case user logs out in another tab)
    window.addEventListener("storage", checkAuth)
    
    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const login = () => {
    localStorage.setItem("authenticated", "true")
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("authenticated")
    setIsAuthenticated(false)
    router.push("/login")
  }

  const requireAuth = (redirectTo = "/login") => {
    useEffect(() => {
      if (isAuthenticated === false) {
        router.push(redirectTo)
      }
    }, [isAuthenticated, redirectTo])
  }

  return {
    isAuthenticated,
    login,
    logout,
    requireAuth
  }
} 