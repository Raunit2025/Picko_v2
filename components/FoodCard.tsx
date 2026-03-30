"use client";

import { useStore } from '@/store/useStore';
import { Plus, Star, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface FoodProps {
  id: string;
  foodName: string;
  price: number;
  image?: string;
  description: string;
  rating?: number;
}

export default function FoodCard({ id, foodName, price, image, description, rating }: FoodProps) {
  const { addToCart, cart } = useStore();
  const [added, setAdded] = useState(false);

  const inCart = cart.find(i => i.id === id);
  const emoji = foodName.split(' ')[0];
  const hasEmoji = /\p{Emoji}/u.test(emoji) && emoji.length <= 3;

  const handleAdd = () => {
    addToCart({ id, foodName, price, quantity: 1, image: image || '' });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group overflow-hidden">
      {/* Image / Emoji header */}
      {image ? (
        <div className="relative h-40 overflow-hidden bg-gray-50 flex-shrink-0">
          <img
            src={image}
            alt={foodName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-black text-gray-900 shadow-sm">
            ₹{price}
          </div>
          {rating && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-black text-amber-600 shadow-sm">
              <Star size={10} fill="currentColor" /> {rating}
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center flex-shrink-0 group-hover:from-orange-100 transition-colors duration-300">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{hasEmoji ? emoji : '🍽️'}</span>
          {rating && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded-full text-[10px] font-black text-amber-600 shadow-sm">
              <Star size={9} fill="currentColor" /> {rating}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h3 className="text-sm font-black text-gray-900 leading-tight line-clamp-2 flex-1">
            {image ? foodName : (hasEmoji ? foodName.slice(emoji.length).trim() : foodName)}
          </h3>
          {!image && <span className="text-sm font-black text-orange-600 whitespace-nowrap ml-1">₹{price}</span>}
        </div>

        <p className="text-gray-400 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">{description}</p>

        {/* Cart indicator */}
        {inCart && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full w-fit mb-2">
            <ShoppingCart size={9} /> {inCart.quantity} in cart
          </div>
        )}

        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-1.5 font-bold py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-[0.97] text-sm ${
            added
              ? 'bg-green-500 text-white shadow-md shadow-green-400/30'
              : 'bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-100 hover:border-transparent hover:shadow-md hover:shadow-orange-500/25'
          }`}
        >
          {added ? (
            <>✓ Added!</>
          ) : (
            <>
              <Plus size={14} className="transition-transform duration-200 group-hover:rotate-90" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
