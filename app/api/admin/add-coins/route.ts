import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, adminEmail } = await request.json()

    if (!adminEmail) {
      return NextResponse.json({ error: "Admin email is required" }, { status: 400 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid userId or amount" }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // Add coins to target user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { coins: targetUser.coins + amount },
      })

      // Record transaction
      await tx.transaction.create({
        data: {
          userId: userId,
          type: "ADMIN_ADD",
          amount: amount,
          description: `Admin added ${amount} coins`,
        },
      })

      return updatedUser
    })

    return NextResponse.json({
      message: "Coins added successfully",
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        coins: result.coins,
      },
    })
  } catch (error) {
    console.error("Add coins error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
