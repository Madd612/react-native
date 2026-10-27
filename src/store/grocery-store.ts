import { create } from "zustand"

export type GroceryCategory = "Produce" | "Dairy" | "Bakery" | "Pantry" | "Snacks" | "Frozen" | "Beverages"
export type GroceryPriority = "Low" | "Medium" | "High"

export interface GroceryItem {
  id: string
  name: string
  category: GroceryCategory
  quantity: number
  purchased: boolean
  priority: GroceryPriority
}

export interface CreateGroceryItem {
  name: string
  category: GroceryCategory
  quantity: number
  priority: GroceryPriority
}

type ItemsResponse = { items: GroceryItem[] }
type ItemResponse = { item: GroceryItem }

interface GroceryStore {
  items: GroceryItem[]
  isLoading: boolean
  error: string | null
  loadItems: ()=> Promise<void>
  addItem: (input: CreateGroceryItem)=> Promise<GroceryItem | void>
  updateQuantity: (id: string, quantity: number)=> Promise<void>
  togglePurchased: (id: string, purchased?: boolean)=> Promise<void>
  removeItem: (id: string)=> Promise<void>
  clearPurchased: ()=> Promise<void>
}
 
export const useGroceryStore = create<GroceryStore>((set, get)=> ({
  items: [],
  isLoading: false,
  error: null,
  
  loadItems: async ()=> {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch("/api/items")
      const payload = (await res.json()) as ItemsResponse

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`)
      }
      set({ items: payload.items, isLoading: false })
    } catch (error) {
      console.error("Error: " + error)
      set({ error: "Something went wrong"})
    } finally {
      set({ isLoading: false })
    }
  },

  addItem: async (input) => {
    set({ error: null })
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: input.name,
          category: input.category,
          quantity: input.quantity,
          priority: input.priority,
        })
      })
      const payload = (await res.json()) as ItemResponse
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`)
      }
      set((i)=> ({ items: [payload.item, ...i.items]}))
      return payload.item
    } catch (error) {
      console.error("Error: " + error)
      set({ error: "Something went wrong"})
    }
  },

  updateQuantity: async (id, quantity) => {
    const nextQty = Math.max(1, quantity)
    set({ error: null })
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: nextQty })
      })
      const payload = (await res.json() as ItemResponse)
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`)
      }
      set((i)=> ({
        items: i.items.map((item)=> item.id === id ? payload.item : item)
      }))
    } catch (error) {
      console.error("Error: " + error)
      set({ error: "Something went wrong"})
    }
  },

  togglePurchased: async (id, purchased) => {
    const currentItem = get().items.find((i)=> i.id === id)
    if (!currentItem) return
    const nextPurchased = purchased ?? !currentItem.purchased
    set({ error: null })
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchased: nextPurchased })
      })
      const payload = (await res.json() as ItemResponse)
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`)
      }
      set((i)=> ({
        items: i.items.map((item)=> item.id === id ? payload.item : item)
      }))
    } catch (error) {
      console.error("Error: " + error)
      set({ error: "Something went wrong"})
    }
  },

  removeItem: async (id) => {
    set({ error: null })
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE"
      })
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`)
      }
      set((i)=> ({
        items: i.items.filter((item)=> item.id !== id)
      }))
    } catch (error) {
      console.error("Error: " + error)
      set({ error: "Something went wrong"})
    }
  },

  clearPurchased: async () => {
    set({ error: null })
    try {
      const res = await fetch("/api/items/clear-purchased", {
        method: "POST"
      })
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`)
      }
      const items = get().items.filter((item)=> !item.purchased)
      set({ items })
    } catch (error) {
      console.error("Error: " + error)
      set({ error: "Something went wrong"})
    }
  },

}))