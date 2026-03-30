"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Clock, CheckCircle2, Package, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
        const res = await fetch(`${apiBase}/orders`);
        const data = await res.json();
        
        if (res.ok) {
          setOrders(data.orders);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'preparing': return <Clock className="text-orange-500 animate-[spin_3s_linear_infinite]" size={20} />;
      case 'ready': return <Package className="text-blue-500 animate-bounce" size={20} />;
      case 'delivered': return <CheckCircle2 className="text-green-500" size={20} />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'preparing': return 'bg-orange-50 text-orange-700 border-orange-200 shadow-sm shadow-orange-100';
      case 'ready': return 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-100';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getTimeLeft = (createdAt: string, estimatedDelivery = 30) => {
    const orderTime = new Date(createdAt).getTime();
    const diff = (orderTime + estimatedDelivery * 60000) - now;
    if (diff <= 0) return 'Almost ready!';
    return `${Math.ceil(diff / 60000)} min left`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-orange-100">
            <Package className="text-orange-600" size={32} />
          </div>
          Your Order History
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No orders yet</h3>
            <p className="text-gray-500 text-lg mb-8">Looks like you haven't ordered anything delicious yet.</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-orange-600 text-white hover:bg-orange-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Start Ordering Now
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, idx) => (
              <div 
                key={order._id} 
                className="bg-white rounded-[2rem] p-6 md:p-8 shadow-md shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-orange-100/50 hover:-translate-y-1 transition-all duration-500 animate-[fadeInUp_0.6s_ease-out_both]"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 mb-5 gap-4">
                  <div>
                    <p className="text-sm font-black text-orange-600 tracking-wider mb-1 uppercase">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Clock size={14} />
                      {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    {order.orderStatus === 'preparing' && (
                      <p className="text-sm font-bold text-orange-500 mt-2 bg-orange-50 w-fit px-3 py-1 rounded-full border border-orange-100 shadow-sm">
                        ⏳ Prep time: {getTimeLeft(order.createdAt, order.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border font-bold capitalize w-fit transition-colors duration-300 ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </div>
                    
                    <div className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {order.paymentStatus === 'paid' ? 'Paid Online' : 'Cash on Delivery'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border shadow-sm">
                          {item.quantity}x
                        </span>
                        <span className="font-semibold text-gray-800">{item.foodName}</span>
                      </div>
                      <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t flex justify-between items-center text-lg">
                  <span className="font-medium text-gray-500">Total Amount</span>
                  <span className="font-black text-2xl text-orange-600">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
