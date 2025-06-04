import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true, coins: true, phoneVerified: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      role: user.role,
      coins: user.coins,
      phoneVerified: user.phoneVerified,
    })
  } catch (error) {
    console.error("Error fetching user role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
