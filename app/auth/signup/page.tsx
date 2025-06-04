"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth"
import { auth, googleProvider, facebookProvider } from "@/lib/firebase"
import { Mail, Lock, User, Phone, Chrome, Facebook } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    role: "STUDENT",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // Update Firebase profile
      await updateProfile(user, {
        displayName: formData.name,
      })

      // Create user in database
      const response = await fetch("/api/auth/firebase-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          firebaseUid: user.uid,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to create user profile")
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      setError(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Create user in database
      const response = await fetch("/api/auth/firebase-register", {
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

      if (response.ok) {
        router.push("/")
      } else {
        const data = await response.json()
        if (data.error === "User already exists") {
          router.push("/")
        } else {
          setError(data.error || "Failed to create user profile")
        }
      }
    } catch (error: any) {
      console.error("Google sign up error:", error)
      setError(error.message || "Failed to sign up with Google")
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookSignUp = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signInWithPopup(auth, facebookProvider)
      const user = result.user

      // Create user in database
      const response = await fetch("/api/auth/firebase-register", {
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

      if (response.ok) {
        router.push("/")
      } else {
        const data = await response.json()
        if (data.error === "User already exists") {
          router.push("/")
        } else {
          setError(data.error || "Failed to create user profile")
        }
      }
    } catch (error: any) {
      console.error("Facebook sign up error:", error)
      setError(error.message || "Failed to sign up with Facebook")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-2">Welcome to TeacherOn!</h2>
              <p className="text-gray-600">Account created successfully. Redirecting...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Join TeacherOn</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-2">
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={loading}>
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleFacebookSignUp}
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
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="STUDENT">Student - Looking for tutoring</option>
                <option value="TUTOR">Tutor - Offering tutoring services</option>
              </select>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
