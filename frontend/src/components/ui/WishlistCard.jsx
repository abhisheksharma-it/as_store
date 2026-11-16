// src/components/ui/WishlistCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

// Safe image formatter explicitly handling empty strings
const PLACEHOLDER = "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=800";

const formatImageUrl = (rawImage) => {
  if (!rawImage) return PLACEHOLDER;
  const imgStr = typeof rawImage === 'string' ? rawImage : (rawImage.image_url || rawImage.image || "");
  if (!imgStr || !imgStr.trim()) return PLACEHOLDER;
  if (imgStr.startsWith('http')) return imgStr;
  if (imgStr.startsWith('/')) return `http://127.0.0.1:8000${imgStr}`;
  return `http://127.0.0.1:8000/media/${imgStr}`;
};

export default function WishlistCard({ item, isFavourited, onToggle }) {
  const navigate = useNavigate();
  const { addToCart, fetchCart } = useCartStore();

  // Exact ID Extraction
  const productId = item.product || item.id;

  // Exact Name & Price Extraction
  const title = item.product_title || item.title || item.name || 'A&S PIECE';
  const price = Number(item.product_price || item.price || 0);

  // Robust Image Extraction handling all potential serializer outputs
  const rawImage =
    item.product_image ||
    item.image_url ||
    item.image ||
    item.gallery_images?.[0]?.image ||
    item.gallery_images?.[0];

  const imageUrl = formatImageUrl(rawImage);

  const handleMoveToBag = async () => {
    if (!productId) return;
    
    const cartPayload = {
      id: productId,
      product_id: productId,
      title,
      price,
      image: imageUrl,
      stock: item.stock ?? 10,
    };

    // Add to cart with default size 'M'
    await addToCart(cartPayload, 1, "M");
    if (fetchCart) await fetchCart();
    
    // Automatically remove from Favourites upon moving to bag
    if (isFavourited && onToggle) {
      onToggle(productId); 
    }
    
    navigate('/cart');
  };

  return (
    <div className="group relative flex flex-col bg-black">
      {/* --- IMAGE & HEART SECTION --- */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#111]">
        <Link to={`/product/${productId}`}>
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (onToggle) onToggle(productId);
          }}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 backdrop-blur-xs transition-all hover:bg-white hover:text-black group/btn"
        >
          <Heart
            size={14}
            className={`transition-colors ${
              isFavourited
                ? "fill-white stroke-white group-hover/btn:fill-black group-hover/btn:stroke-black"
                : "stroke-white group-hover/btn:stroke-black"
            }`}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* --- DETAILS & BAG BUTTON --- */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <Link to={`/product/${productId}`}>
            <h3 className="truncate text-[10px] uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:text-white">
              {title}
            </h3>
          </Link>
          <p className="mt-2 text-xs font-light tracking-wider text-white">
            ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <button
          onClick={handleMoveToBag}
          className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 border border-white/25 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
        >
          <ShoppingBag size={13} strokeWidth={1.5} />
          Move to Bag
        </button>
      </div>
    </div>
  );
}