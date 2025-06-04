"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, AlertCircle, Phone, BookOpen, FileText } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Post {
  id: string
  title: string
  content: string
  type: "TUITION" | "ASSIGNMENT"
  phoneNumber?: string
  createdAt: string
  views: any[]
}

export default function StudentDashboardPage() {
  const { user, userRole, loading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [showForm, setShowForm] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "TUITION" as "TUITION" | "ASSIGNMENT",
    includePhone: false,
  })

  useEffect(() => {
    if (user) {
      fetchPosts()
      checkPhoneVerification()
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

  const checkPhoneVerification = async () => {
    if (user?.email) {
      try {
        const response = await fetch(`/api/user/role?email=${encodeURIComponent(user.email)}`)
        if (response.ok) {
          const data = await response.json()
          setPhoneVerified(data.phoneVerified || false)
          if (data.phone) {
            setPhoneNumber(data.phone)
          }
        }
      } catch (error) {
        console.error("Error checking phone verification:", error)
        setPhoneVerified(false)
      }
    }
  }

  const validatePhoneNumber = (phone: string) => {
    if (phone.length !== 11) {
      setPhoneError("Phone number must be exactly 11 digits")
      return false
    }
    if (!/^\d+$/.test(phone)) {
      setPhoneError("Phone number must contain only digits")
      return false
    }
    setPhoneError("")
    return true
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePhoneNumber(phoneNumber)) {
      return
    }

    try {
      const response = await fetch("/api/update-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user?.email,
          phoneNumber,
        }),
      })

      if (response.ok) {
        setShowVerification(true)
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update phone number")
      }
    } catch (error) {
      console.error("Error updating phone:", error)
    }
  }

  const handleVerifyPhone = async () => {
    try {
      const response = await fetch("/api/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user?.email,
          verificationCode,
        }),
      })

      if (response.ok) {
        setPhoneVerified(true)
        setShowVerification(false)
        alert("Phone verified successfully!")
        checkPhoneVerification()
      } else {
        alert("Invalid verification code")
      }
    } catch (error) {
      console.error("Error verifying phone:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.includePhone && !phoneVerified) {
      alert("Please verify your phone number first to include it in your post")
      return
    }

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
          type: formData.type,
          includePhone: formData.includePhone,
        }),
      })

      if (response.ok) {
        setFormData({ title: "", content: "", type: "TUITION", includePhone: false })
        setShowForm(false)
        fetchPosts()
        alert("Post created successfully!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Post what you're looking for and connect with tutors</p>
      </div>

      {/* Phone Verification Section */}
      {!phoneVerified && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              Phone Verification (Optional)
            </CardTitle>
            <CardDescription className="text-orange-700">
              Verify your phone number to include it in your posts for direct contact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showVerification ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Enter 11-digit phone number"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value)
                        if (phoneError) validatePhoneNumber(e.target.value)
                      }}
                      className="pl-10"
                      maxLength={11}
                    />
                  </div>
                  {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                </div>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  Submit Phone Number
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-orange-700">
                  Enter the 6-digit verification code sent to your phone (use any 6 digits for demo):
                </p>
                <div className="flex space-x-2">
                  <Input
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                  <Button onClick={handleVerifyPhone} className="bg-orange-600 hover:bg-orange-700">
                    Verify
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Post Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Post What You're Looking For
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              {showForm ? "Cancel" : "New Post"}
            </Button>
          </CardTitle>
          <CardDescription>Create a post for tuition help or assignment assistance</CardDescription>
        </CardHeader>
        {showForm && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Post Type</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "TUITION" | "ASSIGNMENT" })}
                >
                  <option value="TUITION">Tuition Help</option>
                  <option value="ASSIGNMENT">Assignment Help</option>
                </select>
              </div>
              <div>
                <Input
                  placeholder="Post Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Describe what you're looking for in detail..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includePhone"
                  checked={formData.includePhone}
                  onChange={(e) => setFormData({ ...formData, includePhone: e.target.checked })}
                  disabled={!phoneVerified}
                />
                <label htmlFor="includePhone" className="text-sm">
                  Include my phone number in this post
                  {!phoneVerified && " (verify phone first)"}
                </label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Create Post</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* My Posts Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Posts</CardTitle>
          <CardDescription>View and manage your posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No posts yet. Create your first post above!</p>
              </div>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {post.type === "TUITION" ? (
                          <BookOpen className="w-5 h-5 text-blue-500" />
                        ) : (
                          <FileText className="w-5 h-5 text-green-500" />
                        )}
                        {post.title}
                      </CardTitle>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.type === "TUITION" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {post.type}
                      </span>
                    </div>
                    <CardDescription>Posted on {new Date(post.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views.length} tutor(s) viewed this post
                      </div>
                      {post.phoneNumber && (
                        <div className="flex items-center text-sm text-green-600">
                          <Phone className="w-4 h-4 mr-1" />
                          Phone included
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
