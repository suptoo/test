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

    // Direct SQL query to access neon_auth.users_sync
    const neonUsers = (await prisma.$queryRaw`
      SELECT id, email, name, created_at, updated_at, raw_json
      FROM neon_auth.users_sync 
      WHERE deleted_at IS NULL 
      AND email IS NOT NULL
    `) as any[]

    let syncedCount = 0
    let skippedCount = 0

    for (const neonUser of neonUsers) {
      if (!neonUser.email) continue

      // Check if user already exists in our main users table
      const existingUser = await prisma.user.findUnique({
        where: { email: neonUser.email },
      })

      if (!existingUser) {
        // Create new user from neon auth data
        await prisma.user.create({
          data: {
            email: neonUser.email,
            name: neonUser.name || null,
            role: neonUser.email === "umorfaruksupto@gmail.com" ? "ADMIN" : "STUDENT",
            phoneVerified: neonUser.email === "umorfaruksupto@gmail.com",
          },
        })
        syncedCount++
      } else {
        skippedCount++
      }
    }

    return NextResponse.json({
      message: "Neon auth sync completed",
      synced: syncedCount,
      skipped: skippedCount,
      total: neonUsers.length,
    })
  } catch (error) {
    console.error("Neon sync error:", error)
    return NextResponse.json(
      {
        error: "Sync failed - this is normal if neon_auth schema doesn't exist yet",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
