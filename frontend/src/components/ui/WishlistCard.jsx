// src/components/ui/WishlistCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatImageUrl } from '../../utils/formatImageUrl';

const PLACEHOLDER_IMG =
  'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600';

export default function WishlistCard({ item, isFavourited = true, onToggle }) {
  const navigate = useNavigate();
  if (!item) return null;

  // Nested wishlist object (item.product) aur direct product object dono ko support karega
  const productObj = typeof item.product === 'object' && item.product !== null ? item.product : item;
  const productId = productObj.id || item.product || item.id;
  const title = productObj.title || item.product_title || 'Untitled Piece';
  const price = productObj.price ?? item.product_price ?? 0;
  const stock = Number(productObj.stock ?? 1);
  const isOutOfStock = stock <= 0;
  const imageUrl = formatImageUrl(productObj) || item.product_image || PLACEHOLDER_IMG;

  return (
    <div className="group relative flex flex-col">
      <Link to={`/product/${productId}`} className="block">
        <div className="relative aspect-[3/4] bg-[#111] overflow-hidden mb-3">
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out ${
              isOutOfStock ? 'opacity-40 grayscale' : 'opacity-90 group-hover:opacity-100'
            }`}
          />

          {isOutOfStock && (
            <span className="absolute top-4 left-4 bg-black/90 border border-white/20 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-neutral-300">
              Out of Stock
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle(productId);
            }}
            className="absolute top-4 right-4 z-10 p-1 transition-transform duration-200 hover:scale-110"
          >
            <Heart
              size={20}
              fill={isFavourited ? 'white' : 'none'}
              strokeWidth={1.4}
              className="text-white"
            />
          </button>
        </div>

        <div className="flex flex-col items-start mb-3">
          <h3 className="text-[11px] font-light text-neutral-300 uppercase tracking-[0.15em] truncate w-full mb-1">
            {title}
          </h3>
          <p className="text-xs font-light tracking-wider text-white">
            ₹{Number(String(price).replace(/,/g, '') || 0).toLocaleString('en-IN')}
          </p>
        </div>
      </Link>

      <button
        type="button"
        disabled={isOutOfStock}
        onClick={() => navigate(`/product/${productId}`)}
        className={`w-full py-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] border flex items-center justify-center gap-2 transition-colors ${
          isOutOfStock
            ? 'border-[#222] bg-[#111] text-neutral-600 cursor-not-allowed'
            : 'border-white/30 bg-transparent text-white hover:bg-white hover:text-black'
        }`}
      >
        <ShoppingBag size={13} strokeWidth={1.5} />
        {isOutOfStock ? 'Unavailable' : 'Move to Bag'}
      </button>
    </div>
  );
}