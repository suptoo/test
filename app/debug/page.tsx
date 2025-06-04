"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const { user, userRole, loading } = useAuth()

  const testAPI = async () => {
    try {
      const response = await fetch("/api/status")
      const data = await response.json()
      console.log("API Status:", data)
      alert(`API Status: ${data.status}`)
    } catch (error) {
      console.error("API Error:", error)
      alert("API Error - check console")
    }
  }

  const testUserRole = async () => {
    if (user?.email) {
      try {
        const response = await fetch(`/api/user/role?email=${encodeURIComponent(user.email)}`)
        const data = await response.json()
        console.log("User Role Data:", data)
        alert(`User Role: ${JSON.stringify(data, null, 2)}`)
      } catch (error) {
        console.error("User Role Error:", error)
        alert("User Role Error - check console")
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Authentication Status:</h3>
            <p>Loading: {loading ? "Yes" : "No"}</p>
            <p>User: {user ? user.email : "Not logged in"}</p>
            <p>User Role: {userRole || "No role"}</p>
            <p>Display Name: {user?.displayName || "No display name"}</p>
          </div>

          <div className="space-x-2">
            <Button onClick={testAPI}>Test API</Button>
            <Button onClick={testUserRole}>Test User Role</Button>
          </div>

          <div>
            <h3 className="font-semibold">Current URL:</h3>
            <p>{typeof window !== "undefined" ? window.location.href : "Server side"}</p>
          </div>

          <div>
            <h3 className="font-semibold">Navigation Links:</h3>
            <div className="space-x-2">
              <Button onClick={() => (window.location.href = "/student/dashboard")}>Go to Student Dashboard</Button>
              <Button onClick={() => (window.location.href = "/tutor/dashboard")}>Go to Tutor Dashboard</Button>
              <Button onClick={() => (window.location.href = "/auth/signin")}>Go to Sign In</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
