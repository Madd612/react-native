import { clearPurchasedGroceryItems } from "@/lib/server/db-actions";

export async function POST() {
  try{
    await clearPurchasedGroceryItems()
    return Response.json({
      success: true
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to clear purchased grocery items"
    return Response.json({ error: message }, { status: 500 })
  }
}