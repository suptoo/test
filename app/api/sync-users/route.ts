import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admin can sync users
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // For now, we'll create a simple sync that creates sample users
    // In production, you would connect to your neon_auth.users_sync table
    const sampleUsers = [
      {
        email: "student1@example.com",
        name: "John Student",
        role: "STUDENT" as const,
      },
      {
        email: "tutor1@example.com",
        name: "Jane Tutor",
        role: "TUTOR" as const,
      },
      {
        email: "student2@example.com",
        name: "Bob Student",
        role: "STUDENT" as const,
      },
    ]

    let syncedCount = 0
    let skippedCount = 0

    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      })

      if (!existingUser) {
        // Create new user
        await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            role: userData.role,
            phoneVerified: false,
          },
        })
        syncedCount++
      } else {
        skippedCount++
      }
    }

    return NextResponse.json({
      message: "User sync completed",
      synced: syncedCount,
      skipped: skippedCount,
      total: sampleUsers.length,
    })
  } catch (error) {
    console.error("User sync error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
