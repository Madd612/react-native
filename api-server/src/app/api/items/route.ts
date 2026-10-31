import { desc, eq, and } from "drizzle-orm"
import { NextRequest } from "next/server"
import { db, groceryItems } from "@/lib/db"
import { getUserId } from "@/lib/auth"
import { json, unauthorized } from "@/lib/response"

export async function OPTIONS() {
  return json(null, { status: 204 })
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return unauthorized()

  try {
    const items = await db.select().from(groceryItems)
      .where(eq(groceryItems.user_id, userId))
      .orderBy(desc(groceryItems.updated_at))
    return json({ items })
  } catch {
    return json({ error: "Failed to fetch grocery items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return unauthorized()

  try {
    const body = await request.json()
    const { name, category, quantity, priority } = body
    if (!name || !category || !quantity || !priority) {
      return json({ error: "Please provide all required fields" }, { status: 400 })
    }

    const [item] = await db.insert(groceryItems).values({
      id: crypto.randomUUID(), user_id: userId, name, category,
      quantity: Math.max(1, quantity), purchased: false, priority, updated_at: Date.now(),
    }).returning()
    return json({ item }, { status: 201 })
  } catch {
    return json({ error: "Failed to create grocery item" }, { status: 500 })
  }
}
