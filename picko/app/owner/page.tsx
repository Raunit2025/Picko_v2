"use client";

import { useEffect, useState, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { Loader2, TrendingUp, Package, Clock, CheckCircle2, RefreshCw, IndianRupee } from "lucide-react";

// Strictly type the populated order from our backend
interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

interface OrderItem {
  _id: string;
  foodName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: PopulatedUser;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: "preparing" | "ready" | "delivered";
  paymentMethod: "cash" | "online";
  paymentStatus: "pending" | "paid";
  createdAt: string;
}

// 1. New strict interface to replace 'any'
interface UpdatePayload {
  orderStatus: string;
  paymentStatus?: string;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const _hasHydrated = useStore((state) => state._hasHydrated);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError("Failed to load dashboard data.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Hydration and Access Control
  useEffect(() => {
    if (_hasHydrated) {
      if (user?.role !== "owner/admin") {
        router.push("/");
        return;
      }
      fetchOrders();
    }
  }, [_hasHydrated, user, router, fetchOrders]);

  // Auto-polling every 10 seconds
  useEffect(() => {
    if (!_hasHydrated || user?.role !== "owner/admin") return;
    
    const intervalId = setInterval(() => {
      fetchOrders(true);
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [_hasHydrated, user, fetchOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: string, newPaymentStatus?: string) => {
    try {
      // 2. Applied the strict payload type here
      const payload: UpdatePayload = { orderStatus: newStatus };
      if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update order");
      
      // Optimistic UI update
      setOrders((prev) => 
        prev.map((order) => 
          order._id === orderId 
            ? { ...order, orderStatus: newStatus as Order["orderStatus"], paymentStatus: newPaymentStatus ? (newPaymentStatus as Order["paymentStatus"]) : order.paymentStatus } 
            : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  // Calculate Statistics
  const today = new Date().toDateString();
  const todaysOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const totalRevenue = todaysOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrders = orders.filter(o => o.orderStatus !== "delivered").length;

  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      
      {/* Dashboard Header */}
      <div className="bg-white border-b border-neutral-200 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Owner Dashboard</h1>
            <p className="text-neutral-500 font-medium mt-1">Manage your campus food operations.</p>
          </div>
          <button 
            onClick={() => fetchOrders(true)}
            className="flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors w-fit"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              {/* 3. Escaped the apostrophe here */}
              <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Today&apos;s Revenue</p>
              <h3 className="text-2xl font-black text-neutral-900 flex items-center">
                <IndianRupee className="w-5 h-5 mr-1" />{totalRevenue}
              </h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              {/* 4. Escaped the apostrophe here */}
              <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Today&apos;s Orders</p>
              <h3 className="text-2xl font-black text-neutral-900">{todaysOrders.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Active Orders</p>
              <h3 className="text-2xl font-black text-neutral-900">{activeOrders}</h3>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        {/* Orders Table/List */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
            <h2 className="text-lg font-bold text-neutral-900">Recent Orders</h2>
          </div>
          
          {orders.length === 0 ? (
             <div className="p-10 text-center text-neutral-500 font-medium">No orders found.</div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <div key={order._id} className="p-6 flex flex-col lg:flex-row gap-6 justify-between lg:items-center hover:bg-neutral-50/50 transition-colors">
                  
                  {/* Customer Info & Items */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-neutral-900 text-white text-xs font-bold px-2 py-1 rounded">
                        #{order._id.slice(-5)}
                      </span>
                      <span className="font-bold text-neutral-900">{order.userId?.name || "Unknown User"}</span>
                      <span className="text-sm text-neutral-500 font-medium">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    <p className="text-neutral-600 text-sm mb-2">
                      {order.items.map(i => `${i.quantity}x ${i.foodName}`).join(", ")}
                    </p>

                    <div className="flex items-center gap-4 text-sm font-medium">
                      <span className="text-orange-600 font-black flex items-center">
                         <IndianRupee className="w-3.5 h-3.5 mr-0.5" />{order.totalAmount}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-600 capitalize">Payment: {order.paymentMethod}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 shrink-0 bg-neutral-50 p-2 rounded-xl border border-neutral-200">
                    <button
                      onClick={() => updateOrderStatus(order._id, "preparing")}
                      disabled={order.orderStatus === "preparing"}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        order.orderStatus === "preparing" 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                          : "text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      Preparing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, "ready")}
                      disabled={order.orderStatus === "ready"}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        order.orderStatus === "ready" 
                          ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" 
                          : "text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      Ready
                    </button>
                    <button
                      onClick={() => {
                        // If they pay cash on delivery, mark as paid when delivered
                        if (order.paymentMethod === "cash" && order.paymentStatus === "pending") {
                          updateOrderStatus(order._id, "delivered", "paid");
                        } else {
                          updateOrderStatus(order._id, "delivered");
                        }
                      }}
                      disabled={order.orderStatus === "delivered"}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                        order.orderStatus === "delivered" 
                          ? "bg-green-600 text-white shadow-md shadow-green-600/20" 
                          : "text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Delivered
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}