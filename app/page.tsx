"use client";

import { useRef, useState } from 'react';
import FoodCard from '@/components/FoodCard';
import { ChevronRight, Star, MapPin, Clock, Sparkles, UtensilsCrossed, TrendingUp, Flame } from 'lucide-react';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const foodCourts = [
  {
    id: 'bh1',
    name: 'BH-1 Food Court',
    tagline: 'Most popular on campus',
    emoji: '🏛️',
    badge: '🔥 Trending',
    badgeColor: 'bg-red-100 text-red-600',
    rating: 4.8,
    reviews: 124,
    distance: '2 min walk',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=900',
    shops: [
      {
        id: 'dominos',
        name: "Domino's Pizza",
        emoji: '🍕',
        rating: 4.9,
        reviews: 320,
        timeLabel: '20-30 min',
        tag: 'Best Seller',
        coverImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'd1', category: 'Pizza', foodName: '🍕 Margherita Pizza', price: 199, rating: 4.8, description: 'Classic tomato base with loads of fresh mozzarella cheese and basil.' },
          { id: 'd2', category: 'Pizza', foodName: '🧀 Peppy Paneer', price: 249, rating: 4.9, description: 'Juicy paneer chunks with crisp capsicum and tangy tomato sauce.' },
          { id: 'd3', category: 'Pizza', foodName: '🍗 Chicken Dominator', price: 399, rating: 4.7, description: 'Loaded with grilled chicken, double pepper BBQ, and herb seasoning.' },
          { id: 'd4', category: 'Pizza', foodName: '🌶️ Overloaded', price: 349, rating: 4.8, description: 'Double cheese, jalapeños, mushrooms, and golden corn on a crispy base.' },
          { id: 'd5', category: 'Pizza', foodName: '🥦 Garden Fresh', price: 279, rating: 4.6, description: 'Loaded with fresh veggies — broccoli, olives, capsicum, and onion.' },
          { id: 'd6', category: 'Sides', foodName: '🥖 Garlic Breadsticks', price: 99, rating: 4.6, description: 'Freshly baked sticks brushed with garlic butter and Italian herbs.' },
          { id: 'd7', category: 'Sides', foodName: '🍗 Chicken Wings (6pc)', price: 189, rating: 4.7, description: 'Crispy BBQ-glazed chicken wings with ranch dip.' },
          { id: 'd8', category: 'Drinks', foodName: '🥤 Coke 500ml', price: 60, rating: 4.5, description: 'Ice-cold Coca-Cola to wash down your pizza.' },
        ]
      },
      {
        id: 'ccd',
        name: 'Café Coffee Day',
        emoji: '☕',
        rating: 4.6,
        reviews: 215,
        timeLabel: '10-15 min',
        tag: 'Quick Bites',
        coverImage: 'https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'c1', category: 'Coffee', foodName: '☕ Cappuccino', price: 130, rating: 4.9, description: 'Rich espresso with creamy steamed milk foam, the classic café choice.' },
          { id: 'c2', category: 'Coffee', foodName: '❄️ Cold Coffee', price: 150, rating: 4.8, description: 'Chilled blended coffee with milk and a drizzle of Belgian caramel.' },
          { id: 'c3', category: 'Coffee', foodName: '☁️ Dalgona Coffee', price: 165, rating: 4.7, description: 'Velvety whipped coffee foam over cold milk — the Instagram favourite.' },
          { id: 'c4', category: 'Snacks', foodName: '🥐 Vada Pav', price: 35, rating: 4.7, description: 'Spiced potato fritter in a toasted bun with green and tamarind chutneys.' },
          { id: 'c5', category: 'Snacks', foodName: '🥪 Club Sandwich', price: 120, rating: 4.6, description: 'Toasted multi-grain with veggies, cheese, and chipotle mayo sauce.' },
          { id: 'c6', category: 'Snacks', foodName: '🫓 Panini', price: 140, rating: 4.6, description: 'Grilled Italian flatbread with mozzarella, tomato, and pesto.' },
          { id: 'c7', category: 'Desserts', foodName: '🧁 Chocolate Muffin', price: 80, rating: 4.8, description: 'Moist dark chocolate muffin bursting with melty choco chips.' },
          { id: 'c8', category: 'Drinks', foodName: '🍋 Lemon Iced Tea', price: 90, rating: 4.5, description: 'Refreshing brew with real lemon zest and a hint of fresh mint.' },
        ]
      },
      {
        id: 'subway',
        name: 'Subway Express',
        emoji: '🥖',
        rating: 4.5,
        reviews: 178,
        timeLabel: '15-20 min',
        tag: 'Healthy Options',
        coverImage: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'sw1', category: 'Subs', foodName: '🥗 Veggie Delight Sub', price: 179, rating: 4.7, description: 'Packed with crunchy garden veggies in your choice of bread.' },
          { id: 'sw2', category: 'Subs', foodName: '🍗 Chicken Teriyaki Sub', price: 219, rating: 4.8, description: 'Tender chicken with sweet teriyaki sauce and fresh lettuce.' },
          { id: 'sw3', category: 'Subs', foodName: '🥩 Steak & Cheese Sub', price: 259, rating: 4.9, description: 'Tender strips of steak with melted cheese and sautéed peppers.' },
          { id: 'sw4', category: 'Subs', foodName: '🧆 Falafel Sub', price: 199, rating: 4.6, description: 'Crispy falafel balls with tahini sauce and pickled veggies.' },
          { id: 'sw5', category: 'Wraps', foodName: '🌯 Chicken Caesar Wrap', price: 189, rating: 4.7, description: 'Grilled chicken, romaine, parmesan and caesar dressing in a warm wrap.' },
          { id: 'sw6', category: 'Sides', foodName: '🍪 Choco Chip Cookie', price: 60, rating: 4.8, description: 'Freshly baked soft cookie loaded with chocolate chips.' },
        ]
      },
    ]
  },
  {
    id: 'central',
    name: 'Central Food Court',
    tagline: 'Variety you\'ll love',
    emoji: '🏢',
    badge: '⭐ Top Rated',
    badgeColor: 'bg-amber-100 text-amber-700',
    rating: 4.5,
    reviews: 89,
    distance: '5 min walk',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=900',
    shops: [
      {
        id: 'lapinoz',
        name: "La Pino'z Pizza",
        emoji: '🍕',
        rating: 4.7,
        reviews: 180,
        timeLabel: '25-35 min',
        tag: 'Fan Favourite',
        coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'l1', category: 'Pizza', foodName: '🌶️ Schezwan Pizza', price: 229, rating: 4.8, description: 'Fiery Schezwan sauce base with veggies and a generous cheesy topping.' },
          { id: 'l2', category: 'Asian', foodName: '🥟 Veg Momos (8pc)', price: 89, rating: 4.9, description: 'Steamed dumplings stuffed with spiced cabbage, carrots and ginger.' },
          { id: 'l3', category: 'Asian', foodName: '🥟 Chicken Momos (8pc)', price: 119, rating: 4.9, description: 'Juicy chicken dumplings with a fiery chilli dip on the side.' },
          { id: 'l4', category: 'Snacks', foodName: '🌽 Cheese Corn Roll', price: 120, rating: 4.7, description: 'Crispy golden roll filled with cheesy sweet corn, herbs and spices.' },
          { id: 'l5', category: 'Pizza', foodName: '🧀 Cheese Burst', price: 299, rating: 4.9, description: 'Signature oozing cheese-stuffed crust with your choice of classic topping.' },
          { id: 'l6', category: 'Sides', foodName: '🍟 Crispy Fries', price: 79, rating: 4.6, description: 'Golden, perfectly salted crinkle fries with house dipping sauce.' },
          { id: 'l7', category: 'Desserts', foodName: '🍫 Choco Lava Cup', price: 99, rating: 4.8, description: 'Warm brownie cup with flowing molten chocolate inside — pure bliss.' },
          { id: 'l8', category: 'Drinks', foodName: '🍹 Fresh Lime Soda', price: 60, rating: 4.5, description: 'Zingy lime with a choice of sweet, salted, or mixed soda.' },
        ]
      },
      {
        id: 'thali',
        name: 'Desi Thali Hub',
        emoji: '🍛',
        rating: 4.4,
        reviews: 95,
        timeLabel: '15-25 min',
        tag: 'Home Style',
        coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 't1', category: 'Thali', foodName: '🍛 Full Veg Thali', price: 120, rating: 4.7, description: 'Rice, 2 rotis, dal, sabzi, kachumber salad, pickle & papad — a complete meal.' },
          { id: 't2', category: 'Thali', foodName: '🍗 Chicken Thali', price: 160, rating: 4.8, description: 'Hearty chicken curry, jeera rice, 2 rotis, raita, and salad.' },
          { id: 't3', category: 'Mains', foodName: '🫕 Paneer Butter Masala', price: 140, rating: 4.9, description: 'Silky tomato-butter gravy with soft paneer cubes. Best with butter naan.' },
          { id: 't4', category: 'Mains', foodName: '🍗 Butter Chicken', price: 165, rating: 4.8, description: 'Mildly spiced rich tomato gravy with tender chicken chunks.' },
          { id: 't5', category: 'Breads', foodName: '🫓 Butter Naan (2pc)', price: 40, rating: 4.7, description: 'Soft, fluffy naan brushed generously with fresh butter.' },
          { id: 't6', category: 'Breads', foodName: '🫓 Garlic Naan (2pc)', price: 50, rating: 4.8, description: 'Crispy around the edges, topped with golden garlic and coriander.' },
          { id: 't7', category: 'Desserts', foodName: '🍮 Gulab Jamun (2pc)', price: 50, rating: 4.8, description: 'Soft milk-solid dumplings soaked in fragrant cardamom syrup.' },
          { id: 't8', category: 'Drinks', foodName: '🥛 Sweet Lassi', price: 60, rating: 4.7, description: 'Chilled, thick yogurt drink with just a pinch of saffron and rose.' },
        ]
      },
      {
        id: 'burgerking',
        name: 'BK Café',
        emoji: '🍔',
        rating: 4.6,
        reviews: 240,
        timeLabel: '10-20 min',
        tag: '🔥 New Arrival',
        coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'bk1', category: 'Burgers', foodName: '🍔 Whopper', price: 249, rating: 4.8, description: 'Fire-grilled beef patty with fresh lettuce, tomato, onion, and mayo.' },
          { id: 'bk2', category: 'Burgers', foodName: '🌶️ Spicy Crispy Chicken', price: 229, rating: 4.9, description: 'Crunchy fried chicken with fiery sauce on a toasted sesame bun.' },
          { id: 'bk3', category: 'Burgers', foodName: '🧀 Double Cheese Burger', price: 269, rating: 4.7, description: 'Double beef patties with two layers of melted American cheese.' },
          { id: 'bk4', category: 'Burgers', foodName: '🥗 Veggie Bean Burger', price: 169, rating: 4.6, description: 'Crispy veggie bean patty with fresh veggies and chipotle sauce.' },
          { id: 'bk5', category: 'Sides', foodName: '🍟 BK Fries (Large)', price: 99, rating: 4.5, description: 'Thick-cut, golden, perfectly seasoned fries served hot.' },
          { id: 'bk6', category: 'Sides', foodName: '🧅 Onion Rings', price: 89, rating: 4.6, description: 'Golden battered onion rings, crispy outside, sweet inside.' },
          { id: 'bk7', category: 'Shakes', foodName: '🍫 Chocolate Milkshake', price: 129, rating: 4.8, description: 'Thick, creamy, real-ice-cream milkshake with rich chocolate syrup.' },
          { id: 'bk8', category: 'Shakes', foodName: '🍓 Strawberry Shake', price: 119, rating: 4.7, description: 'Frosty strawberry milkshake blended with real fruit.' },
        ]
      },
    ]
  },
  {
    id: 'north',
    name: 'North Campus Hub',
    tagline: 'Fast food paradise',
    emoji: '🏫',
    badge: '🆕 New',
    badgeColor: 'bg-blue-100 text-blue-600',
    rating: 4.3,
    reviews: 52,
    distance: '8 min walk',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=900',
    shops: [
      {
        id: 'rolls',
        name: 'Roll Junction',
        emoji: '🌯',
        rating: 4.5,
        reviews: 130,
        timeLabel: '10-15 min',
        tag: 'Street Food',
        coverImage: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'r1', category: 'Rolls', foodName: '🌯 Paneer Tikka Roll', price: 99, rating: 4.9, description: 'Charred paneer tikka wrapped in a buttery paratha with mint chutney.' },
          { id: 'r2', category: 'Rolls', foodName: '🌯 Chicken Kathi Roll', price: 119, rating: 4.8, description: 'Spicy egg-coated chicken wrapped in a flaky paratha with onion rings.' },
          { id: 'r3', category: 'Rolls', foodName: '🥚 Egg Roll', price: 69, rating: 4.7, description: 'Classic street-style double egg roll, crispy and satisfying.' },
          { id: 'r4', category: 'Rolls', foodName: '🫕 Kadai Paneer Roll', price: 109, rating: 4.8, description: 'Smoky kadai paneer stuffed inside a whole wheat layered paratha.' },
          { id: 'r5', category: 'Snacks', foodName: '🥔 Aloo Tikki Chaat', price: 60, rating: 4.6, description: 'Crispy potato patties topped with tangy chutneys, yoghurt, and sev.' },
          { id: 'r6', category: 'Drinks', foodName: '🥤 Nimbu Pani', price: 30, rating: 4.6, description: 'Fresh lime juice with black salt, cumin, and a hint of mint.' },
        ]
      },
      {
        id: 'sushi',
        name: 'Sakura Sushi Bar',
        emoji: '🍣',
        rating: 4.8,
        reviews: 88,
        timeLabel: '25-40 min',
        tag: '✨ Premium',
        coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'su1', category: 'Sushi', foodName: '🍣 California Roll (8pc)', price: 299, rating: 4.8, description: 'Crab, avocado, cucumber wrapped in seasoned sushi rice and nori.' },
          { id: 'su2', category: 'Sushi', foodName: '🐟 Salmon Sashimi (6pc)', price: 399, rating: 4.9, description: 'Premium fresh-cut Atlantic salmon, served with soy and wasabi.' },
          { id: 'su3', category: 'Sushi', foodName: '🥢 Dragon Roll (8pc)', price: 349, rating: 4.9, description: 'Inside-out roll topped with sliced avocado and spicy mayo.' },
          { id: 'su4', category: 'Sushi', foodName: '🌿 Veggie Roll (8pc)', price: 229, rating: 4.6, description: 'Cucumber, avocado, capsicum and cream cheese — light and fresh.' },
          { id: 'su5', category: 'Mains', foodName: '🍜 Chicken Ramen', price: 279, rating: 4.7, description: 'Rich tonkotsu broth with chicken chashu, soft-boiled egg, and noodles.' },
          { id: 'su6', category: 'Sides', foodName: '🥟 Gyoza (6pc)', price: 189, rating: 4.8, description: 'Pan-fried Japanese dumplings with a crispy bottom, served with soy dip.' },
          { id: 'su7', category: 'Drinks', foodName: '🍵 Matcha Latte', price: 159, rating: 4.7, description: 'Creamy, earthy ceremonial-grade matcha with steamed oat milk.' },
          { id: 'su8', category: 'Desserts', foodName: '🍡 Mochi Ice Cream (3pc)', price: 199, rating: 4.8, description: 'Pillowy Japanese rice cake filled with premium ice cream — assorted flavours.' },
        ]
      },
    ]
  }
];

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
  const [selectedCourt, setSelectedCourt] = useState<typeof foodCourts[0] | null>(null);
  const [selectedShop, setSelectedShop] = useState<typeof foodCourts[0]['shops'][0] | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const scrollToMenu = () => menuRef.current?.scrollIntoView({ behavior: 'smooth' });

  const goToShops = (court: typeof foodCourts[0]) => { setSelectedCourt(court); setView('shops'); };
  const goToMenu = (shop: typeof foodCourts[0]['shops'][0]) => { setSelectedShop(shop); setActiveFilter('All'); setView('menu'); };
  const goBack = () => { if (view === 'menu') setView('shops'); else if (view === 'shops') setView('courts'); };

  const filteredItems = selectedShop
    ? (activeFilter === 'All' ? selectedShop.items : selectedShop.items.filter(i => i.category === activeFilter))
    : [];
  const shopCategories = selectedShop ? ['All', ...Array.from(new Set(selectedShop.items.map(i => i.category)))] : [];

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
                {['🍕','🍔','🍛','☕'].map((e, i) => (
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
              {foodCourts.map((court, idx) => (
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
                      {court.shops.length} shops →
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
              {selectedCourt.shops.map((shop, idx) => (
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
                    <span className="text-xs font-black text-orange-600 group-hover:translate-x-0.5 transition-transform inline-block">{shop.items.length} items →</span>
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
                  className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                    activeFilter === cat
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
              {filteredItems.map((item, idx) => (
                <div key={`${item.id}-${activeFilter}`} className="animate-[fadeInUp_0.4s_ease-out_both]" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <FoodCard id={item.id} foodName={item.foodName} price={item.price} description={item.description} rating={item.rating} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}} />
    </div>
  );
}
