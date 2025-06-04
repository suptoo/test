"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "STUDENT" | "TUTOR" | "ADMIN"
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-4">You need to be signed in to access this page.</p>
        <Button onClick={() => (window.location.href = "/auth/signin")}>Sign In</Button>
      </div>
    )
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          You need to be signed in as a {requiredRole.toLowerCase()} to access this page.
        </p>
        <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
      </div>
    )
  }

  return <>{children}</>
}
