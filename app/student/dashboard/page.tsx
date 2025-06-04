"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

interface Post {
  id: string
  title: string
  content: string
  location: string
  phoneNumber?: string
  budget?: string
  createdAt: string
  status: string
}

export default function StudentDashboardPage() {
  const { user, userRole, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("my-posts")
  const [posts, setPosts] = useState<Post[]>([])
  const [showPostForm, setShowPostForm] = useState(false)
  const [formData, setFormData] = useState({
    location: "Dhaka, Bangladesh",
    phone: "",
    requirements: "",
    budget: "",
    timeframe: "",
  })

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?userEmail=${encodeURIComponent(user?.email || "")}&userRole=STUDENT`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const handleSubmitRequirement = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user?.email,
          title: `Tutor needed in ${formData.location}`,
          content: formData.requirements,
          location: formData.location,
          phoneNumber: formData.phone,
          budget: formData.budget,
          type: "TUITION",
          includePhone: true,
        }),
      })

      if (response.ok) {
        setFormData({
          location: "Dhaka, Bangladesh",
          phone: "",
          requirements: "",
          budget: "",
          timeframe: "",
        })
        setShowPostForm(false)
        fetchPosts()
        alert("Requirement posted successfully!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to post requirement")
      }
    } catch (error) {
      console.error("Error posting requirement:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (!user || userRole !== "STUDENT") {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-4">You need to be signed in as a student to access this page.</p>
        <Button onClick={() => (window.location.href = "/auth/signin")}>Sign In</Button>
      </div>
    )
  }

  if (showPostForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="text-xl font-semibold text-gray-800">Luminory</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user.displayName || user.email}</span>
                <Button variant="outline" onClick={() => setShowPostForm(false)}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Requirement Form */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">Request a tutor</h1>

            <form onSubmit={handleSubmitRequirement} className="space-y-6">
              {/* Location */}
              <div className="grid grid-cols-4 gap-4 items-center">
                <label className="text-right font-medium text-gray-700">Location</label>
                <div className="col-span-3">
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-green-50 border-green-200"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-4 gap-4 items-center">
                <label className="text-right font-medium text-gray-700">Phone</label>
                <div className="col-span-3 flex gap-2">
                  <div className="bg-gray-100 px-3 py-2 rounded border text-gray-600 text-sm">BD +880</div>
                  <Input
                    type="tel"
                    placeholder="01797859806"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-4 gap-4 items-start">
                <label className="text-right font-medium text-gray-700 pt-2">Details of your requirement</label>
                <div className="col-span-3 relative">
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 max-w-xs">
                      <div className="font-semibold mb-1">Things you may write:</div>
                      <div>Required experience,</div>
                      <div>Expectations from the expert,</div>
                      <div>Budget, time, Task details</div>
                      <div className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Please don't share any contact details (phone number, email, WhatsApp etc) here"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={12}
                    className="resize-none"
                    required
                  />
                  <div className="text-red-500 text-sm mt-1">
                    Please don't share any contact details (phone number, email, WhatsApp etc) here
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="grid grid-cols-4 gap-4">
                <div></div>
                <div className="col-span-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
                    Continue
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">Luminory</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.displayName || user.email}</span>
              <Button
                onClick={() => setShowPostForm(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2"
              >
                Post Requirement
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("my-posts")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "my-posts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              My Posts
            </button>
            <button
              onClick={() => setActiveTab("find-tutors")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "find-tutors"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Find Tutors ▼
            </button>
            <button
              onClick={() => setActiveTab("wallet")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "wallet"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Wallet ▼
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "my-posts" && (
          <div className="text-center py-16">
            {posts.length === 0 ? (
              <>
                <h2 className="text-xl text-gray-600 mb-8">You haven't posted any requirements yet.</h2>
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowPostForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    Post a requirement
                  </Button>
                  <div className="text-gray-500">or</div>
                  <Button
                    onClick={() => setActiveTab("find-tutors")}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
                  >
                    Find teachers
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">My Requirements</h2>
                  <Button onClick={() => setShowPostForm(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
                    Post New Requirement
                  </Button>
                </div>
                <div className="grid gap-4">
                  {posts.map((post) => (
                    <Card key={post.id} className="text-left">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">{post.title}</h3>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Active
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{post.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>📍 {post.location}</span>
                          <span>Posted on {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "find-tutors" && (
          <div className="text-center py-16">
            <h2 className="text-xl text-gray-600 mb-4">Find Tutors</h2>
            <p className="text-gray-500">Browse available tutors in your area</p>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="text-center py-16">
            <h2 className="text-xl text-gray-600 mb-4">Wallet</h2>
            <p className="text-gray-500">Manage your payments and transactions</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="text-center py-16">
            <h2 className="text-xl text-gray-600 mb-4">Reviews</h2>
            <p className="text-gray-500">View and manage your reviews</p>
          </div>
        )}
      </div>
    </div>
  )
}
