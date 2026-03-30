import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  foodName: string;
  price: number;
  quantity: number;
  image?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface StoreState {
  // Hydration flag – true once localStorage has been read
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  // Auth State
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;

  // Cart State
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      // Auth Default State
      user: null,
      setAuth: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Cart Default State
      cart: [],
      addToCart: (item) => {
        const { cart } = get();
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
          set({ cart: cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c) });
        } else {
          set({ cart: [...cart, item] });
        }
      },
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter(c => c.id !== id) })),
      updateQuantity: (id, quantity) => set((s) => ({
        cart: s.cart.map(c => c.id === id ? { ...c, quantity: Math.max(1, quantity) } : c)
      })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((t, item) => t + item.price * item.quantity, 0);
      }
    }),
    {
      name: 'picko-storage',
      storage: createJSONStorage(() => localStorage),
      // Called once localStorage data is loaded into the store
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

