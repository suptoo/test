"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider, facebookProvider } from "@/lib/firebase"
import { Mail, Lock, Chrome, Facebook } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/")
    } catch (error: any) {
      console.error("Sign in error:", error)
      setError(error.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Check if user exists in database, if not create them
      const response = await fetch(`/api/user/role?email=${user.email}`)
      if (!response.ok) {
        // User doesn't exist, create them
        await fetch("/api/auth/firebase-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            name: user.displayName,
            firebaseUid: user.uid,
            role: "STUDENT",
          }),
        })
      }

      router.push("/")
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setError(error.message || "Failed to sign in with Google")
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signInWithPopup(auth, facebookProvider)
      const user = result.user

      // Check if user exists in database, if not create them
      const response = await fetch(`/api/user/role?email=${user.email}`)
      if (!response.ok) {
        // User doesn't exist, create them
        await fetch("/api/auth/firebase-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            name: user.displayName,
            firebaseUid: user.uid,
            role: "STUDENT",
          }),
        })
      }

      router.push("/")
    } catch (error: any) {
      console.error("Facebook sign in error:", error)
      setError(error.message || "Failed to sign in with Facebook")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Sign In to TeacherOn</CardTitle>
          <CardDescription>Enter your credentials or use social login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-2">
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleFacebookSignIn}
              disabled={loading}
            >
              <Facebook className="w-4 h-4 mr-2" />
              Continue with Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-600">Admin: umorfaruksupto@gmail.com</p>
            <p className="text-xs text-gray-600">Or use Google/Facebook login</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
