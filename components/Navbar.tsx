"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ShoppingBag, LogOut, LayoutDashboard, ClipboardList, ChefHat } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, cart, _hasHydrated } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemsCount = cart.reduce((t, item) => t + item.quantity, 0);
  const isOwner = user?.role === 'owner/admin';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full">
        {/* Gradient bar at top */}
        <div className="h-0.5 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400" />

        <div className="backdrop-blur-xl bg-white/90 border-b border-orange-100/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-300/40 group-hover:scale-110 transition-transform duration-200">
                  <ChefHat size={20} className="text-white" />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Picko
                </span>
                <span className="hidden sm:block text-xs font-bold text-gray-400 self-end pb-0.5">Food</span>
              </Link>

              {/* Nav items */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Skeleton while store is rehydrating from localStorage */}
                {!_hasHydrated ? (
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="h-8 w-20 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-8 w-24 bg-gray-100 rounded-xl animate-pulse" />
                  </div>
                ) : user ? (
                  <>
                    <Link
                      href={isOwner ? '/owner' : '/orders'}
                      className={`hidden sm:flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
                        (isOwner ? pathname === '/owner' : pathname === '/orders')
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-500/30'
                          : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      {isOwner ? <LayoutDashboard size={16} /> : <ClipboardList size={16} />}
                      {isOwner ? 'Dashboard' : 'My Orders'}
                    </Link>

                    {/* User pill */}
                    <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black ${isOwner ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-gray-700 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all duration-200"
                      title="Log out"
                    >
                      <LogOut size={17} />
                      <span className="hidden sm:block">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="hidden sm:block text-sm font-bold text-gray-600 hover:text-orange-600 px-3 py-2 rounded-xl hover:bg-orange-50 transition-all"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/login"
                      className="text-sm font-black bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl shadow-md shadow-orange-400/30 hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </>
                )}

                {/* Cart button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
                  aria-label="Open Cart"
                >
                  <ShoppingBag size={20} className="text-orange-600" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 text-[11px] font-black text-white bg-red-500 rounded-full flex items-center justify-center border-2 border-white animate-[popIn_0.2s_ease-out]">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes popIn { from { transform:scale(0); opacity:0 } to { transform:scale(1); opacity:1 } }
      `}} />
    </>
  );
}
