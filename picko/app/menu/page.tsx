"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";
import {
  Loader2,
  ChevronLeft,
  MapPin,
  Store,
  Plus,
  Search,
  Clock,
  Flame,
  Star,
  ArrowRight,
} from "lucide-react";

// --- Types ---
interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  tags: string[];
}

interface Shop {
  _id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  items: MenuItem[];
}

interface FoodCourt {
  _id: string;
  name: string;
  location: string;
  shops: Shop[];
}

// --- Smart Image Component with Fallback ---
const ShopImage = ({
  src,
  alt,
  className = "h-56",
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const fallbackImg =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";
  const [imgSrc, setImgSrc] = useState(src || fallbackImg);

  return (
    <div
      className={`relative w-full bg-neutral-100 overflow-hidden ${className}`}
    >
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        priority={false}
        onError={() => setImgSrc(fallbackImg)}
      />
      <div className="absolute inset-0 bg-linear-to-t from-neutral-900/90 via-neutral-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
    </div>
  );
};

// --- Premium Category Data ---
const categories = [
  {
    name: "Burgers",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Pizza",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Healthy",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Indian",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Desserts",
    img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Coffee",
    img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80",
  },
];

const courtCovers = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
];

export default function CustomerDashboard() {
  const user = useStore((state) => state.user);
  const addToCart = useStore((state) => state.addToCart);
  const _hasHydrated = useStore((state) => state._hasHydrated);

  const [courts, setCourts] = useState<FoodCourt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCourt, setSelectedCourt] = useState<FoodCourt | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for floating header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("/api/shops");
        if (!res.ok) throw new Error("Failed to fetch food courts");
        const data = await res.json();
        setCourts(data);
      } catch {
        setError("Could not load menu. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShops();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item._id,
      foodName: item.name,
      price: item.price,
      quantity: 1,
    });
    toast.success(`${item.name} added to cart!`);
  };

  // --- Deep Search Logic ---
  const activeSearch = searchQuery.toLowerCase();

  // State 1: Filter Courts if they have a matching name OR contain a shop/item that matches
  const displayedCourts = courts.filter((court) => {
    if (!activeSearch) return true;
    return (
      court.name.toLowerCase().includes(activeSearch) ||
      court.shops.some(
        (shop) =>
          shop.name.toLowerCase().includes(activeSearch) ||
          shop.items.some(
            (item) =>
              item.name.toLowerCase().includes(activeSearch) ||
              item.tags.some((tag) => tag.toLowerCase().includes(activeSearch)),
          ),
      )
    );
  });

  // State 2: Filter Shops if they match OR contain matching items
  const displayedShops = selectedCourt?.shops.filter((shop) => {
    if (!activeSearch) return true;
    return (
      shop.name.toLowerCase().includes(activeSearch) ||
      shop.items.some(
        (item) =>
          item.name.toLowerCase().includes(activeSearch) ||
          item.tags.some((tag) => tag.toLowerCase().includes(activeSearch)),
      )
    );
  });

  // State 3: Filter individual items
  const filteredItems = selectedShop?.items.filter(
    (item) =>
      item.name.toLowerCase().includes(activeSearch) ||
      item.description.toLowerCase().includes(activeSearch) ||
      item.tags.some((tag) => tag.toLowerCase().includes(activeSearch)),
  );

  const scrollToFoodCourts = () => {
    document.getElementById("food-courts-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24 relative selection:bg-orange-200 overflow-hidden">
      {/* Subtle Glowing Orbs Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-400/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-96 -right-40 w-[500px] h-[500px] bg-rose-400/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Floating Island Header */}
      <div className="sticky top-0 z-40 pt-4 px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div
          className={`max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 rounded-2xl ${
            isScrolled
              ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-neutral-900/5 px-6 py-4 border border-white/20"
              : "bg-transparent py-4"
          }`}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Ready to eat,{" "}
              <span className="text-orange-600">
                {user?.name.split(" ")[0]}?
              </span>
            </h1>
            <p className="text-neutral-500 font-medium text-sm mt-0.5 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-orange-500" /> Delivering to
              Campus
            </p>
          </div>

          <div className="relative w-full md:w-80 animate-in fade-in zoom-in duration-300">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder={
                selectedShop
                  ? `Search in ${selectedShop.name}...`
                  : "Search food, shops, or courts..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur border-2 border-neutral-100 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-neutral-900 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 text-orange-600/50 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
            <p className="font-bold text-lg text-neutral-600">
              Finding the best food...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center border border-red-100 shadow-sm mb-8 font-bold">
            {error}
          </div>
        )}

        {/* Drill-down Back Button */}
        {(selectedCourt || selectedShop) && (
          <button
            onClick={() => {
              if (selectedShop) {
                setSelectedShop(null);
                setSearchQuery("");
              } else {
                setSelectedCourt(null);
              }
            }}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-bold mb-8 transition-all bg-white px-5 py-2.5 rounded-xl shadow-sm border border-neutral-200 hover:border-neutral-300 w-fit group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to {selectedShop ? selectedCourt?.name : "Home"}
          </button>
        )}

        {/* --- STATE 1: HOME PAGE --- */}
        {!selectedCourt && !isLoading && !error && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* The Hook: Massive Hero Banner */}
            <div className="relative w-full h-72 sm:h-[400px] rounded-4xl overflow-hidden shadow-2xl shadow-orange-900/10 mb-12 group">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
                alt="Delicious Feast"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-r from-neutral-900/90 via-neutral-900/50 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-center p-8 sm:p-12">
                <span className="bg-orange-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg w-fit mb-4 flex items-center gap-1.5 shadow-lg">
                  <Flame className="w-4 h-4" /> Exam Week Special
                </span>
                <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 max-w-xl leading-tight drop-shadow-lg">
                  Fuel your <br />
                  late night studies.
                </h2>
                <p className="text-neutral-200 font-medium text-lg max-w-md mb-8 hidden sm:block">
                  Get hot, fresh food delivered straight to your hostel block in
                  under 20 minutes.
                </p>
                <button
                  onClick={scrollToFoodCourts}
                  className="bg-white text-neutral-900 hover:bg-orange-50 font-black px-8 py-4 rounded-xl w-fit flex items-center gap-2 transition-colors shadow-xl"
                >
                  Order Now <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Photo-Realistic Categories */}
            <div className="mb-14">
              <h3 className="text-2xl font-black text-neutral-900 mb-6 flex items-center gap-2">
                Craving Something Specific?
              </h3>
              <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(cat.name);
                      scrollToFoodCourts();
                    }}
                    className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group"
                  >
                    {/* Fixed aspect ratio for perfect circles */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 border-4 border-white">
                      <Image
                        src={cat.img}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                      <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-black text-neutral-700 group-hover:text-orange-600 transition-colors">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Courts Grid */}
            <div id="food-courts-section" className="scroll-mt-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-neutral-900">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : "Explore Food Courts"}
                </h3>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-orange-600 font-bold text-sm hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {displayedCourts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-4xl border border-neutral-100 shadow-sm">
                  <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900">
                    No courts found
                  </h3>
                  <p className="text-neutral-500 font-medium">
                    Try searching for something else!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedCourts.map((court, index) => (
                    <div
                      key={court._id}
                      onClick={() => setSelectedCourt(court)}
                      className="bg-white rounded-4xl shadow-sm border border-neutral-100 hover:shadow-2xl hover:shadow-neutral-900/5 hover:-translate-y-1.5 cursor-pointer transition-all duration-300 group overflow-hidden relative"
                    >
                      <div className="h-56 w-full relative">
                        <Image
                          src={courtCovers[index % courtCovers.length]}
                          alt={court.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-neutral-900/90 via-neutral-900/30 to-transparent" />

                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg font-black text-xs text-neutral-900 shadow-lg flex items-center gap-1">
                          <Store className="w-3.5 h-3.5 text-orange-600" />{" "}
                          {court.shops.length} Shops
                        </div>

                        <div className="absolute bottom-6 left-6 right-6">
                          <h2 className="text-3xl font-black text-white mb-2 drop-shadow-md">
                            {court.name}
                          </h2>
                          <p className="flex items-center gap-1.5 text-neutral-200 font-medium text-sm">
                            <MapPin className="w-4 h-4 text-orange-400" />{" "}
                            {court.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STATE 2: Show Shops in Selected Court */}
        {selectedCourt && !selectedShop && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-neutral-900">
                {searchQuery
                  ? `Shops matching "${searchQuery}"`
                  : `Shops in ${selectedCourt.name}`}
              </h3>
            </div>

            {!displayedShops || displayedShops.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-4xl border border-neutral-100 shadow-sm">
                <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neutral-900">
                  No shops found
                </h3>
                <p className="text-neutral-500 font-medium">
                  Try searching for something else!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedShops.map((shop) => (
                  <div
                    key={shop._id}
                    onClick={() => setSelectedShop(shop)}
                    className="bg-white rounded-4xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-2xl hover:shadow-neutral-900/5 hover:-translate-y-1.5 cursor-pointer transition-all duration-300 group flex flex-col"
                  >
                    <div className="relative">
                      <ShopImage
                        src={shop.image}
                        alt={shop.name}
                        className="h-60"
                      />

                      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                        <span className="bg-white/95 text-neutral-900 text-xs font-black px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />{" "}
                          {shop.rating}
                        </span>
                        <span className="bg-neutral-900 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> 10-15 min
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 relative bg-white">
                      <h2 className="text-2xl font-black text-neutral-900 leading-tight mb-2">
                        {shop.name}
                      </h2>
                      <p className="text-neutral-500 mb-6 line-clamp-2 font-medium flex-1">
                        {shop.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-lg">
                          {shop.items.length} Items
                        </span>
                        <div className="flex items-center text-orange-600 font-black gap-1 group-hover:translate-x-2 transition-transform">
                          Explore <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATE 3: Show Menu Items in Selected Shop */}
        {selectedShop && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredItems?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neutral-900">
                  No items found
                </h3>
                <p className="text-neutral-500 font-medium">
                  Try searching for something else!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems?.map((item) => {
                  const isVeg =
                    item.tags.includes("Veg") || item.tags.includes("Vegan");
                  const isNonVeg = item.tags.includes("Non-Veg");
                  const isBestSeller = item.tags.includes("Best Seller");

                  return (
                    <div
                      key={item._id}
                      className="bg-white p-6 rounded-4xl shadow-sm border border-neutral-100 hover:shadow-xl hover:border-orange-200 transition-all flex flex-col justify-between group relative overflow-hidden"
                    >
                      {isBestSeller && (
                        <div className="absolute -right-12 top-6 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest py-1 px-12 rotate-45 shadow-md z-10">
                          Best Seller
                        </div>
                      )}

                      <div>
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {isVeg && (
                                <div className="w-4 h-4 rounded border-2 border-green-600 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                                </div>
                              )}
                              {isNonVeg && (
                                <div className="w-4 h-4 rounded border-2 border-red-600 flex items-center justify-center">
                                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-[6px] border-l-transparent border-r-transparent border-b-red-600" />
                                </div>
                              )}
                              <span className="text-2xl drop-shadow-sm">
                                {item.emoji}
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-neutral-900 leading-tight pr-6">
                              {item.name}
                            </h3>
                          </div>

                          <span className="font-black text-xl text-neutral-900 shrink-0">
                            ₹{item.price}
                          </span>
                        </div>
                        <p className="text-neutral-500 font-medium mb-5 leading-relaxed text-sm">
                          {item.description}
                        </p>

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                                  tag === "Spicy"
                                    ? "bg-red-50 text-red-600 border-red-100"
                                    : tag === "Sweet"
                                      ? "bg-pink-50 text-pink-600 border-pink-100"
                                      : "bg-neutral-50 text-neutral-600 border-neutral-200"
                                }`}
                              >
                                {tag === "Spicy" && (
                                  <Flame className="w-3 h-3 inline mr-1" />
                                )}
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white py-3.5 rounded-xl font-black transition-all duration-300 flex items-center justify-center gap-2 mt-auto"
                      >
                        <Plus className="w-5 h-5" /> Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
