"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Coins, Lock, Phone, BookOpen, FileText, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Post {
  id: string
  title: string
  content: string
  type: "TUITION" | "ASSIGNMENT"
  createdAt: string
  author: {
    name: string
    email: string
  }
  phoneNumber?: string
  canView: boolean
  phoneRevealed?: boolean
}

function TutorDashboardContent() {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [userCoins, setUserCoins] = useState(0)

  useEffect(() => {
    if (user) {
      fetchPosts()
      fetchUserCoins()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true)
      const response = await fetch(`/api/posts?userEmail=${encodeURIComponent(user?.email || "")}&userRole=TUTOR`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoadingPosts(false)
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
        fetchPosts()
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
        fetchPosts()
        alert("Contact information unlocked!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to view contact information")
      }
    } catch (error) {
      console.error("Error viewing phone:", error)
    }
  }

  const renderPostCard = (post: Post) => (
    <Card key={post.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {post.type === "TUITION" ? (
              <BookOpen className="w-5 h-5 text-blue-500" />
            ) : (
              <FileText className="w-5 h-5 text-green-500" />
            )}
            {post.title}
            {!post.canView && (
              <div className="flex items-center text-sm text-gray-500 ml-auto">
                <Lock className="w-4 h-4 mr-1" />1 coin to view
              </div>
            )}
          </CardTitle>
        </div>
        <CardDescription className="flex items-center gap-2">
          <User className="w-4 h-4" />
          By {post.author.name} • Posted on {new Date(post.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{post.canView ? post.content : "Content hidden - Spend 1 coin to view"}</p>
        {!post.canView && (
          <Button onClick={() => handleViewPost(post.id)} disabled={userCoins < 1} className="flex items-center">
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
          ) : post.phoneNumber ? (
            <Button
              onClick={() => handleViewPhone(post.id)}
              disabled={userCoins < 2}
              variant="outline"
              className="flex items-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              View Contact Info (2 coins)
            </Button>
          ) : (
            <div className="text-gray-500 text-sm">No contact information provided</div>
          )}
        </CardFooter>
      )}
    </Card>
  )

  const tuitionPosts = posts.filter((post) => post.type === "TUITION")
  const assignmentPosts = posts.filter((post) => post.type === "ASSIGNMENT")

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (!user || userRole !== "TUTOR") {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-4">You need to be signed in as a tutor to access this page.</p>
        <Button onClick={() => (window.location.href = "/auth/signin")}>Sign In</Button>
      </div>
    )
  }

  if (loadingPosts) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
          <p className="text-gray-600">Browse student posts and find tutoring opportunities</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-yellow-100 px-3 py-2 rounded-lg">
            <Coins className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="font-semibold text-yellow-800">{userCoins} coins</span>
          </div>
          <Button onClick={() => router.push("/tutor/coins")}>Buy Coins</Button>
        </div>
      </div>

      {userCoins < 10 && (
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

      <Tabs defaultValue="tuition" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tuition" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Tuition Posts ({tuitionPosts.length})
          </TabsTrigger>
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Assignment Posts ({assignmentPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tuition" className="mt-6">
          <div className="space-y-4">
            {tuitionPosts.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No tuition posts available at the moment.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              tuitionPosts.map(renderPostCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="assignment" className="mt-6">
          <div className="space-y-4">
            {assignmentPosts.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No assignment posts available at the moment.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              assignmentPosts.map(renderPostCard)
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function TutorDashboardPage() {
  return <TutorDashboardContent />
}
