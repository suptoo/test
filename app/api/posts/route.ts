import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail")
    const userRole = searchParams.get("userRole")

    if (!userEmail || !userRole) {
      return NextResponse.json({ error: "User email and role are required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.role === "STUDENT") {
      // Students can see their own posts
      const posts = await prisma.post.findMany({
        where: { authorId: user.id },
        include: {
          author: {
            select: { name: true, email: true, phone: true },
          },
          views: true,
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(posts)
    } else if (user.role === "TUTOR") {
      // Tutors can see posts they've viewed or preview of unviewed posts
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: { name: true, email: true, phone: true },
          },
          views: {
            where: { tutorId: user.id },
          },
          phoneViews: {
            where: { tutorId: user.id },
          },
        },
        orderBy: { createdAt: "desc" },
      })

      // Process posts to hide content and phone numbers based on view status
      const processedPosts = posts.map((post) => ({
        ...post,
        content: post.views.length > 0 ? post.content : "Content hidden - Spend 1 coin to view",
        canView: post.views.length > 0,
        phoneNumber: post.phoneViews.length > 0 ? post.author.phone : "Hidden - Spend 2 coins to view",
        phoneRevealed: post.phoneViews.length > 0,
      }))

      return NextResponse.json(processedPosts)
    } else {
      // Admin can see all posts
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: { name: true, email: true, phone: true },
          },
          views: true,
          phoneViews: true,
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(posts)
    }
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, userEmail } = await request.json()

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Only students can create posts" }, { status: 403 })
    }

    if (!user.phoneVerified) {
      return NextResponse.json({ error: "Phone number must be verified before posting" }, { status: 403 })
    }

    if (!user.phone || user.phone.length !== 11) {
      return NextResponse.json({ error: "Valid 11-digit phone number is required" }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.id,
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
