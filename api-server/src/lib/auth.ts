import { verifyToken } from "@clerk/backend"
import { NextRequest } from "next/server"

export const getUserId = async (request: NextRequest) => {
  const authorization = request.headers.get("authorization")
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null

  if (!token) {
    return null
  }

  try {
    const claims = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    })
    return claims.sub
  } catch {
    return null
  }
}
