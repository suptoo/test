"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, CreditCard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"

function CoinsPageContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [amount, setAmount] = useState("250")
  const [loading, setLoading] = useState(false)
  const [userCoins, setUserCoins] = useState(0)

  useEffect(() => {
    if (user?.email) {
      fetchUserCoins()
    }
  }, [user])

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

  const handlePurchase = async () => {
    const coinAmount = Number.parseInt(amount)

    if (coinAmount < 250) {
      alert("Minimum purchase is 250 coins")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/coins/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user?.email,
          amount: coinAmount,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setUserCoins(data.coins)
        alert(`Successfully purchased ${coinAmount} coins!`)
        setAmount("250")
      } else {
        const data = await response.json()
        alert(data.error || "Purchase failed")
      }
    } catch (error) {
      console.error("Error purchasing coins:", error)
      alert("Purchase failed")
    } finally {
      setLoading(false)
    }
  }

  const coinPackages = [
    { amount: 250, price: 250, popular: false },
    { amount: 500, price: 500, popular: true },
    { amount: 1000, price: 1000, popular: false },
    { amount: 2500, price: 2500, popular: false },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Purchase Coins</h1>
        <div className="flex items-center justify-center bg-yellow-100 px-4 py-2 rounded-lg inline-flex">
          <Coins className="w-6 h-6 text-yellow-600 mr-2" />
          <span className="text-lg font-semibold text-yellow-800">Current Balance: {userCoins} coins</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {coinPackages.map((pkg) => (
          <Card key={pkg.amount} className={pkg.popular ? "border-purple-500 border-2" : ""}>
            <CardHeader className="text-center">
              {pkg.popular && (
                <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full mb-2">Most Popular</div>
              )}
              <CardTitle className="text-2xl">{pkg.amount} Coins</CardTitle>
              <CardDescription className="text-xl font-bold">৳{pkg.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className={`w-full ${pkg.popular ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                onClick={() => setAmount(pkg.amount.toString())}
                variant={pkg.popular ? "default" : "outline"}
              >
                Select Package
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="max-w-md mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Custom Amount
          </CardTitle>
          <CardDescription>Purchase any amount of coins (minimum 250)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Number of Coins</label>
            <Input
              type="number"
              min="250"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Coins:</span>
              <span>{amount || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Price:</span>
              <span>৳{amount || 0}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>৳{amount || 0}</span>
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handlePurchase}
            disabled={loading || Number.parseInt(amount) < 250}
          >
            {loading ? "Processing..." : `Purchase ${amount} Coins`}
          </Button>
          <p className="text-xs text-gray-500 text-center">* This is a demo. No actual payment will be processed.</p>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">How Coins Work</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">1 Coin = 1 Taka</h3>
            <p className="text-purple-700">Simple and transparent pricing</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">View Student Posts</h3>
            <p className="text-green-700">Each post costs 1 coin to unlock</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
            <p className="text-blue-700">2 additional coins to view phone numbers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CoinsPage() {
  return (
    <ProtectedRoute requiredRole="TUTOR">
      <CoinsPageContent />
    </ProtectedRoute>
  )
}
