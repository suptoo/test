import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { amount, userEmail } = await request.json()

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user || user.role !== "TUTOR") {
      return NextResponse.json({ error: "Only tutors can purchase coins" }, { status: 403 })
    }

    if (amount < 250) {
      return NextResponse.json({ error: "Minimum purchase is 250 coins" }, { status: 400 })
    }

    // In a real app, you'd integrate with a payment gateway here
    // For demo purposes, we'll just add the coins

    const result = await prisma.$transaction(async (tx) => {
      // Add coins to user
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { coins: user.coins + amount },
      })

      // Record transaction
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "PURCHASE",
          amount: amount,
          description: `Purchased ${amount} coins`,
        },
      })

      return updatedUser
    })

    return NextResponse.json({
      message: "Coins purchased successfully",
      coins: result.coins,
    })
  } catch (error) {
    console.error("Purchase coins error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
