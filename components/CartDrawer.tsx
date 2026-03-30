"use client";

import { useStore } from '@/store/useStore';
import { ShoppingCart, X, Plus, Minus, Trash, CreditCard, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type PaymentMethod = 'gpay' | 'phonepe' | 'paytm' | 'cash';

const UPI_OPTIONS: { id: PaymentMethod; label: string; emoji: string; color: string }[] = [
  { id: 'gpay',    label: 'Google Pay',  emoji: '🔵', color: 'border-blue-400 bg-blue-50 text-blue-700'    },
  { id: 'phonepe', label: 'PhonePe',     emoji: '🟣', color: 'border-purple-400 bg-purple-50 text-purple-700' },
  { id: 'paytm',   label: 'Paytm',       emoji: '🔷', color: 'border-sky-400 bg-sky-50 text-sky-700'       },
  { id: 'cash',    label: 'Cash',        emoji: '💵', color: 'border-green-400 bg-green-50 text-green-700'  },
];

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, getCartTotal, user, clearCart } = useStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gpay');
  const [deliveryTime, setDeliveryTime] = useState(30);

  const total = getCartTotal();

  const readyTime = () => {
    const t = new Date(Date.now() + deliveryTime * 60000);
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login first to proceed to checkout.');
      router.push('/login');
      onClose();
      return;
    }

    try {
      setIsProcessing(true);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';

      // ── Cash → instant order (no payment gateway) ───────────────────────
      if (paymentMethod === 'cash') {
        const res = await fetch(`${apiBase}/payment/cash`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            items: cart,
            totalAmount: total,
            deliveryMinutes: deliveryTime,
            paymentMethod: 'cash'
          })
        });

        if (res.ok) {
          clearCart();
          onClose();
          router.push('/orders');
        } else {
          alert('Failed to place order. Please try again.');
        }
        return;
      }

      // ── UPI / Card → Razorpay modal ──────────────────────────────────────
      const res = await fetch(`${apiBase}/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total * 100 })
      });
      if (!res.ok) throw new Error('Failed to create order');

      const { orderId, amount, currency } = await res.json();

      if (!(window as any).Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // Map our UPI choices to Razorpay's method/flow
      const upiAppMap: Record<string, string> = {
        gpay: 'google_pay',
        phonepe: 'phonepe',
        paytm: 'paytm',
      };

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SVkuXtOh0fr2yT',
        amount,
        currency,
        name: 'Picko Food Delivery',
        description: `Order via ${paymentMethod === 'gpay' ? 'Google Pay' : paymentMethod === 'phonepe' ? 'PhonePe' : 'Paytm'}`,
        order_id: orderId,
        // Pre-select UPI method so the correct app tab loads first
        method: {
          upi: true,
          card: paymentMethod === 'gpay', // GPay supports card too
          netbanking: false,
          wallet: paymentMethod === 'paytm',
        },
        config: {
          display: {
            blocks: {
              utib: {
                name: 'Pay via UPI',
                instruments: [{ method: 'upi', flows: ['qr', 'collect'], apps: [upiAppMap[paymentMethod] || 'google_pay'] }]
              }
            },
            sequence: ['block.utib'],
            preferences: { show_default_blocks: false },
          }
        },
        handler: async function (response: any) {
          const verifyRes = await fetch(`${apiBase}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              items: cart,
              totalAmount: total,
              deliveryMinutes: deliveryTime,
              paymentMethod
            })
          });
          if (verifyRes.ok) {
            clearCart();
            onClose();
            router.push('/orders');
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#ea580c' }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (r: any) => alert(r.error.description));
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col text-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-black flex items-center gap-2">
            <ShoppingCart className="text-orange-500" size={22} />
            Your Cart
            {cart.length > 0 && (
              <span className="bg-orange-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">{cart.length}</span>
            )}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-3 py-16">
              <ShoppingCart size={56} className="text-gray-200" />
              <p className="font-bold text-gray-500">Your cart is empty</p>
              <p className="text-sm">Browse our food courts and add some items!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                {item.image && (
                  <img src={item.image} alt={item.foodName} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{item.foodName}</h3>
                  <p className="text-orange-600 font-black text-sm">₹{item.price.toFixed(0)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-0.5 hover:text-orange-600 disabled:opacity-30 transition-colors">
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-0.5 hover:text-orange-600 transition-colors">
                        <Plus size={13} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors">
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
                <span className="font-black text-gray-900 text-sm whitespace-nowrap self-center">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 space-y-5">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Subtotal</span>
              <span className="font-black text-xl text-gray-900">₹{total.toFixed(0)}</span>
            </div>

            {/* ── Delivery Time Slider ─────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 border border-orange-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                  <Clock size={16} className="text-orange-500" />
                  Delivery Time
                </div>
                <div className="text-right">
                  <span className="text-orange-600 font-black text-lg">{deliveryTime} min</span>
                  <p className="text-xs text-gray-400">Ready by {readyTime()}</p>
                </div>
              </div>
              <input
                type="range"
                min={25}
                max={120}
                step={5}
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>25 min</span>
                <span>120 min</span>
              </div>
            </div>

            {/* ── Payment Method ─────────────────────────────────── */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Payment Method</p>
              <div className="grid grid-cols-2 gap-2">
                {UPI_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border-2 font-bold cursor-pointer transition-all text-sm ${
                      paymentMethod === opt.id
                        ? opt.color + ' ring-2 ring-offset-1 ring-current/30'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <input type="radio" name="payment" value={opt.id} checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="sr-only" />
                    <span className="text-base">{opt.emoji}</span>
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-base"
            >
              {isProcessing ? (
                <><span className="animate-spin inline-block border-2 border-white/30 border-t-white rounded-full w-5 h-5" /> Processing...</>
              ) : (
                <><CreditCard size={18} /> Confirm & Place Order</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
