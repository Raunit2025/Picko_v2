import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, CreditCard, MapPin, ChefHat, Bike, Utensils, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-orange-200">
      
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden bg-linear-to-br from-orange-50 via-amber-50/30 to-rose-50/20 pt-24 pb-32 border-b border-orange-100">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Text & CTAs */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold text-sm mb-6 border border-orange-200 shadow-sm">
                <Star className="w-4 h-4 fill-orange-500 text-orange-500" /> 
                #1 Food Delivery at LPU
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tight mb-6 leading-[1.1]">
                Campus food, <br/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-500">
                  delivered fast.
                </span>
              </h1>
              
              <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Skip the long queues at the food court. Get your favorite meals, snacks, and coffees delivered directly to your hostel or department block in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  href="/menu"
                  className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-600/30 hover:-translate-y-1"
                >
                  Order Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/login"
                  className="w-full sm:w-auto bg-white hover:bg-orange-50 text-neutral-900 border-2 border-orange-100 hover:border-orange-200 px-8 py-4 rounded-full font-bold text-lg transition-all text-center shadow-sm"
                >
                  Partner Sign In
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-neutral-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-neutral-900">5k+</span> Students
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-neutral-900">15+</span> Food Courts
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="relative hidden lg:block h-125 w-full animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full" />
              <Image 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                alt="Delicious Burger"
                fill
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                priority
              />
              
              {/* Floating Badge */}
              <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl shadow-orange-900/10 border border-orange-100 animate-bounce delay-1000">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-2xl">🔥</div>
                  <div>
                    <p className="text-xs text-neutral-500 font-bold uppercase">Hot & Fresh</p>
                    <p className="text-sm font-black text-neutral-900">Prepared in 10 mins</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS SECTION --- */}
      <div className="py-24 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-neutral-900 mb-4">How Picko Works</h2>
            <p className="text-lg text-neutral-500 font-medium">Three simple steps to satisfy your cravings without leaving your study desk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-orange-200 z-0" />

            <div className="relative z-10 text-center bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
              <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
                <Utensils className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">1. Browse Menus</h3>
              <p className="text-neutral-500 font-medium">Explore live menus from all across the campus. Prices exactly the same as dining in.</p>
            </div>

            <div className="relative z-10 text-center bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
              <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
                <ChefHat className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">2. Shops Prepare</h3>
              <p className="text-neutral-500 font-medium">Your order goes straight to the kitchen. Pay securely online or choose cash on delivery.</p>
            </div>

            <div className="relative z-10 text-center bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
                <Bike className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">3. Fast Delivery</h3>
              <p className="text-neutral-500 font-medium">Our campus runners pick it up hot and drop it right at your specified location.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex gap-5">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Lightning Fast</h3>
                <p className="text-neutral-500 font-medium leading-relaxed">No more waiting between lectures. Hot food delivered before your next class starts.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Anywhere on Campus</h3>
                <p className="text-neutral-500 font-medium leading-relaxed">From the Main Block to the furthest hostel wings, we have got the entire campus covered.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0 border border-green-100">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Cash or Online</h3>
                <p className="text-neutral-500 font-medium leading-relaxed">Pay securely via Razorpay, UPI, or just select cash on delivery. Total flexibility.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA / FOOTER --- */}
      <footer className="bg-neutral-950 pt-20 pb-10 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Hungry yet?</h2>
          <p className="text-neutral-400 font-medium text-lg mb-10 max-w-xl mx-auto">
            Join thousands of other students who have switched to Picko. Your first bite is just a few clicks away.
          </p>
          <Link 
            href="/menu"
            className="inline-flex bg-orange-600 hover:bg-orange-500 text-white px-10 py-5 rounded-full font-bold text-xl transition-all items-center justify-center gap-2 shadow-xl shadow-orange-600/20"
          >
            Explore the Menu <ArrowRight className="w-6 h-6" />
          </Link>

          <div className="mt-20 pt-10 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Utensils className="text-white w-5 h-5" />
              </div>
              Picko
            </div>
            <p className="text-neutral-500 text-sm font-medium">
              © {new Date().getFullYear()} Picko Campus Delivery. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}