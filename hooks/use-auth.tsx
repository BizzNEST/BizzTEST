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

    // Initial check
    checkAuth()
    
    // Listen for storage changes (in case user logs out in another tab)
    window.addEventListener("storage", checkAuth)
    
    // Listen for custom auth events (for same-tab updates)
    window.addEventListener("auth-change", checkAuth)
    
    return () => {
      window.removeEventListener("storage", checkAuth)
      window.removeEventListener("auth-change", checkAuth)
    }
  }, [])

  const login = () => {
    localStorage.setItem("authenticated", "true")
    setIsAuthenticated(true)
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("auth-change"))
  }

  const logout = () => {
    localStorage.removeItem("authenticated")
    setIsAuthenticated(false)
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("auth-change"))
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