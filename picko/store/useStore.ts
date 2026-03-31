import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Strictly type our state entities
export interface CartItem {
  id: string; // Maps to the MenuItem _id
  foodName: string;
  price: number;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "owner/admin";
}

// 2. Define the exact shape of our Zustand store
interface AppState {
  user: User | null;
  cart: CartItem[];
  _hasHydrated: boolean; // Crucial for Next.js SSR

  // Actions
  setHasHydrated: (state: boolean) => void;
  setAuth: (user: User) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

// 3. Create the store with persistence
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setAuth: (user) => set({ user }),

      logout: () => set({ user: null, cart: [] }),
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addToCart: (newItem) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === newItem.id);
          if (existingItem) {
            // Update quantity if item already exists
            return {
              cart: state.cart.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          }
          // Add new item
          return { cart: [...state.cart, newItem] };
        }),

      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "picko-storage", // The key used in localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist the user and cart, ignore _hasHydrated
      partialize: (state) => ({ user: state.user, cart: state.cart }),
      // Once storage is hydrated, update the flag so the UI can safely render
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);