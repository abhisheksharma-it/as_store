// src/components/product/BeautyProductInfo.jsx
import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';
import StockBadge from './StockBadge';
import ProductAccordion from './ProductAccordion';

export default function BeautyProductInfo({
  product,
  setSelectedSize,
  isWishlisted,
  toggleWishlist,
  handleAddToBag,
}) {
  const stockCount = Number(product.stock ?? 0);
  const isOutOfStock = stockCount <= 0;

  useEffect(() => {
    setSelectedSize('Standard');
  }, [setSelectedSize]);

  const accordionItems = [
    { id: 'description', title: 'Description', content: product.description_and_fit || product.description || 'Premium quality essentials crafted for everyday use.' },
    { id: 'materials', title: 'Details & Care', content: product.materials || 'Follow standard care instructions on the label.' },
    { id: 'delivery', title: 'Delivery & Payment', content: product.delivery_and_payment || 'Free standard delivery on orders over ₹1,999. Cash on Delivery & UPI available.' },
  ];

  return (
    <aside className="w-full flex-shrink-0 pt-4 lg:w-[400px]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-[13px] font-light uppercase tracking-[0.2em] text-white">{product.title}</h1>
          <p className="text-sm font-light tracking-wider text-white">
            ₹{Number(product.price || 0).toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-neutral-500">MRP inclusive of all taxes</p>
        </div>
        <button onClick={() => toggleWishlist(product.id)} className="p-1 transition-transform hover:scale-110">
          <Heart size={20} strokeWidth={1.2} className={isWishlisted ? 'fill-white stroke-white' : 'stroke-white'} />
        </button>
      </div>

      <div className="my-6 border-t border-white/20 pt-6">
        <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          Colour: <span className="ml-1 text-white">{product.color_name || 'Standard'}</span>
        </p>
        <div className="mb-4 h-16 w-12 border border-white p-0.5">
          <img src={product.image_url || product.image} alt={product.title} className="h-full w-full object-cover" />
        </div>
        <StockBadge stock={stockCount} />
      </div>

      <button
        onClick={handleAddToBag}
        disabled={isOutOfStock}
        className={`mb-8 w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
          !isOutOfStock
            ? 'bg-white text-black hover:bg-neutral-200'
            : 'cursor-not-allowed border border-[#333] bg-[#1a1a1a] text-neutral-500'
        }`}
      >
        {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
      </button>

      <ProductAccordion items={accordionItems} />
    </aside>
  );
}