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
      return NextResponse.json({ error: "Only tutors can view posts" }, { status: 403 })
    }

    if (user.coins < 1) {
      return NextResponse.json({ error: "Insufficient coins" }, { status: 400 })
    }

    // Check if already viewed
    const existingView = await prisma.postView.findUnique({
      where: {
        postId_tutorId: {
          postId: params.id,
          tutorId: user.id,
        },
      },
    })

    if (existingView) {
      return NextResponse.json({ error: "Post already viewed" }, { status: 400 })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Deduct coin
      await tx.user.update({
        where: { id: user.id },
        data: { coins: user.coins - 1 },
      })

      // Record transaction
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "SPEND",
          amount: -1,
          description: `Viewed post: ${params.id}`,
        },
      })

      // Record post view
      await tx.postView.create({
        data: {
          postId: params.id,
          tutorId: user.id,
        },
      })

      // Get the post content
      const post = await tx.post.findUnique({
        where: { id: params.id },
        include: {
          author: {
            select: { name: true, email: true },
          },
        },
      })

      return post
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("View post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
