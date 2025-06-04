import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, name, role } = await request.json()

    if (!email || !name || !role) {
      return NextResponse.json({ error: "Email, name, and role are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role as "STUDENT" | "TUTOR" | "ADMIN",
        coins: role === "TUTOR" ? 10 : 0, // Give tutors 10 starter coins
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        coins: user.coins,
      },
    })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
