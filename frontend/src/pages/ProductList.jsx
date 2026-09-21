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
    fetchWishlist(); 
  }, [fetchWishlist]); 

  // 🔴 FIXED ARCHITECTURE: Bulletproof deep filtering logic
  const filteredProducts = products.filter((p) => {
    // Check if category matches
    if (category) {
      const targetCat = category.toLowerCase().replace('-', ' ');
      // Handle Django's potential different JSON structures (nested object vs flat string)
      const catName = (typeof p.category === 'object' ? p.category?.name : p.category_name || p.category || '').toLowerCase();
      if (!catName.includes(targetCat)) return false;
    }

    // Check if department matches
    if (department) {
      const targetDept = department.toLowerCase();
      const deptName = (typeof p.department === 'object' ? p.department?.name : p.department || p.category?.department?.name || '').toLowerCase();
      // Only filter out if department data actually exists on the product but doesn't match
      if (deptName && !deptName.includes(targetDept)) return false;
    }

    return true;
  });

  let pageTitle = 'New Arrivals';
  if (category) pageTitle = category.replace('-', ' '); 
  else if (department) pageTitle = department;

  const placeholderImage = 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <div className="pt-28 pb-20 min-h-screen bg-black text-white px-6 md:px-12 max-w-[1800px] mx-auto">
      
      {/* Dynamic Header */}
      <header className="mb-10 border-b border-neutral-800 pb-6">
        {department && (
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-2">
            {department}
          </p>
        )}
        <h1 className="text-2xl font-light tracking-[0.25em] uppercase">
          {pageTitle}
        </h1>
      </header>

      {/* Main Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 mt-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="aspect-[3/4] bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-500 text-xs uppercase tracking-[0.15em]">
          {error}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 mt-10">
          {filteredProducts.map((product) => {
            
            const isFavourited = wishlist.some((item) => item.product === product.id || item.product?.id === product.id);

            return (
              <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer block">
                <div className="aspect-[3/4] overflow-hidden mb-4 bg-[#111] relative">
                  <img
                    src={product.image_url || placeholderImage}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Wishlist Button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); 
                      e.stopPropagation(); 
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

                  {/* Quick Add Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    <button 
                      className="w-full bg-white text-black text-[10px] uppercase tracking-[0.2em] font-medium py-3 hover:bg-gray-200 transition-colors"
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        // Add quick add logic here if needed
                      }}
                    >
                      Quick Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center">
                  <h2 className="text-[11px] font-light tracking-widest text-gray-300 mb-1.5 line-clamp-1 w-full uppercase">
                    {product.title}
                  </h2>
                  <p className="text-xs tracking-wide text-neutral-400">₹{product.price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;