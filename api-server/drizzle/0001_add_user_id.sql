ALTER TABLE "grocery_items" ADD COLUMN IF NOT EXISTS "user_id" text;

CREATE INDEX IF NOT EXISTS "grocery_items_user_id_idx"
  ON "grocery_items" ("user_id");
