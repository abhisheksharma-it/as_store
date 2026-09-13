import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, totalPrice } = useCartStore();
  const navigate = useNavigate();

  const placeholderImage = 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1200';

  return (
    <>
      {/* Background Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Side Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0a0a0a] border-l border-white/10 text-white z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-sm tracking-widest uppercase font-light">Shopping Bag ({cart.length})</h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs tracking-widest text-gray-500 uppercase">
              Your bag is empty
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex gap-4">
                <img 
                  src={item.product?.image_url || placeholderImage} 
                  alt={item.product?.title || 'Product'} 
                  className="w-20 h-28 object-cover bg-gray-900" 
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[11px] font-light tracking-widest text-gray-300 mb-1">
                      {item.product?.title}
                    </h3>
                    <p className="text-xs text-white">₹{item.product?.price}</p>
                    <p className="text-[10px] text-gray-500 mt-2">SIZE: {item.size || 'N/A'}</p>
                    <p className="text-[10px] text-gray-500">QTY: {item.quantity}</p>
                  </div>
                  <button 
                    // 🔥 YAHAN FIX KIYA HAI: product.id bhej rahe hain delete karne ke liye
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[10px] text-gray-500 underline text-left hover:text-white transition-colors uppercase tracking-widest mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs tracking-widest uppercase text-gray-400">Total</span>
              <span className="text-lg font-light">₹{totalPrice?.toFixed(2) || '0.00'}</span>
            </div>
            
            <button 
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
              className="w-full bg-white text-black py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors"
            >
              Continue to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;