import { prisma } from "./prisma"

export async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log("✅ Database connected successfully")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}
