"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StudentPostsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/student/dashboard")
  }, [router])

  return <div>Redirecting...</div>
}
