import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryGrid from "../components/ui/MegaMenuSystem/CategoryGrid";
import api from '../api';

const Home = () => {
  // Database se aane wale products ko store karne ke liye state
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Component load hote hi backend se products fetch karo
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await api.get('catalog/latest-products/');
        if (response.data.status === 'success') {
          setLatestProducts(response.data.products);
        }
      } catch (error) {
        console.error("Failed to fetch latest products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <>
      {/* Hero section */}
      <main className="relative w-full h-screen overflow-hidden">
        <img
          src="https://images.pexels.com/photos/27902336/pexels-photo-27902336.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Editorial fashion hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-24 right-24 text-right text-white max-w-md">
          <h1 className="text-5xl font-light tracking-tight mb-4">Fall 2026</h1>
          <p className="text-sm font-light tracking-wide opacity-80 mb-6">
            Discover the new season — tailored essentials and statement pieces for every moment.
          </p>
          <button className="border border-white/40 px-8 py-3 text-xs uppercase tracking-[0.2em] font-light hover:bg-white hover:text-black transition-all duration-300">
            Shop Now
          </button>
        </div>
      </main>

      <CategoryGrid />

      {/* --- NAYA DYNAMIC SECTION: LATEST PRODUCTS FROM DATABASE --- */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto text-white">
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <h2 className="text-2xl font-light tracking-[0.2em] uppercase">New Arrivals</h2>
          <Link to="/shop" className="text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs tracking-widest uppercase text-gray-500 animate-pulse">
            Loading latest collection...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {latestProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#111]">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] tracking-widest uppercase text-gray-600">No Image</div>
                  )}
                  
                  {/* New Tag Logic */}
                  {product.is_new && (
                    <span className="absolute top-4 left-4 bg-white text-black text-[9px] uppercase tracking-widest px-2 py-1 font-medium">
                      New
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xs font-light tracking-wide text-gray-300 group-hover:text-white transition-colors truncate">
                    {product.title}
                  </h3>
                  <div className="flex gap-3 text-xs tracking-widest font-light">
                    {product.discount_price ? (
                      <>
                        <span className="text-white">₹{product.discount_price}</span>
                        <span className="text-gray-500 line-through">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">₹{product.price}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;