// src/pages/Favourites.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import WishlistCard from '../components/ui/WishlistCard';

export default function Favourites() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { wishlist, loading, fetchWishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();

    const loadPopular = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/catalog/search/');
        const data = res.data.results || res.data.products || res.data || [];
        if (Array.isArray(data)) setPopularProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load popular products:', err);
      }
    };
    loadPopular();
  }, [fetchWishlist]);

  const firstName =
    user?.full_name?.split(' ')[0]?.toUpperCase() ||
    user?.username?.toUpperCase() ||
    'MEMBER';

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32">
      <div className="px-6 md:px-12 pt-8 mb-10 flex items-center justify-between border-b border-[#222] pb-6">
        <h1 className="text-lg md:text-xl font-light tracking-[0.25em] uppercase">Favourites</h1>
        {wishlist.length > 0 && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-xs tracking-[0.2em] text-neutral-500 uppercase">
          Loading your favourites...
        </div>
      ) : wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <h2 className="text-xs md:text-sm tracking-[0.2em] font-medium uppercase mb-4">
            {firstName}, YOUR FAVOURITES ARE EMPTY
          </h2>
          <div className="space-y-2 text-[11px] text-neutral-400 font-light tracking-wider mb-8">
            <p>Tap the heart icon on any piece to save it here.</p>
            <p>Your saved pieces sync automatically across your account.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-black px-8 py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors"
          >
            Explore New Arrivals
          </button>
        </div>
      ) : (
        <div className="px-6 md:px-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {wishlist.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                isFavourited={true}
                onToggle={(productId) => toggleWishlist(productId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* POPULAR RIGHT NOW SECTION */}
      {popularProducts.length > 0 && (
        <div className="px-6 md:px-12 mt-8 border-t border-[#222] pt-16">
          <h3 className="text-xs tracking-[0.2em] font-medium uppercase mb-8 text-neutral-300">
            Popular Right Now
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
            {popularProducts.map((product) => {
              const isFav = wishlist.some(
                (w) => (w.product?.id || w.product) === product.id
              );
              return (
                <WishlistCard
                  key={product.id}
                  item={product}
                  isFavourited={isFav}
                  onToggle={(productId) => toggleWishlist(productId)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* SUBSCRIBE SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 border-t border-[#222] mt-20">
        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6">
          Receive exclusive promotions, private sales and news
        </h3>
        {subscribed ? (
          <p className="text-xs tracking-[0.2em] uppercase text-emerald-400 py-3">
            Thank you for subscribing to A&S Insider.
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full max-w-md gap-3 sm:gap-0 mb-4">
            <input
              type="email"
              required
              placeholder="Enter your e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border border-white/30 text-white px-4 py-3 text-xs font-light tracking-wide focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-black border border-white px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors shrink-0"
            >
              Sign Up Now
            </button>
          </form>
        )}
        <p className="text-[9px] text-neutral-500 font-light tracking-wider">
          By subscribing, you confirm that you have read our Privacy Policy.
        </p>
      </div>
    </div>
  );
}