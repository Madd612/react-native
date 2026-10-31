import { and, eq } from "drizzle-orm"
import { NextRequest } from "next/server"
import { db, groceryItems } from "@/lib/db"
import { getUserId } from "@/lib/auth"
import { json, unauthorized } from "@/lib/response"

export async function OPTIONS() {
  return json(null, { status: 204 })
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return unauthorized()

  try {
    await db.delete(groceryItems).where(and(
      eq(groceryItems.user_id, userId),
      eq(groceryItems.purchased, true),
    ))
    return json({ success: true })
  } catch {
    return json({ error: "Failed to clear purchased grocery items" }, { status: 500 })
  }
}
