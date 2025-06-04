"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudentPage() {
  const { user, userRole, loading } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [posts, setPosts] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    location: "Dhaka, Bangladesh",
    phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user?.email,
          title: formData.title,
          content: formData.content,
          location: formData.location,
          phoneNumber: formData.phone,
          type: "TUITION",
          includePhone: true,
        }),
      })

      if (response.ok) {
        alert("Post created successfully!")
        setFormData({ title: "", content: "", location: "Dhaka, Bangladesh", phone: "" })
        setShowForm(false)
        fetchPosts()
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to create post")
    }
  }

  const fetchPosts = async () => {
    if (user?.email) {
      try {
        const response = await fetch(`/api/posts?userEmail=${encodeURIComponent(user.email)}&userRole=STUDENT`)
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
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading...</div>
      </div>
    )
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
        <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.email}</p>
        <p className="text-sm text-gray-500">Role: {userRole}</p>
      </div>

      {/* Simple Post Button */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create a Post</CardTitle>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              Post a Requirement
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What do you need help with?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01797859806"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Requirements</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Describe what you need help with..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Submit Post
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>My Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet. Create your first post above!</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <div key={post.id} className="border rounded p-4">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-gray-600 mt-2">{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">Posted: {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
