"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Coins, BookOpen, Users, Shield } from "lucide-react"
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
                    <div className="flex items-center space-x-4">
                      {userRole === "STUDENT" && (
                        <Link href="/student/dashboard">
                          <Button variant="ghost">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                      )}
                      {userRole === "TUTOR" && (
                        <>
                          <Link href="/tutor/dashboard">
                            <Button variant="ghost">
                              <Users className="w-4 h-4 mr-2" />
                              Dashboard
                            </Button>
                          </Link>
                          <Link href="/tutor/coins">
                            <Button variant="ghost">
                              <Coins className="w-4 h-4 mr-2" />
                              Buy Coins
                            </Button>
                          </Link>
                        </>
                      )}
                      {userRole === "ADMIN" && (
                        <Link href="/admin">
                          <Button variant="ghost">
                            <Shield className="w-4 h-4 mr-2" />
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <User className="w-4 h-4 mr-2" />
                          {user.displayName || user.email}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href="/profile">
                            <Settings className="w-4 h-4 mr-2" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={signOut}>
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
