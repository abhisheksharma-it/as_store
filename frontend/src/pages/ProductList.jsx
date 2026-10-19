// src/pages/ProductList.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/product/ProductCard';

export default function ProductList() {
  const { department, category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  const { wishlist, toggleWishlist, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (department) params.department = department;
        if (category) params.category = category;

        const response = await axios.get('http://127.0.0.1:8000/api/catalog/search/', { params });
        const data = response.data.results || response.data.products || response.data;
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Is backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [department, category, fetchWishlist]);

  const displayedProducts = useMemo(() => {
    let list = [...products];
    if (inStockOnly) {
      list = list.filter((p) => Number(p.stock ?? 0) > 0);
    }
    if (sortBy === 'price-asc') {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    }
    return list;
  }, [products, sortBy, inStockOnly]);

  const pageTitle = category ? category.replace(/-/g, ' ') : department || 'New Arrivals';

  return (
    <div className="pt-28 pb-20 min-h-screen bg-black text-white px-6 md:px-12 max-w-[1800px] mx-auto">
      <header className="mb-8 border-b border-[#222] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {department && (
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-2">{department}</p>
          )}
          <h1 className="text-2xl font-light tracking-[0.25em] uppercase">{pageTitle}</h1>
        </div>

        {/* H&M Minimalist Filter & Sort Bar */}
        <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.2em]">
          <span className="text-neutral-500">{displayedProducts.length} Items</span>

          <label className="flex items-center gap-2 cursor-pointer text-neutral-300 hover:text-white">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-white"
            />
            In Stock Only
          </label>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black border border-[#333] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white outline-none focus:border-white"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 mt-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="aspect-[3/4] bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-400 text-xs uppercase tracking-[0.2em]">{error}</div>
      ) : displayedProducts.length === 0 ? (
        <div className="py-20 text-center text-xs uppercase tracking-[0.2em] text-neutral-500">
          No products found matching your selection.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 mt-8">
          {displayedProducts.map((product) => {
            const isFavourited = wishlist.some(
              (item) => item.product === product.id || item.product?.id === product.id
            );
            return (
              <ProductCard
                key={product.id}
                product={product}
                isFavourited={isFavourited}
                onToggleWishlist={toggleWishlist}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}