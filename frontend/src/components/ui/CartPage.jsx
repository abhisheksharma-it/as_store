import React, { useEffect } from 'react';
import { useCartStore } from '../../store/cartStore'; // 🔴 FIX: Ek aur '../' add kiya
import { useAuthStore } from '../../store/authStore'; // 🔴 FIX: Ek aur '../' add kiya
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cart, totalPrice, fetchCart, removeFromCart, isLoading } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="min-h-screen bg-black text-white pt-[120px] px-8 md:px-16 pb-20 font-sans tracking-wide">
      
      {/* HEADER */}
      <h1 className="text-[42px] md:text-[56px] font-bold uppercase tracking-tighter mb-12">
        Shopping Bag
      </h1>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* LEFT COLUMN: CART ITEMS OR EMPTY STATE */}
        <div className="w-full lg:w-[65%]">
          {cart.length === 0 ? (
            <div className="mt-4">
              <h2 className="text-[15px] font-bold mb-4 uppercase">Your shopping bag is empty.</h2>
              {!user && (
                <p className="text-[14px] text-gray-300">
                  <Link to="/login" className="underline hover:text-white transition-colors">Sign in</Link> to save or access already saved items in your shopping bag.
                </p>
              )}
              {user && (
                 <p className="text-[14px] text-gray-300">
                 Looks like you haven't added anything yet. <Link to="/" className="underline hover:text-white transition-colors">Start shopping</Link>.
               </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 border-b border-gray-800 pb-6 group">
                  
                  {/* Product Image */}
                  <Link to={`/product/${item.product.id}`} className="w-[120px] h-[160px] flex-shrink-0 bg-zinc-900">
                    <img 
                      src={item.product.image_url || 'https://via.placeholder.com/150'} 
                      alt={item.product.title}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <Link to={`/product/${item.product.id}`} className="text-[14px] font-medium hover:underline">
                          {item.product.title}
                        </Link>
                        <span className="text-[14px] font-bold ml-4">Rs. {parseFloat(item.product.price).toFixed(2)}</span>
                      </div>
                      <p className="text-[13px] text-gray-400 mb-1">Size: {item.size || 'N/A'}</p>
                      <p className="text-[13px] text-gray-400">Qty: {item.quantity}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[12px] flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                        disabled={isLoading}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="w-full lg:w-[35%] lg:max-w-[400px]">
          <div className="flex flex-col gap-5">
            
            <div className="flex justify-between items-center text-[13px] border-b border-gray-800 pb-4">
              <span className="uppercase tracking-widest">Discounts</span>
              <button className="underline hover:text-gray-300 uppercase">Add</button>
            </div>

            <div className="flex justify-between items-center text-[15px] font-bold mt-2">
              <span className="uppercase tracking-widest">Total</span>
              <span>Rs. {totalPrice.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button 
              className={`w-full py-4 mt-4 text-[13px] font-bold tracking-widest uppercase transition-colors
                ${cart.length === 0 
                  ? 'bg-zinc-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-200'}`}
              disabled={cart.length === 0}
              onClick={() => navigate('/checkout')} 
            >
              Continue to checkout
            </button>

            {/* Sign in prompt if not logged in */}
            {!user && (
              <button 
                onClick={() => navigate('/login')}
                className="w-full border border-white py-4 mt-2 text-[13px] font-bold tracking-widest uppercase hover:bg-zinc-900 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Payment Icons (Dummy) */}
            <div className="flex gap-2 mt-4 opacity-80">
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-blue-800 font-bold text-[9px]">VISA</div>
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-red-500 font-bold text-[9px] relative overflow-hidden">
                    <div className="w-4 h-4 rounded-full bg-red-500 opacity-80 absolute left-1"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-80 absolute right-1"></div>
                </div>
                <div className="w-12 h-6 bg-white rounded flex items-center justify-center text-black font-bold text-[7px] leading-tight text-center px-1">CASH ON<br/>DELIVERY</div>
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-gray-800 font-bold text-[10px] italic">UPI</div>
            </div>

            {/* Info Text */}
            <div className="text-[11px] text-gray-400 mt-6 leading-relaxed space-y-4">
              <p>Prices and delivery costs are not confirmed until you've reached the checkout.</p>
              <p>
                15 days free returns. Read more about <Link to="/returns" className="underline hover:text-white">return and refund policy.</Link>
              </p>
              <p>
                Need help? Please contact <Link to="/support" className="underline hover:text-white">Customer Support</Link>.<br/>
                Customers would receive an SMS/WhatsApp notifications regarding deliveries on the registered phone number.
              </p>
              
              <Link to="/delivery-options" className="block mt-4 text-[12px] uppercase underline text-white hover:text-gray-300">
                Delivery and return options
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;