import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, role, firebaseUid } = await request.json()

    if (!email || !firebaseUid) {
      return NextResponse.json({ error: "Email and Firebase UID are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Set admin role for your email
    const userRole = email === "umorfaruksupto@gmail.com" ? "ADMIN" : role || "STUDENT"

    // Create new user
    const user = await prisma.user.create({
      data: {
        id: firebaseUid, // Use Firebase UID as primary key
        email,
        name,
        phone,
        role: userRole,
        phoneVerified: email === "umorfaruksupto@gmail.com", // Auto-verify admin
      },
    })

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
