import { Heart } from 'lucide-react';

const WishlistCard = ({ item, onRemove }) => {
  const placeholderImage = 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600';

  if (!item) return null;

  return (
    <div className="group relative cursor-pointer block">
      
      {/* Image Area */}
      <div className="relative aspect-[3/4] bg-[#111] overflow-hidden mb-3">
        <img 
          src={item.product_image || placeholderImage} 
          alt={item.product_title || 'Product'} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" 
        />
        
        {/* Remove Button (Heart) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); 
            onRemove();
          }}
          className="absolute top-4 right-4 z-10 transition-transform duration-200 hover:scale-110"
        >
          <Heart size={20} fill="white" strokeWidth={1.5} className="text-white" />
        </button>
      </div>
      
      {/* Product Text */}
      <div className="flex flex-col items-start">
        <h3 className="text-[11px] font-light text-gray-300 uppercase tracking-widest truncate w-full mb-1.5">
          {item.product_title}
        </h3>
        <p className="text-xs font-normal">
          ₹{item.product_price}
        </p>
      </div>
      
    </div>
  );
};

export default WishlistCard;