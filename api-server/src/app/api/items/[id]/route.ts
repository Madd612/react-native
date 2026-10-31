import { and, eq } from "drizzle-orm"
import { NextRequest } from "next/server"
import { db, groceryItems } from "@/lib/db"
import { getUserId } from "@/lib/auth"
import { json, unauthorized } from "@/lib/response"

type Context = { params: Promise<{ id: string }> }

export async function OPTIONS() {
  return json(null, { status: 204 })
}

export async function PATCH(request: NextRequest, context: Context) {
  const userId = await getUserId(request)
  if (!userId) return unauthorized()
  const { id } = await context.params

  try {
    const body = await request.json()
    const values = body.quantity
      ? { quantity: Math.max(1, Math.floor(body.quantity)), updated_at: Date.now() }
      : { purchased: body.purchased ?? true, updated_at: Date.now() }
    const [item] = await db.update(groceryItems).set(values)
      .where(and(eq(groceryItems.id, id), eq(groceryItems.user_id, userId))).returning()
    return item ? json({ item }) : json({ error: "Grocery item not found" }, { status: 404 })
  } catch {
    return json({ error: "Failed to update grocery item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const userId = await getUserId(request)
  if (!userId) return unauthorized()
  const { id } = await context.params

  try {
    await db.delete(groceryItems)
      .where(and(eq(groceryItems.id, id), eq(groceryItems.user_id, userId)))
    return json({ success: true })
  } catch {
    return json({ error: "Failed to delete grocery item" }, { status: 500 })
  }
}
