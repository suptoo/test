import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, phoneNumber } = await request.json()

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }

    if (!phoneNumber || phoneNumber.length !== 11 || !/^\d+$/.test(phoneNumber)) {
      return NextResponse.json({ error: "Valid 11-digit phone number is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { phone: phoneNumber },
    })

    return NextResponse.json({ message: "Phone number updated successfully" })
  } catch (error) {
    console.error("Phone update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
