import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const PLACEHOLDER =
  'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=800';

const getProductImage = (product) => {
  const raw = product?.image_url || product?.image || product?.gallery_images?.[0]?.image;
  if (!raw) return PLACEHOLDER;
  if (raw.startsWith('http')) return raw;
  if (raw.startsWith('/')) return `http://127.0.0.1:8000${raw}`;
  return `http://127.0.0.1:8000/media/${raw}`;
};

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await api.get('catalog/latest-products/');
        if (response.data.status === 'success') {
          setLatestProducts(response.data.products || []);
        }
      } catch (error) {
        console.error('Failed to fetch latest products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestProducts();
  }, []);

  const spotlightProducts = latestProducts.slice(0, 2);
  const collectionProducts =
    latestProducts.length > 2 ? latestProducts.slice(2) : latestProducts;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* 1. HERO SECTION (First Girl Image - Untouched) */}
      <main className="relative w-full h-screen overflow-hidden">
        <img
          src="https://images.pexels.com/photos/27902336/pexels-photo-27902336.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Editorial fashion hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-24 right-12 md:right-24 text-right text-white max-w-md">
          <h1 className="text-5xl font-light tracking-tight mb-4">Fall 2026</h1>
          <p className="text-sm font-light tracking-wide opacity-80 mb-6">
            Discover the new season — tailored essentials and statement pieces for every moment.
          </p>
          <a
            href="#featured-collection"
            className="inline-block border border-white/40 px-8 py-3 text-xs uppercase tracking-[0.2em] font-light hover:bg-white hover:text-black transition-all duration-300"
          >
            Shop Now
          </a>
        </div>
      </main>

      {/* 2. EDITORIAL SPOTLIGHT (2-Column Real Clickable Products) */}
      {!loading && spotlightProducts.length > 0 && (
        <section id="featured-collection" className="pt-20 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto">
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2">
              Curated Selection
            </p>
            <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase">
              Season Spotlight
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {spotlightProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group block"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111]">
                  <img
                    src={getProductImage(product)}
                    alt={product.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-xs text-white text-[9px] uppercase tracking-[0.2em] px-3 py-1.5">
                    {product.department_name || product.category_name || 'Featured'}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-white group-hover:text-neutral-300 transition-colors">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-xs font-light tracking-wider text-neutral-400">
                      ₹{Number(product.discount_price || product.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 group-hover:text-white transition-colors">
                    View Piece →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. NEW ARRIVALS (4-Column Real Clickable Products Grid) */}
      <section className="py-20 px-6 md:px-12 max-w-[1400px] mx-auto text-white">
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <h2 className="text-2xl font-light tracking-[0.2em] uppercase">New Arrivals</h2>
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
            {latestProducts.length} Pieces
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs tracking-widest uppercase text-gray-500 animate-pulse">
            Loading latest collection...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {collectionProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#111]">
                  <img
                    src={getProductImage(product)}
                    alt={product.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.is_new && (
                    <span className="absolute top-3 left-3 bg-white text-black text-[9px] uppercase tracking-widest px-2 py-1 font-medium">
                      New
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-neutral-300 group-hover:text-white transition-colors truncate">
                    {product.title}
                  </h3>
                  <div className="flex gap-3 text-xs tracking-wider font-light">
                    {product.discount_price ? (
                      <>
                        <span className="text-white">₹{product.discount_price}</span>
                        <span className="text-gray-500 line-through">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="text-neutral-400">₹{product.price}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;