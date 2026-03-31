"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  ShoppingBag,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  // Fetch state from Zustand
  const user = useStore((state) => state.user);
  const cart = useStore((state) => state.cart);
  const logout = useStore((state) => state.logout);
  const _hasHydrated = useStore((state) => state._hasHydrated);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const openCart = useStore((state) => state.openCart);

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Clear the HTTP-Only cookie on the backend
      await fetch("/api/auth/logout", { method: "POST" });

      // 2. Clear Zustand global state
      logout();

      // 3. Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Prevent hydration mismatch by not rendering user-specific UI until client has mounted
  if (!_hasHydrated)
    return <div className="h-16 border-b border-neutral-200 bg-white/80" />;

  // Don't show Navbar on the login page
  if (!user) return null;

  const isOwner = user.role === "owner/admin";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-lg border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Left Navigation */}
          <div className="flex items-center gap-8">
            <Link
                href={isOwner ? "/owner" : "/menu"}
              className="flex items-center gap-2 text-orange-600 font-bold text-xl tracking-tight"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="text-white w-5 h-5" />
              </div>
              Picko
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {!isOwner ? (
                <>
                  <Link
                    href="/menu"
                    className="text-neutral-600 hover:text-orange-600 font-medium transition-colors"
                  >
                    Menu
                  </Link>
                  <Link
                    href="/orders"
                    className="text-neutral-600 hover:text-orange-600 font-medium transition-colors"
                  >
                    My Orders
                  </Link>
                </>
              ) : (
                <Link
                  href="/owner"
                  className="flex items-center gap-2 text-neutral-600 hover:text-orange-600 font-medium transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Navigation (Cart & Logout) */}
          <div className="flex items-center gap-4">
            {/* Cart Button (Only for Customers) */}
            {!isOwner && (
              <button
                onClick={openCart}
                className="relative p-2 text-neutral-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            <div className="w-px h-6 bg-neutral-200 hidden sm:block"></div>

            {/* User Greeting & Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isLoggingOut ? "..." : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
