import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Heart } from 'lucide-react'; 
import { useWishlistStore } from '../store/wishlistStore'; 

const ProductList = () => {
  const { department, category } = useParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔴 FIX 1: fetchWishlist ko bhi nikal liya store se
  const { wishlist, toggleWishlist, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/catalog/search/');
        setProducts(response.data); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Is backend running?");
        setLoading(false);
      }
    };

    fetchProducts();
    // 🔴 FIX 2: Page load hote hi backend se wishlist le aao taaki heart white ho sake
    fetchWishlist(); 
  }, [fetchWishlist]); // dependency array mein daal diya

  const filteredProducts = category 
    ? products.filter(p => p.category_name?.toLowerCase().includes(category.toLowerCase().replace('-', ' ')))
    : products;

  let pageTitle = 'New Arrivals';
  if (category) pageTitle = category.replace('-', ' '); 
  else if (department) pageTitle = department;

  const placeholderImage = 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <div className="pt-28 pb-20 min-h-screen text-white px-6 md:px-12 max-w-[1800px] mx-auto">
      {/* Header & Sidebar wala code same hai (Skipped to save space, apna same rakhna) */}
      
      {/* ⚠️ MAIN PRODUCT GRID WALA AREA ⚠️ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 mt-10">
        {filteredProducts.map((product) => {
          
          // 🔴 Naya aur Bulletproof condition
const isFavourited = wishlist.some((item) => item.product === product.id || item.product?.id === product.id);

          return (
            <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer block">
              <div className="aspect-[3/4] overflow-hidden mb-4 bg-[#111] relative">
                <img
                  src={product.image_url || placeholderImage}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                />
                
                {/* 🔴 FIX 3: stopPropagation() laga diya */}
                <button 
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); // 🔴 YE LINE BOHOT ZAROORI THI! Iske bina click Link pe chala jata hai
                    
                    console.log("Heart Clicked for ID:", product.id); // Console me verify karne ke liye
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-4 right-4 z-10 transition-transform duration-200 hover:scale-110"
                >
                  <Heart 
                    size={22} 
                    strokeWidth={1.5}
                    fill={isFavourited ? "white" : "none"} 
                    className="text-white"
                  />
                </button>

                {/* Quick Add Button */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                  <button 
                    className="w-full bg-white text-black text-[10px] uppercase tracking-[0.2em] font-medium py-3 hover:bg-gray-200 transition-colors"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  >
                    Quick Add
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <h2 className="text-[11px] font-light tracking-widest text-gray-300 mb-1.5 line-clamp-1 w-full uppercase">
                  {product.title}
                </h2>
                <p className="text-xs tracking-wide">₹{product.price}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;