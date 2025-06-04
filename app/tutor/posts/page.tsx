"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TutorPostsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/tutor/dashboard")
  }, [router])

  return <div>Redirecting...</div>
}
