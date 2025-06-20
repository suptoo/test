import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()

    // Count users to verify tables exist
    const userCount = await prisma.user.count()
    const postCount = await prisma.post.count()

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      users: userCount,
      posts: postCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
