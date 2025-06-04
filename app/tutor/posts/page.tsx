"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Eye, Coins, Lock, Phone } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"

interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    name: string
    email: string
  }
  phoneNumber?: string
  canView: boolean
  phoneRevealed?: boolean
}

function TutorPostsContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [userCoins, setUserCoins] = useState(0)

  useEffect(() => {
    if (user) {
      fetchPosts()
      fetchUserCoins()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?userEmail=${encodeURIComponent(user?.email || "")}&userRole=TUTOR`)
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

  const fetchUserCoins = async () => {
    if (user?.email) {
      try {
        const response = await fetch(`/api/user/role?email=${encodeURIComponent(user.email)}`)
        if (response.ok) {
          const data = await response.json()
          setUserCoins(data.coins || 0)
        }
      } catch (error) {
        console.error("Error fetching user coins:", error)
        setUserCoins(0)
      }
    }
  }

  const handleViewPost = async (postId: string) => {
    if (userCoins < 1) {
      alert("Insufficient coins. Please purchase more coins.")
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: user?.email }),
      })

      if (response.ok) {
        setUserCoins((prev) => prev - 1)
        fetchPosts() // Refresh posts to show the viewed content
        alert("Post unlocked successfully!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to view post")
      }
    } catch (error) {
      console.error("Error viewing post:", error)
    }
  }

  const handleViewPhone = async (postId: string) => {
    if (userCoins < 2) {
      alert("Insufficient coins. You need 2 coins to view contact information.")
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: user?.email }),
      })

      if (response.ok) {
        setUserCoins((prev) => prev - 2)
        fetchPosts() // Refresh posts to show the phone number
        alert("Contact information unlocked!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to view contact information")
      }
    } catch (error) {
      console.error("Error viewing phone:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Browse Posts</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-yellow-100 px-3 py-2 rounded-lg">
            <Coins className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="font-semibold text-yellow-800">{userCoins} coins</span>
          </div>
          <Button onClick={() => router.push("/tutor/coins")}>Buy Coins</Button>
        </div>
      </div>

      {userCoins < 250 && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Welcome to Luminory!</CardTitle>
            <CardDescription className="text-blue-700">
              You need coins to view student posts and contact information. Each post costs 1 coin to view, and contact
              information costs 2 additional coins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/tutor/coins")} className="bg-blue-600 hover:bg-blue-700">
              Purchase Coins
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <p>No posts available at the moment.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {post.title}
                  {!post.canView && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Lock className="w-4 h-4 mr-1" />1 coin to view
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  By {post.author.name} • Posted on {new Date(post.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  {post.canView ? post.content : "Content hidden - Spend 1 coin to view"}
                </p>
                {!post.canView && (
                  <Button
                    onClick={() => handleViewPost(post.id)}
                    disabled={userCoins < 1}
                    className="flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Post (1 coin)
                  </Button>
                )}
              </CardContent>
              {post.canView && (
                <CardFooter className="border-t pt-4">
                  {post.phoneRevealed ? (
                    <div className="flex items-center text-green-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>Contact: {post.phoneNumber}</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleViewPhone(post.id)}
                      disabled={userCoins < 2}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      View Contact Info (2 coins)
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default function TutorPostsPage() {
  return (
    <ProtectedRoute requiredRole="TUTOR">
      <TutorPostsContent />
    </ProtectedRoute>
  )
}
