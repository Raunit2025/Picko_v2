"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Settings, RefreshCw, ChefHat, ShoppingBag, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

const statusFlow: Record<string, string> = {
  preparing: 'ready',
  ready: 'delivered',
  delivered: 'delivered'
};

export default function OwnerDashboard() {
  const { user, token } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiBase}/orders`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setOrders(data.orders.slice(0, 10)); // show latest 10
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) { router.push('/login'); return; }
    if (user.role !== 'owner/admin') { alert('Unauthorized'); router.push('/'); return; }
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [user, token]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiBase}/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: orders.length,
    preparing: orders.filter(o => o.orderStatus === 'preparing').length,
    ready: orders.filter(o => o.orderStatus === 'ready').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    revenue: orders.reduce((s, o) => s + (o.totalAmount || 0), 0)
  };

  const statusStyle: Record<string, string> = {
    preparing: 'bg-orange-50 text-orange-700 border-orange-200',
    ready: 'bg-blue-50 text-blue-700 border-blue-200',
    delivered: 'bg-green-50 text-green-700 border-green-200'
  };

  const paymentLabel = (o: any) => {
    const m = o.paymentMethod || '';
    if (m === 'gpay') return '🔵 Google Pay';
    if (m === 'phonepe') return '🟣 PhonePe';
    if (m === 'paytm') return '🔷 Paytm';
    if (o.paymentStatus === 'paid') return '💳 Online';
    return '💵 Cash';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <ChefHat className="text-emerald-600" size={28} />
              </div>
              Owner Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">Showing last {orders.length} orders · auto-refreshes every 10s</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl border border-gray-200 shadow-sm text-sm font-bold text-gray-600 hover:text-emerald-600 hover:border-emerald-300 transition-all"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
            { label: 'Preparing', value: stats.preparing, icon: Clock, color: 'text-orange-600 bg-orange-50' },
            { label: 'Ready', value: stats.ready, icon: Settings, color: 'text-sky-600 bg-sky-50' },
            { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
            { label: 'Revenue', value: `₹${stats.revenue.toFixed(0)}`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                  <th className="p-4 border-b">Order ID</th>
                  <th className="p-4 border-b">Customer</th>
                  <th className="p-4 border-b">Items</th>
                  <th className="p-4 border-b">Total</th>
                  <th className="p-4 border-b">Payment</th>
                  <th className="p-4 border-b">ETA</th>
                  <th className="p-4 border-b">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-14 text-center text-gray-400">
                      <ChefHat className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                      No orders in queue right now
                    </td>
                  </tr>
                ) : orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-700 text-xs">
                      #{order._id.slice(-6).toUpperCase()}
                      <p className="text-gray-400 font-normal mt-0.5 text-[11px]">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{order.userId?.name || 'Customer'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.userId?.email || ''}</p>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {order.items.map((it: any, i: number) => (
                          <div key={i} className="flex gap-1.5 text-xs">
                            <span className="font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">{it.quantity}×</span>
                            <span className="text-gray-600 truncate max-w-[140px]">{it.foodName}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-black text-orange-600">₹{order.totalAmount?.toFixed(0)}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {paymentLabel(order)}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-700">
                      {order.estimatedDelivery || 30} min
                    </td>
                    <td className="p-4">
                      {order.orderStatus === 'delivered' ? (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-200">✓ Delivered</span>
                      ) : (
                        <button
                          disabled={updatingId === order._id}
                          onClick={() => updateStatus(order._id, statusFlow[order.orderStatus])}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 disabled:opacity-50 shadow-sm ${
                            order.orderStatus === 'preparing'
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30'
                              : 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/30'
                          }`}
                        >
                          {updatingId === order._id ? '...' : (order.orderStatus === 'preparing' ? 'Mark Ready →' : 'Mark Delivered ✓')}
                        </button>
                      )}
                      <p className={`text-xs mt-1.5 font-bold px-2 py-0.5 rounded-full w-fit ${statusStyle[order.orderStatus]}`}>
                        {order.orderStatus}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <ChefHat className="mx-auto mb-3 text-gray-300" />
                No orders yet
              </div>
            ) : orders.map((order) => (
              <div key={order._id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-gray-700 text-sm">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${statusStyle[order.orderStatus]}`}>{order.orderStatus}</span>
                </div>
                <p className="font-bold text-gray-800">{order.userId?.name || 'Customer'}</p>
                <p className="text-sm text-gray-500">{order.items.map((i: any) => `${i.quantity}× ${i.foodName}`).join(', ')}</p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-orange-600">₹{order.totalAmount?.toFixed(0)}</span>
                  <span className="text-xs text-gray-400">{paymentLabel(order)}</span>
                </div>
                {order.orderStatus !== 'delivered' && (
                  <button
                    disabled={updatingId === order._id}
                    onClick={() => updateStatus(order._id, statusFlow[order.orderStatus])}
                    className="w-full py-2 rounded-xl text-sm font-black bg-orange-600 text-white hover:bg-orange-700 transition-colors active:scale-95 disabled:opacity-50"
                  >
                    {order.orderStatus === 'preparing' ? 'Mark Ready →' : 'Mark Delivered ✓'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
