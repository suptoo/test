import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminEmail = searchParams.get("adminEmail")

    if (!adminEmail) {
      return NextResponse.json({ error: "Admin email is required" }, { status: 400 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        coins: true,
        phone: true,
        phoneVerified: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            transactions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
