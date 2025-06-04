import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userEmail } = await request.json()

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user || user.role !== "TUTOR") {
      return NextResponse.json({ error: "Only tutors can view contact information" }, { status: 403 })
    }

    if (user.coins < 2) {
      return NextResponse.json(
        { error: "Insufficient coins. You need 2 coins to view contact information." },
        { status: 400 },
      )
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        phoneViews: {
          where: { tutorId: user.id },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if already viewed phone
    if (post.phoneViews.length > 0) {
      return NextResponse.json({
        message: "Phone already viewed",
        phoneNumber: post.author.phone,
      })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Deduct coins
      await tx.user.update({
        where: { id: user.id },
        data: { coins: user.coins - 2 },
      })

      // Record transaction
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "SPEND",
          amount: -2,
          description: `Viewed phone for post: ${params.id}`,
        },
      })

      // Record phone view
      await tx.phoneView.create({
        data: {
          postId: params.id,
          tutorId: user.id,
        },
      })

      return {
        phoneNumber: post.author.phone,
        message: "Phone number revealed successfully",
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("View phone error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
