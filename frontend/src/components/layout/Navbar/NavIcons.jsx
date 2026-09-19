import { useState } from 'react';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';
import SearchDrawer from '../../ui/SearchDrawer'; // 🔴 Tera naya Bolt wala component yahan import ho gaya

const NavIcons = () => {
  const { openCart, cart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore(); 
  const navigate = useNavigate();
  
  // 🔴 Search drawer ke liye local state
  const [isSearchOpen, setIsSearchOpen] = useState(false); 

  const handleIconClick = (label) => {
    if (label === 'Bag') {
      openCart();
    } else if (label === 'Account') {
      if (isAuthenticated) {
        navigate('/account');
      } else {
        navigate('/login');
      }
    } else if (label === 'Search') {
      setIsSearchOpen(true); // 🔴 Click hone pe Drawer true ho jayega
    } else if (label === 'Wishlist') {
      navigate('/favourites'); // 🔴 Click hone pe Favourites page khulega
    }
  };

  // Safe Helper function
  const getUserInitial = () => {
      if (!user) return 'U';
      
      if (user.email && typeof user.email === 'string') {
          return user.email.charAt(0).toUpperCase();
      }
      
      if (user.username && typeof user.username === 'string') {
          return user.username.charAt(0).toUpperCase();
      }
      
      return 'U';
  };

  return (
    <div className="flex items-center gap-5 text-white">
        <button aria-label="Search" onClick={() => handleIconClick('Search')} className="relative p-1 transition-opacity duration-200 hover:opacity-60">
            <Search size={20} strokeWidth={1.5} />
        </button>

        <button aria-label="Account" onClick={() => handleIconClick('Account')} className="relative p-1 transition-opacity duration-200 hover:opacity-60 flex items-center justify-center">
            {isAuthenticated ? (
                <div className="w-[20px] h-[20px] rounded-full border border-white flex items-center justify-center text-[10px] font-bold bg-white text-black">
                    {getUserInitial()}
                </div>
            ) : (
                <User size={20} strokeWidth={1.5} />
            )}
        </button>

        <button aria-label="Wishlist" onClick={() => handleIconClick('Wishlist')} className="relative p-1 transition-opacity duration-200 hover:opacity-60">
             <Heart size={20} strokeWidth={1.5} />
        </button>

        <button aria-label="Bag" onClick={() => handleIconClick('Bag')} className="relative p-1 transition-opacity duration-200 hover:opacity-60">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cart?.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[16px] h-[16px]">
                    {cart.length}
                </span>
            )}
        </button>

        {/* 🔴 SEARCH DRAWER MOUNTED HERE */}
        <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default NavIcons;