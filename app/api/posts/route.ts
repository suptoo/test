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

      // Add phone number to posts where it's included
      const postsWithPhone = posts.map((post) => ({
        ...post,
        phoneNumber: post.includePhone ? post.author.phone : undefined,
        location: post.content.includes("Location:")
          ? post.content.split("Location:")[1]?.split("\n")[0]?.trim()
          : "Not specified",
        status: "Active",
      }))

      return NextResponse.json(postsWithPhone)
    } else if (user.role === "TUTOR") {
      // Tutors can see all posts
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
        phoneNumber:
          post.includePhone && post.phoneViews.length > 0
            ? post.author.phone
            : post.includePhone
              ? "Hidden - Spend 2 coins to view"
              : undefined,
        phoneRevealed: post.includePhone && post.phoneViews.length > 0,
        location: post.content.includes("Location:")
          ? post.content.split("Location:")[1]?.split("\n")[0]?.trim()
          : "Not specified",
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

      const postsWithPhone = posts.map((post) => ({
        ...post,
        phoneNumber: post.includePhone ? post.author.phone : undefined,
        location: post.content.includes("Location:")
          ? post.content.split("Location:")[1]?.split("\n")[0]?.trim()
          : "Not specified",
      }))

      return NextResponse.json(postsWithPhone)
    }
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, type, includePhone, userEmail, location, phoneNumber, budget } = await request.json()

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Only students can create posts" }, { status: 403 })
    }

    // Update user's phone number if provided
    if (phoneNumber && phoneNumber !== user.phone) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          phone: phoneNumber,
          phoneVerified: true, // Auto-verify for demo
        },
      })
    }

    // Create detailed content with location and requirements
    const detailedContent = `Location: ${location}
Phone: ${phoneNumber}
${budget ? `Budget: ${budget}` : ""}

Requirements:
${content}`

    const post = await prisma.post.create({
      data: {
        title: title || `Tutor needed in ${location}`,
        content: detailedContent,
        type: type || "TUITION",
        includePhone: includePhone || true,
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
