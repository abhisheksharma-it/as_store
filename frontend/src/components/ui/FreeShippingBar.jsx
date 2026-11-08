// src/components/ui/FreeShippingBar.jsx
import React from 'react';
import { Truck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants';

export default function FreeShippingBar({ subtotal = 0, threshold = FREE_SHIPPING_THRESHOLD }) {
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="border-b border-[#222] bg-[#0a0a0a] px-6 py-4">
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
        <span className="flex items-center gap-2 text-neutral-300">
          <Truck size={13} strokeWidth={1.5} className={remaining === 0 ? 'text-emerald-400' : 'text-white'} />
          {remaining === 0 ? (
            <span className="text-emerald-400 font-medium">Unlocked Free Standard Delivery</span>
          ) : (
            <>
              Add <span className="text-white font-medium">₹{remaining.toLocaleString('en-IN')}</span> more for Free Delivery
            </>
          )}
        </span>
        <span className="text-neutral-500">{progress}%</span>
      </div>

      <div className="h-1 w-full bg-[#222] overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            remaining === 0 ? 'bg-emerald-400' : 'bg-white'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}