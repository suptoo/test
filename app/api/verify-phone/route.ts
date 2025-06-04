import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { verificationCode, userEmail } = await request.json()

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }

    // In a real app, you'd verify the code with WhatsApp API
    // For demo purposes, we'll accept any 6-digit code
    if (verificationCode && verificationCode.length === 6) {
      await prisma.user.update({
        where: { email: userEmail },
        data: { phoneVerified: true },
      })

      return NextResponse.json({ message: "Phone verified successfully" })
    }

    return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
  } catch (error) {
    console.error("Phone verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
