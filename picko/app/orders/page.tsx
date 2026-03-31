"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { Loader2, Package, Clock, ChefHat, CheckCircle2, ArrowRight, ReceiptText, IndianRupee } from "lucide-react";

interface OrderItem {
  _id: string;
  foodName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: "preparing" | "ready" | "delivered";
  paymentMethod: "cash" | "online";
  paymentStatus: "pending" | "paid";
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const _hasHydrated = useStore((state) => state._hasHydrated);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (_hasHydrated && user?.role === "owner/admin") {
      router.push("/owner");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError("Could not load your orders. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (_hasHydrated && user) {
      fetchOrders();
    }
  }, [_hasHydrated, user, router]);

  // Helper for the visual progress bar
  const getStepStatus = (currentStatus: Order["orderStatus"], step: Order["orderStatus"]) => {
    const statuses = ["preparing", "ready", "delivered"];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50/30">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50/30 to-rose-50/20 pb-20 relative">
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-orange-100/50 to-transparent -z-10 pointer-events-none" />

      {/* Header Area */}
      <div className="bg-white/80 backdrop-blur-md border-b border-orange-100 pt-8 pb-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-14 h-14 bg-linear-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
            <ReceiptText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">My Orders</h1>
            <p className="text-orange-900/60 font-medium mt-1">Track your past and present cravings.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8 relative z-10">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center border border-red-100 shadow-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && orders.length === 0 && !error && (
          <div className="bg-white rounded-3xl border border-orange-100 p-16 text-center flex flex-col items-center shadow-md shadow-orange-500/5 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-orange-300" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 mb-2">No orders yet</h2>
            <p className="text-neutral-500 font-medium mb-8">Looks like you haven&apos;t placed any orders. Let&apos;s fix that!</p>
            <button
              onClick={() => router.push("/menu")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-orange-600/20 hover:-translate-y-1 flex items-center gap-2"
            >
              Browse Menu <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => {
            const orderDate = new Date(order.createdAt);
            
            return (
              <div 
                key={order._id} 
                className="bg-white rounded-3xl border border-orange-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Visual Progress Bar */}
                <div className="p-6 bg-linear-to-r from-orange-50/50 to-rose-50/50 border-b border-orange-100">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-xs font-black text-orange-600 uppercase tracking-widest bg-orange-100 px-3 py-1.5 rounded-lg">
                        Order #{order._id.slice(-6)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium">
                      {orderDate.toLocaleDateString()} • {orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="relative flex justify-between items-center px-2 sm:px-8">
                    {/* Connecting Line */}
                    <div className="absolute left-6 sm:left-12 right-6 sm:right-12 top-1/2 -translate-y-1/2 h-1 bg-neutral-100 rounded-full z-0" />
                    
                    {/* Step 1: Preparing */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                        getStepStatus(order.orderStatus, "preparing") === "active" 
                          ? "bg-blue-600 border-blue-100 text-white shadow-lg shadow-blue-600/30" 
                          : getStepStatus(order.orderStatus, "preparing") === "completed"
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-neutral-200 text-neutral-300"
                      }`}>
                        <ChefHat className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold uppercase ${
                        getStepStatus(order.orderStatus, "preparing") !== "pending" ? "text-neutral-900" : "text-neutral-400"
                      }`}>Preparing</span>
                    </div>

                    {/* Step 2: Ready */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                        getStepStatus(order.orderStatus, "ready") === "active" 
                          ? "bg-orange-500 border-orange-100 text-white shadow-lg shadow-orange-500/30" 
                          : getStepStatus(order.orderStatus, "ready") === "completed"
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "bg-white border-neutral-200 text-neutral-300"
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold uppercase ${
                        getStepStatus(order.orderStatus, "ready") !== "pending" ? "text-neutral-900" : "text-neutral-400"
                      }`}>Ready</span>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                        getStepStatus(order.orderStatus, "delivered") === "active" 
                          ? "bg-green-500 border-green-100 text-white shadow-lg shadow-green-500/30" 
                          : getStepStatus(order.orderStatus, "delivered") === "completed"
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-neutral-200 text-neutral-300"
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold uppercase ${
                        getStepStatus(order.orderStatus, "delivered") !== "pending" ? "text-neutral-900" : "text-neutral-400"
                      }`}>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Receipt Items Area */}
                <div className="p-6 bg-white">
                  <ul className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <li key={item._id} className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <span className="w-7 h-7 bg-orange-50 text-orange-600 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border border-orange-100">
                            {item.quantity}x
                          </span>
                          <span className="font-bold text-neutral-800 pt-0.5">{item.foodName}</span>
                        </div>
                        <span className="text-neutral-600 font-bold pt-0.5 whitespace-nowrap">
                          ₹{item.price * item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Dashed line to simulate a receipt */}
                  <div className="w-full border-t-2 border-dashed border-neutral-200 my-6" />

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-neutral-500 font-medium mb-1">Total Paid</p>
                      <p className="text-3xl font-black text-neutral-900 flex items-center">
                        <IndianRupee className="w-6 h-6 mr-1" />{order.totalAmount}
                      </p>
                    </div>
                    
                    {/* Payment Info */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Method:</span>
                        <span className="text-sm font-black text-neutral-900 capitalize">{order.paymentMethod}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase ${
                        order.paymentStatus === "paid" 
                          ? "bg-green-100 text-green-700 border border-green-200" 
                          : "bg-orange-100 text-orange-700 border border-orange-200"
                      }`}>
                        {order.paymentStatus === "paid" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}