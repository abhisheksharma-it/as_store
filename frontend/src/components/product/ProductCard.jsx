// src/components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { formatImageUrl } from '../../utils/formatImageUrl';

export default function ProductCard({ product, isFavourited, onToggleWishlist }) {
  const stockCount = Number(product.stock ?? 0);
  const isOutOfStock = stockCount <= 0;

  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer block">
      <div className="aspect-[3/4] overflow-hidden mb-4 bg-[#111] relative">
        <img
          src={formatImageUrl(product)}
          alt={product.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
            isOutOfStock ? 'opacity-40 grayscale' : 'opacity-90 group-hover:opacity-100'
          }`}
        />

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <span className="absolute top-4 left-4 bg-black/90 border border-white/20 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-neutral-300">
            Sold Out
          </span>
        ) : stockCount <= 5 ? (
          <span className="absolute top-4 left-4 bg-black/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-amber-400">
            Only {stockCount} Left
          </span>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 z-10 p-1 transition-transform duration-200 hover:scale-110"
        >
          <Heart size={20} strokeWidth={1.3} fill={isFavourited ? 'white' : 'none'} className="text-white" />
        </button>

        {/* Hover Action Bar */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <div className="w-full bg-white text-black text-center text-[10px] uppercase tracking-[0.2em] font-bold py-3 hover:bg-neutral-200 transition-colors">
            {isOutOfStock ? 'View Details' : 'Select Size'}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <h2 className="text-[11px] font-light tracking-[0.15em] text-neutral-300 mb-1.5 line-clamp-1 w-full uppercase">
          {product.title}
        </h2>
        <p className="text-xs tracking-wider text-white font-light">
          ₹{Number(product.price || 0).toLocaleString('en-IN')}
        </p>
      </div>
    </Link>
  );
}