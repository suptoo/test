"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, RefreshCw, Database, Users } from "lucide-react"

interface DatabaseStatus {
  status: string
  database: string
  users?: number
  posts?: number
  error?: string
  timestamp: string
}

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Health check failed:", error)
      setStatus({
        status: "error",
        database: "disconnected",
        error: "Failed to connect",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setInitializing(true)
    try {
      const response = await fetch("/api/init-db", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        alert("Database initialized successfully!")
        checkHealth()
      } else {
        alert(`Initialization failed: ${data.error}`)
      }
    } catch (error) {
      console.error("Database initialization failed:", error)
      alert("Failed to initialize database")
    } finally {
      setInitializing(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Status</h1>
        <p className="text-gray-600">Monitor and manage your Luminory database</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Connection Status
            </CardTitle>
            <CardDescription>Current database connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              {status?.database === "connected" ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-medium ${status?.database === "connected" ? "text-green-700" : "text-red-700"}`}>
                {status?.database === "connected" ? "Connected" : "Disconnected"}
              </span>
            </div>

            {status?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{status.error}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={checkHealth} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <Button onClick={initializeDatabase} disabled={initializing} size="sm">
                {initializing ? "Initializing..." : "Initialize DB"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Database Statistics
            </CardTitle>
            <CardDescription>Current data in your database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="font-medium">{status?.users ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Posts</span>
                <span className="font-medium">{status?.posts ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="font-medium text-xs">
                  {status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {status?.database === "connected" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-green-700">✅ Database Ready</CardTitle>
            <CardDescription>Your database is connected and ready to use. You can now:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Students can create posts for tuition and assignment help</li>
              <li>• Tutors can browse posts and purchase coins to view content</li>
              <li>• Admin can manage users and monitor the platform</li>
              <li>• Phone verification system is active</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
