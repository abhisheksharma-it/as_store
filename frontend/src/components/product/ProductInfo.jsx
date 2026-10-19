// src/components/product/ProductInfo.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import StockBadge from './StockBadge';
import ProductAccordion from './ProductAccordion';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function ProductInfo({
  product,
  displayImages,
  formatImageUrl,
  selectedSize,
  setSelectedSize,
  isWishlisted,
  toggleWishlist,
  handleAddToBag,
}) {
  const stockCount = Number(product.stock ?? 0);
  const isOutOfStock = stockCount <= 0;

  const accordionItems = [
    { id: 'description', title: 'Description & Fit', content: product.description_and_fit || product.description },
    { id: 'materials', title: 'Materials', content: product.materials },
    { id: 'delivery', title: 'Delivery & Payment', content: product.delivery_and_payment || 'Free standard delivery on orders over ₹1,999. Easy 15-day returns.' },
  ];

  return (
    <aside className="w-full lg:w-[40%] lg:sticky lg:top-24 lg:self-start lg:pr-8">
      <div className="mb-2 flex items-start justify-between gap-4">
        <h1 className="pr-4 text-sm font-light uppercase leading-relaxed tracking-[0.2em] text-white">
          {product.title}
          {product.is_new && <span className="ml-2 align-top text-[9px] font-bold text-neutral-400">*NEW</span>}
        </h1>
        <button
          onClick={() => toggleWishlist(product.id)}
          className="mt-1 shrink-0 p-1 transition-transform hover:scale-110"
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-white stroke-white' : 'stroke-white'}`} strokeWidth={1.2} />
        </button>
      </div>

      <div className="mb-6 mt-4">
        <p className="text-sm font-light tracking-wider text-white">
          ₹{Number(product.price || 0).toLocaleString('en-IN')}
        </p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-neutral-500">MRP inclusive of all taxes</p>
      </div>

      <div className="mb-8 border-t border-white/20 pt-6">
        <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          Colour: <span className="ml-1 text-white">{product.color_name || 'Standard'}</span>
        </p>
        {displayImages?.[0] && (
          <div className="h-16 w-12 border border-white p-[1px]">
            <img src={formatImageUrl(displayImages[0])} alt="swatch" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="mb-4 grid grid-cols-5 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              disabled={isOutOfStock}
              onClick={() => setSelectedSize(size)}
              className={`border py-3 text-[11px] font-light tracking-widest transition-colors ${
                isOutOfStock
                  ? 'cursor-not-allowed border-white/10 text-neutral-600 line-through'
                  : selectedSize === size
                  ? 'border-white bg-white font-medium text-black'
                  : 'border-white/30 bg-transparent text-white hover:border-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <StockBadge stock={stockCount} />
          <button type="button" className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 underline underline-offset-4 hover:text-white">
            Size Guide
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToBag}
        disabled={!selectedSize || isOutOfStock}
        className={`mb-8 w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
          selectedSize && !isOutOfStock
            ? 'bg-white text-black hover:bg-neutral-200'
            : 'cursor-not-allowed border border-[#333] bg-[#1a1a1a] text-neutral-500'
        }`}
      >
        {isOutOfStock ? 'Out of Stock' : selectedSize ? 'Add to Bag' : 'Select a Size'}
      </button>

      <ProductAccordion items={accordionItems} />
    </aside>
  );
}