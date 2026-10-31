import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { bigint, boolean, integer, pgTable, text } from "drizzle-orm/pg-core"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required")
}

export const groceryItems = pgTable("grocery_items", {
  id: text("id").primaryKey(),
  user_id: text("user_id"),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(1),
  purchased: boolean("purchased").notNull().default(false),
  priority: text("priority").notNull().default("medium"),
  updated_at: bigint("updated_at", { mode: "number" }).notNull(),
})

export const db = drizzle({ client: neon(databaseUrl), schema: { groceryItems } })
