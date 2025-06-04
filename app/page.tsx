import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Luminory: Connect Students with Expert Tutors</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Luminory is a platform where students can post their learning needs and qualified tutors can help them achieve
          their academic goals.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
            <CardTitle>For Students</CardTitle>
            <CardDescription>Post your tutoring requests and get help from qualified tutors</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Verify your phone number</li>
              <li>• Post detailed tutoring requests</li>
              <li>• Connect with expert tutors</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="w-12 h-12 text-green-600 mb-4" />
            <CardTitle>For Tutors</CardTitle>
            <CardDescription>Browse student requests and offer your expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Purchase coins to view student posts</li>
              <li>• Spend coins to access contact information</li>
              <li>• Build your tutoring business</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="w-12 h-12 text-purple-600 mb-4" />
            <CardTitle>Secure Platform</CardTitle>
            <CardDescription>Safe and verified environment for learning</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Phone verification required</li>
              <li>• Secure payment system</li>
              <li>• Admin moderation</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
            <p className="text-gray-600">Create your account as a student or tutor</p>
          </div>
          <div>
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Post or Browse</h3>
            <p className="text-gray-600">Students post requests, tutors browse opportunities</p>
          </div>
          <div>
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-600">Start learning and teaching together</p>
          </div>
        </div>
      </div>
    </div>
  )
}
