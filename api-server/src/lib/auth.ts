import { verifyToken } from "@clerk/backend"
import { NextRequest } from "next/server"

export const getUserId = async (request: NextRequest) => {
  const authorization = request.headers.get("authorization")
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null

  if (!token) {
    console.error("Clerk authentication failed: missing Bearer token")
    return null
  }

  const secretKey = process.env.CLERK_SECRET_KEY
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY is not configured")
  }

  try {
    const claims = await verifyToken(token, {
      secretKey,
    })
    return claims.sub
  } catch (error) {
    console.error("Clerk authentication failed:", error)
    return null
  }
}
