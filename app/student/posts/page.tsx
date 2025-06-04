"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, AlertCircle, Phone } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"

interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  views: any[]
  phoneNumber?: string
}

function StudentPostsContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    phoneNumber: "",
  })

  useEffect(() => {
    if (user) {
      fetchPosts()
      checkPhoneVerification()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?userEmail=${encodeURIComponent(user?.email || "")}&userRole=STUDENT`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
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

    if (!phoneVerified) {
      alert("Please verify your phone number first")
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
          phoneNumber,
        }),
      })

      if (response.ok) {
        setFormData({ title: "", content: "", phoneNumber: "" })
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {!phoneVerified && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              Phone Verification Required
            </CardTitle>
            <CardDescription className="text-orange-700">
              You need to verify your phone number before you can post tutoring requests.
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

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>Describe what kind of tutoring help you need</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Describe your tutoring needs in detail..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={!phoneVerified}>
                  Create Post
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <p>No posts yet. Create your first tutoring request!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>Posted on {new Date(post.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.content}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  {post.views.length} tutor(s) viewed this post
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default function StudentPostsPage() {
  return (
    <ProtectedRoute requiredRole="STUDENT">
      <StudentPostsContent />
    </ProtectedRoute>
  )
}
