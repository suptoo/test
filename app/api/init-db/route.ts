import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    // Check if admin user exists
    const adminEmail = process.env.ADMIN_EMAIL || "admin@luminory.com"

    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!adminUser) {
      // Create admin user
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: "Admin User",
          role: "ADMIN",
          coins: 1000,
          phoneVerified: true,
        },
      })
    } else {
      // Update existing user to admin
      adminUser = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          role: "ADMIN",
          coins: Math.max(adminUser.coins, 1000),
        },
      })
    }

    // Get database stats
    const userCount = await prisma.user.count()
    const postCount = await prisma.post.count()

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      adminUser: {
        email: adminUser.email,
        role: adminUser.role,
        coins: adminUser.coins,
      },
      stats: {
        users: userCount,
        posts: postCount,
      },
    })
  } catch (error) {
    console.error("Database initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
