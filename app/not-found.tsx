"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="flex items-center">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  )
}
