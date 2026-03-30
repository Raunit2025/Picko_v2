"use client";

import { useRef, useState, useEffect } from 'react';
import FoodCard from '@/components/FoodCard';
import { ChevronRight, Star, MapPin, Clock, Sparkles, UtensilsCrossed, TrendingUp, Flame, Loader2 } from 'lucide-react';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const StarRating = ({ rating, small }: { rating: number; small?: boolean }) => (
  <span className={`flex items-center gap-1 text-amber-500 font-bold ${small ? 'text-xs' : 'text-sm'}`}>
    <Star size={small ? 11 : 13} fill="currentColor" /> {rating}
  </span>
);

type View = 'courts' | 'shops' | 'menu';

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Home() {
  const menuRef = useRef<HTMLElement>(null);
  const [view, setView] = useState<View>('courts');
  const [foodCourts, setFoodCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourt, setSelectedCourt] = useState<any | null>(null);
  const [selectedShop, setSelectedShop] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await fetch('/api/shops');
        const data = await res.json();
        if (data.foodCourts) {
          setFoodCourts(data.foodCourts);
        }
      } catch (error) {
        console.error("Failed to fetch food courts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  const scrollToMenu = () => menuRef.current?.scrollIntoView({ behavior: 'smooth' });

  const goToShops = (court: any) => { setSelectedCourt(court); setView('shops'); };
  const goToMenu = (shop: any) => { setSelectedShop(shop); setActiveFilter('All'); setView('menu'); };
  const goBack = () => { if (view === 'menu') setView('shops'); else if (view === 'shops') setView('courts'); };

  const filteredItems = selectedShop
    ? (activeFilter === 'All' ? selectedShop.items : selectedShop.items.filter((i: any) => i.category === activeFilter))
    : [];
  const shopCategories = selectedShop ? ['All', ...Array.from(new Set<string>(selectedShop.items.map((i: any) => i.category)))] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/60 to-gray-50 pb-28">

      {/* ──────────── HERO ──────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 min-h-[460px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000')] opacity-15 bg-cover bg-center" />
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/10 rounded-full" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-20 animate-[fadeIn_0.8s_ease-out]">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm font-bold mb-6 border border-white/25 shadow-inner">
            <Sparkles size={14} className="text-yellow-200" />
            <span>Campus-wide delivery in under 30 min</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-xl mb-5 tracking-tight">
            Food that comes<br />
            <span className="text-yellow-300 drop-shadow-md">straight to you 🚀</span>
          </h1>
          <p className="text-orange-100 text-lg font-medium mb-10 max-w-xl mx-auto">
            Browse food courts, pick your favourite shop, and enjoy hot food wherever you are on campus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={scrollToMenu}
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-base shadow-2xl shadow-orange-900/20 hover:scale-105 active:scale-95 transition-all duration-250 flex items-center gap-2"
            >
              <UtensilsCrossed size={18} />
              Browse Food Courts
            </button>
            <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
              <div className="flex -space-x-2">
                {['🍕', '🍔', '🍛', '☕'].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <span>3 courts · 8 shops · 60+ items</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── FEATURE STRIP ──────────── */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 mb-6 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Flame size={16} className="text-red-500" />, label: 'Live Tracking', sub: 'Real-time status' },
            { icon: <TrendingUp size={16} className="text-emerald-500" />, label: 'UPI & Cash', sub: 'Multiple payments' },
            { icon: <Star size={16} className="text-amber-500" />, label: '4.7 Avg Rating', sub: '500+ reviews' },
          ].map((f, i) => (
            <div key={i} className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">{f.icon}</div>
              <div className="min-w-0">
                <p className="font-black text-gray-900 text-xs truncate">{f.label}</p>
                <p className="text-gray-400 text-[10px] truncate">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────── BROWSING SECTION ──────────── */}
      <section ref={menuRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 scroll-mt-20">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-4 text-orange-500" size={40} />
            <p className="font-bold">Fetching latest food courts...</p>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 mb-6 flex-wrap">
              <button onClick={() => setView('courts')} className={`hover:text-orange-600 transition-colors ${view === 'courts' ? 'text-orange-600' : ''}`}>
                🏛️ Food Courts
              </button>
              {selectedCourt && (
                <><ChevronRight size={14} />
                  <button onClick={() => setView('shops')} className={`hover:text-orange-600 transition-colors ${view === 'shops' ? 'text-orange-600' : ''}`}>
                    {selectedCourt.emoji} {selectedCourt.name}
                  </button>
                </>
              )}
              {selectedShop && (
                <><ChevronRight size={14} />
                  <span className="text-gray-800">{selectedShop.emoji} {selectedShop.name}</span>
                </>
              )}
            </nav>

            {view !== 'courts' && (
              <button
                onClick={goBack}
                className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm transition-all hover:-translate-x-0.5 hover:border-orange-300"
              >
                ← Back
              </button>
            )}

            {/* ── COURTS VIEW ── */}
            {view === 'courts' && (
              <div className="animate-[fadeInUp_0.4s_ease-out]">
                <div className="flex items-end gap-3 mb-8">
                  <h2 className="text-3xl font-black text-gray-900">Pick a Food Court</h2>
                  <span className="text-sm font-bold text-gray-400 pb-0.5">{foodCourts.length} courts available</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {foodCourts.map((court: any, idx) => (
                    <button
                      key={court.id}
                      onClick={() => goToShops(court)}
                      className="group text-left bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-1.5 transition-all duration-300 animate-[fadeInUp_0.5s_ease-out_both]"
                      style={{ animationDelay: `${idx * 0.12}s` }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img src={court.image} alt={court.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${court.badgeColor}`}>{court.badge}</span>
                        </div>
                        <div className="absolute bottom-3 left-4 right-4">
                          <p className="text-white text-lg font-black leading-tight">{court.emoji} {court.name}</p>
                          <p className="text-white/70 text-xs mt-0.5">{court.tagline}</p>
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StarRating rating={court.rating} small />
                          <span className="text-xs text-gray-400">{court.reviews} reviews</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <MapPin size={11} />{court.distance}
                        </div>
                        <span className="text-xs font-black text-orange-600 group-hover:translate-x-1 transition-transform inline-block">
                          {court.shops?.length || 0} shops →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── SHOPS VIEW ── */}
            {view === 'shops' && selectedCourt && (
              <div className="animate-[fadeInUp_0.4s_ease-out]">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-gray-900">{selectedCourt.emoji} {selectedCourt.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <StarRating rating={selectedCourt.rating} small />
                    <span className="text-sm text-gray-400">{selectedCourt.reviews} reviews · {selectedCourt.distance}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {selectedCourt.shops?.map((shop: any, idx: number) => (
                    <button
                      key={shop.id}
                      onClick={() => goToMenu(shop)}
                      className="group text-left bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl hover:shadow-orange-200/40 hover:-translate-y-1 transition-all duration-300 animate-[fadeInUp_0.4s_ease-out_both]"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-black px-2 py-0.5 rounded-full text-gray-700">{shop.tag}</div>
                        <div className="absolute bottom-2 left-3 text-white">
                          <p className="font-black text-base">{shop.emoji} {shop.name}</p>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StarRating rating={shop.rating} small />
                          <span className="text-xs text-gray-400">{shop.reviews}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock size={11} />{shop.timeLabel}
                        </div>
                        <span className="text-xs font-black text-orange-600 group-hover:translate-x-0.5 transition-transform inline-block">{shop.items?.length || 0} items →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── MENU VIEW ── */}
            {view === 'menu' && selectedShop && (
              <div className="animate-[fadeInUp_0.4s_ease-out]">
                {/* Shop header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                    <img src={selectedShop.coverImage} alt={selectedShop.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-gray-900">{selectedShop.emoji} {selectedShop.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <StarRating rating={selectedShop.rating} small />
                      <span className="text-xs text-gray-400">{selectedShop.reviews} reviews</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} />{selectedShop.timeLabel}</span>
                      <span className="text-xs font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{selectedShop.tag}</span>
                    </div>
                  </div>
                </div>

                {/* Category pills */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
                  {shopCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 ${activeFilter === cat
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25'
                        : 'bg-white text-gray-500 border border-gray-200 hover:border-orange-400 hover:text-orange-600'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredItems.map((item: any, idx: number) => (
                    <div key={`${item.id}-${activeFilter}`} className="animate-[fadeInUp_0.4s_ease-out_both]" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <FoodCard id={item.id} foodName={item.foodName} price={item.price} description={item.description} rating={item.rating} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}} />
    </div>
  );
}
