"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  X,
  Minus,
  Plus,
  Trash2,
  Loader2,
  Banknote,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";

// Inform TypeScript about the globally injected Razorpay object
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function CartDrawer() {
  const router = useRouter();

  const user = useStore((state) => state.user);
  const cart = useStore((state) => state.cart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const getCartTotal = useStore((state) => state.getCartTotal);
  const clearCart = useStore((state) => state.clearCart);
  const isCartOpen = useStore((state) => state.isCartOpen);
  const closeCart = useStore((state) => state.closeCart);
  const _hasHydrated = useStore((state) => state._hasHydrated);

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!_hasHydrated) return null;

  // Utility to dynamically load the Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // The actual database submission (used for both Cash and successful Online payments)
  const submitFinalOrderToDB = async (status: "pending" | "paid") => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            foodName: item.foodName,
            quantity: item.quantity,
          })),
          paymentMethod,
          paymentStatus: status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      clearCart();
      closeCart();

      // Trigger the success toast before routing
      toast.success("Order placed successfully!");

      router.push("/orders");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setError("");

    if (paymentMethod === "cash") {
      // Direct submission for Cash on Delivery
      await submitFinalOrderToDB("pending");
      return;
    }

    // --- ONLINE PAYMENT FLOW ---
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load Razorpay SDK. Check your connection.");
      }

      const totalAmount = getCartTotal();

      // 1. Get Razorpay Order ID from our backend
      const rzpOrderRes = await fetch("/api/orders/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const orderData = await rzpOrderRes.json();
      if (!rzpOrderRes.ok) throw new Error(orderData.error);

      // 2. Configure Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Picko Campus Delivery",
        description: "Food Order Payment",
        order_id: orderData.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#ea580c", // matches tailwind orange-600
        },
        // Removed unused response variable and any type
        handler: async function () {
          // 3. On Success Callback: Submit to DB
          await submitFinalOrderToDB("paid");
        },
      };

      // Open the modal
      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function () {
        setError("Payment failed or was cancelled. Please try again.");
        setIsSubmitting(false);
      });

      paymentObject.open();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Payment initialization failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-60 transition-opacity duration-300 ${
        isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-100 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-neutral-900">Your Cart</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-3">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 pb-6 border-b border-neutral-100 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-neutral-900 leading-tight pr-4">
                    {item.foodName}
                  </h3>
                  <span className="font-bold text-neutral-900 shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 bg-neutral-50 rounded-lg p-1 border border-neutral-200">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-neutral-500 hover:text-black hover:bg-white rounded shadow-sm transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-neutral-500 hover:text-black hover:bg-white rounded shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-neutral-100 bg-neutral-50 p-6 space-y-4 shrink-0">
            <div className="grid grid-cols-2 gap-3 bg-neutral-200/50 p-1 rounded-xl">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  paymentMethod === "cash"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <Banknote className="w-4 h-4" /> Cash
              </button>
              <button
                onClick={() => setPaymentMethod("online")}
                className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  paymentMethod === "online"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <CreditCard className="w-4 h-4" /> Online
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            <div className="flex justify-between items-center pb-2">
              <span className="text-neutral-500 font-medium">Total Amount</span>
              <span className="text-2xl font-black text-orange-600">
                ₹{getCartTotal()}
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold transition-all flex justify-center items-center shadow-lg shadow-orange-600/20 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                `Place Order • ₹${getCartTotal()}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
