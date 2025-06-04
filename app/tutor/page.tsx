"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TutorPage() {
  const { user, userRole, loading } = useAuth()
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    if (user?.email) {
      try {
        const response = await fetch(`/api/posts?userEmail=${encodeURIComponent(user.email)}&userRole=TUTOR`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }
  }

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
        <Button onClick={() => (window.location.href = "/auth/signin")}>Sign In</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tutor Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.email}</p>
        <p className="text-sm text-gray-500">Role: {userRole}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-gray-500">No student posts available yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <div key={post.id} className="border rounded p-4">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-gray-600 mt-2">{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">By: {post.author.name || post.author.email}</p>
                  <p className="text-sm text-gray-500">Posted: {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
