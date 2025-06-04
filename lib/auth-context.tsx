"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
import { auth } from "./firebase"

interface AuthContextType {
  user: User | null
  userRole: string | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        // Fetch user role from database
        try {
          const response = await fetch(`/api/user/role?email=${encodeURIComponent(firebaseUser.email || "")}`)
          if (response.ok) {
            const data = await response.json()
            setUserRole(data.role)
          } else {
            setUserRole(null)
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setUserRole(null)
      // Redirect to home page after sign out
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const value = {
    user,
    userRole,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
