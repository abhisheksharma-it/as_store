// src/components/ui/CartItemRow.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatImageUrl } from '../../utils/formatImageUrl';

export default function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  const prod = item.product || item;
  const price = Number(prod.price || 0);
  const qty = Number(item.quantity || 1);
  const maxStock = Number(prod.stock ?? 10);
  const isAtMaxStock = qty >= maxStock;

  const rawSize = item.size;
  const displaySize = item.size || 'Standard';
  const artNo = prod.id?.toString().padStart(6, '0') || '000000';
  const color = prod.color_name || 'Standard';

  return (
    <div className="flex gap-5 border-b border-[#222] pb-8 relative">
      <Link to={`/product/${prod.id}`} className="w-[115px] shrink-0 aspect-[3/4] bg-[#111] overflow-hidden">
        <img
          src={formatImageUrl(prod) || item.image}
          alt={prod.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="flex flex-col flex-grow py-0.5">
        <div className="flex justify-between items-start pr-8">
          <Link to={`/product/${prod.id}`} className="hover:text-neutral-400 transition-colors">
            <h2 className="text-xs font-light uppercase tracking-[0.2em] leading-relaxed text-white">
              {prod.title}
            </h2>
          </Link>
          <p className="text-xs tracking-wider text-white font-medium">
            ₹{(price * qty).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="mt-3 space-y-1.5 text-[10px] text-neutral-500 uppercase tracking-[0.2em]">
          <p>Art. No.: <span className="text-neutral-300 ml-1">{artNo}</span></p>
          <p>Colour: <span className="text-neutral-300 ml-1">{color}</span></p>
          <p>Size: <span className="text-neutral-300 ml-1">{displaySize}</span></p>
        </div>

        <div className="mt-auto pt-5 flex flex-wrap items-center gap-4">
          <div className="flex items-center border border-[#333] bg-[#0a0a0a] px-2.5 py-1">
            <button
              type="button"
              onClick={() => onUpdateQuantity(prod.id, Math.max(1, qty - 1), rawSize)}
              disabled={qty <= 1}
              className="text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-1"
            >
              <Minus size={13} strokeWidth={1.2} />
            </button>
            <span className="text-xs tracking-widest w-8 text-center text-white">{qty}</span>
            <button
              type="button"
              onClick={() => !isAtMaxStock && onUpdateQuantity(prod.id, qty + 1, rawSize)}
              disabled={isAtMaxStock}
              className="text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-1"
            >
              <Plus size={13} strokeWidth={1.2} />
            </button>
          </div>

          {isAtMaxStock && (
            <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400">
              Max Stock ({maxStock}) Reached
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(prod.id)}
          className="absolute top-0 right-0 text-neutral-500 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 size={16} strokeWidth={1.3} />
        </button>
      </div>
    </div>
  );
}