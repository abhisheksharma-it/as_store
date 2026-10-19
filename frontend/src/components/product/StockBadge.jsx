// src/components/product/StockBadge.jsx
import React from 'react';

export default function StockBadge({ stock }) {
  const count = Number(stock ?? 0);

  if (count <= 0) {
    return (
      <div className="inline-flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-red-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        Out of Stock
      </div>
    );
  }

  if (count <= 5) {
    return (
      <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
        Low Stock — Only {count} Left
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 text-[10px] font-light uppercase tracking-[0.2em] text-neutral-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      In Stock ({count} Available)
    </div>
  );
}