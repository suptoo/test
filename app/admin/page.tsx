"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Coins, Plus, Eye, RefreshCw, Phone } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/lib/auth-context"

interface User {
  id: string
  email: string
  name: string
  role: string
  coins: number
  phoneVerified: boolean
  phone: string | null
  createdAt: string
  _count: {
    posts: number
    transactions: number
  }
}

function AdminContent() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [coinsToAdd, setCoinsToAdd] = useState("")
  const [addingCoins, setAddingCoins] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (user?.email) {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/admin/users?adminEmail=${encodeURIComponent(user?.email || "")}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCoins = async () => {
    if (!selectedUser || !coinsToAdd) {
      alert("Please select a user and enter coin amount")
      return
    }

    const amount = Number.parseInt(coinsToAdd)
    if (amount <= 0) {
      alert("Please enter a valid coin amount")
      return
    }

    setAddingCoins(true)

    try {
      const response = await fetch("/api/admin/add-coins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminEmail: user?.email,
          userId: selectedUser,
          amount: amount,
        }),
      })

      if (response.ok) {
        alert(`Successfully added ${amount} coins!`)
        setSelectedUser("")
        setCoinsToAdd("")
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to add coins")
      }
    } catch (error) {
      console.error("Error adding coins:", error)
      alert("Failed to add coins")
    } finally {
      setAddingCoins(false)
    }
  }

  const handleSyncUsers = async () => {
    setSyncing(true)
    try {
      const response = await fetch("/api/sync-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminEmail: user?.email,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Sync completed: ${data.synced} users synced, ${data.skipped} skipped`)
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to sync users")
      }
    } catch (error) {
      console.error("Error syncing users:", error)
      alert("Failed to sync users")
    } finally {
      setSyncing(false)
    }
  }

  const stats = {
    totalUsers: users.length,
    students: users.filter((u) => u.role === "STUDENT").length,
    tutors: users.filter((u) => u.role === "TUTOR").length,
    totalCoins: users.reduce((sum, u) => sum + u.coins, 0),
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Luminory Admin Panel</h1>
        <Button onClick={handleSyncUsers} disabled={syncing} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Sample Users"}
        </Button>
      </div>

      {/* Welcome Message */}
      <Card className="mb-8 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800">Welcome to Luminory Admin Panel</CardTitle>
          <CardDescription className="text-purple-700">
            Manage users, monitor platform activity, and add coins to tutor accounts.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tutors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tutors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Coins Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Coins to Tutor
          </CardTitle>
          <CardDescription>Manually add coins to any tutor's account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Tutor</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select a tutor...</option>
                {users
                  .filter((u) => u.role === "TUTOR")
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email}) - {user.coins} coins
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Coins to Add</label>
              <Input
                type="number"
                min="1"
                value={coinsToAdd}
                onChange={(e) => setCoinsToAdd(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddCoins}
                disabled={addingCoins || !selectedUser || !coinsToAdd}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {addingCoins ? "Adding..." : "Add Coins"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage all users on the Luminory platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Coins</th>
                  <th className="text-left p-2">Phone</th>
                  <th className="text-left p-2">Phone Verified</th>
                  <th className="text-left p-2">Posts</th>
                  <th className="text-left p-2">Transactions</th>
                  <th className="text-left p-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-800"
                            : user.role === "TUTOR"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-2">{user.coins}</td>
                    <td className="p-2">
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {user.phone || "Not provided"}
                      </div>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.phoneVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.phoneVerified ? "Verified" : "Not Verified"}
                      </span>
                    </td>
                    <td className="p-2">{user._count.posts}</td>
                    <td className="p-2">{user._count.transactions}</td>
                    <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminContent />
    </ProtectedRoute>
  )
}
