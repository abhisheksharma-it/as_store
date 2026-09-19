import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import WishlistCard from '../components/ui/WishlistCard';

// 🔴 Dummy data ko backend ke naye names (product_title, product_image) se match kar diya
const popularProducts = [
  { id: 'p1', product: 101, product_title: 'Shopper bag with printed logo', product_price: '5,299', product_image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop' },
  { id: 'p2', product: 102, product_title: 'Manteco wool coat with funnel neck', product_price: '15,999', product_image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=600&auto=format&fit=crop' },
  { id: 'p3', product: 103, product_title: 'Faux leather A-line skirt', product_price: '3,299', product_image: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=600&auto=format&fit=crop' },
  { id: 'p4', product: 104, product_title: '100% linen regular fit shirt', product_price: '4,599', product_image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop' },
];

const Favourites = () => {
  const [email, setEmail] = useState('');
  const { user } = useAuthStore();
  
  const { wishlist, loading, fetchWishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const firstName = user?.full_name?.split(' ')[0]?.toUpperCase() || user?.username?.toUpperCase() || 'ABHISHEK';

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32">
      
      <div className="px-6 md:px-12 pt-8 mb-12">
        <h1 className="text-sm md:text-base font-bold tracking-[0.2em] uppercase">FAVOURITES</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-xs tracking-widest text-gray-500 uppercase">
          Loading your favourites...
        </div>
      ) : wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <h2 className="text-xs md:text-sm tracking-[0.1em] font-medium uppercase mb-6">
            {firstName}, YOUR FAVOURITES ARE EMPTY
          </h2>
          <div className="space-y-3 text-[11px] md:text-xs text-gray-400 font-light tracking-wide">
            <p>✓ Use the hearts to add or remove favourites</p>
            <p>✓ Access your favourites from any device</p>
          </div>
        </div>
      ) : (
        <div className="px-6 md:px-12 mb-20">
          <div className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-light mb-6">
            {wishlist.length} ITEMS
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {wishlist.map((item) => (
              <WishlistCard
                key={item.id}
                item={item} 
                onRemove={() => toggleWishlist(item.product)} 
              />
            ))}
          </div>
        </div>
      )}

      {/* POPULAR RIGHT NOW SECTION */}
      <div className="px-6 md:px-12 mt-8 border-t border-white/10 pt-16">
        <h3 className="text-xs tracking-[0.1em] font-medium uppercase mb-8">POPULAR RIGHT NOW</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {popularProducts.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onRemove={() => console.log("Popular item click")} 
            />
          ))}
        </div>
      </div>

      {/* SUBSCRIBE SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 border-t border-white/10 mt-20">
        <h3 className="text-[11px] font-bold tracking-widest uppercase mb-6">
          Receive exclusive promotions, private sales and news
        </h3>
        <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 sm:gap-0 mb-4">
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent border border-white/30 text-white px-4 py-3 text-xs font-light tracking-wide focus:outline-none focus:border-white transition-colors"
          />
          <button className="bg-white text-black border border-white px-6 py-3 text-[11px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors shrink-0">
            SIGN UP NOW
          </button>
        </div>
        <p className="text-[9px] text-gray-500 font-light tracking-wide">
          By subscribing, you confirm that you have read the Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Favourites;