"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function Navbar() {
  const { user, userRole, signOut, loading } = useAuth()

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-purple-600">
              Luminory
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <span className="text-sm text-gray-600">
                      {user.email} ({userRole})
                    </span>

                    {userRole === "STUDENT" && (
                      <Link href="/student">
                        <Button variant="ghost">Student Dashboard</Button>
                      </Link>
                    )}

                    {userRole === "TUTOR" && (
                      <Link href="/tutor">
                        <Button variant="ghost">Tutor Dashboard</Button>
                      </Link>
                    )}

                    <Link href="/debug">
                      <Button variant="ghost">Debug</Button>
                    </Link>

                    <Button onClick={signOut} variant="outline">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/signin">
                      <Button variant="ghost">Sign In</Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button>Sign Up</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
