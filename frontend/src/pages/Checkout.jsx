import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import api from '../api';

const parsePrice = (priceVal) => {
  if (!priceVal) return 0;
  const num = parseFloat(String(priceVal).replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [address, setAddress] = useState({
    full_name: '',
    phone_number: '',
    address_line: '',
    city: '',
    state: '',
    pincode: '',
  });

  // 🔴 FIXED: Ab hum nested product se price nikal rahe hain
  const cartTotal = cart.reduce((total, item) => {
    const actualPrice = item.product?.price || item.price;
    return total + (parsePrice(actualPrice) * (item.quantity || 1));
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 🔴 FIXED: Backend ko ab asli price jayega, ₹0 nahi
    const orderItems = cart.map(item => {
      const actualPrice = item.product?.price || item.price;
      return {
        product_id: item.product?.id || item.product_id || item.id,
        quantity: item.quantity || 1,
        price: parsePrice(actualPrice) 
      };
    });

    // Security Check: Agar cart total hi 0 hai toh order place mat hone do
    if (cartTotal === 0) {
      setError("Error: Order total is ₹0. Please remove and re-add items to your cart.");
      setLoading(false);
      return;
    }

    try {
      const addressResponse = await api.post('orders/address/', address);
      const addressId = addressResponse.data.data.id; 

      const orderResponse = await api.post('orders/checkout/', {
        address_id: addressId,
        items: orderItems 
      });
      
      const orderId = orderResponse.data.order.id;

      const initResponse = await api.post('orders/payment/initiate/', {
        order_id: orderId
      });
      
      const mockRazorpayId = initResponse.data.razorpay_order_id;
      
      alert(`Redirecting to Secure Payment Gateway...\nAmount: ₹${initResponse.data.amount}\n(Click OK to simulate successful payment)`);

      const verifyResponse = await api.post('orders/payment/verify/', {
        razorpay_order_id: mockRazorpayId,
        status: 'success' 
      });

      clearCart(); 
      navigate('/account'); 
      
    } catch (err) {
      console.error('Checkout error:', err.response?.data || err);
      setError(err.response?.data?.error || 'Failed to process order or payment.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 text-center text-white min-h-screen">
        <p className="tracking-widest uppercase mb-4">Your bag is empty.</p>
        <button onClick={() => navigate('/')} className="underline text-sm uppercase tracking-widest text-gray-400 hover:text-white">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 text-white max-w-[1200px] mx-auto px-4 md:px-8">
      <h1 className="text-2xl font-light tracking-[0.2em] uppercase mb-12 text-center">Checkout</h1>
      
      {error && <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-4 mb-8 tracking-wide uppercase text-center">{error}</div>}

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-2/3">
          <h2 className="text-sm tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Shipping Details</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">Full Name *</label>
                <input required type="text" name="full_name" value={address.full_name} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">Phone Number *</label>
                <input required type="tel" name="phone_number" value={address.phone_number} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">Full Address *</label>
              <input required type="text" name="address_line" value={address.address_line} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">City *</label>
                <input required type="text" name="city" value={address.city} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">State *</label>
                <input required type="text" name="state" value={address.state} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">PIN Code *</label>
                <input required type="text" name="pincode" value={address.pincode} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors disabled:bg-white/50 mt-8"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-1/3 bg-[#0a0a0a] p-8 border border-white/10 h-fit">
          <h2 className="text-sm tracking-widest uppercase mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {cart.map((item, index) => {
              // 🔴 FIXED: Image, Name aur Price ki sahi mapping
              const pImage = item.product?.image_url || item.product?.image || item.image;
              const pName = item.product?.title || item.product?.name || item.name;
              const pPrice = item.product?.price || item.price;

              return (
                <div key={index} className="flex justify-between items-center text-sm font-light">
                  <div className="flex items-center gap-3">
                     <img src={pImage} alt="product" className="w-10 h-14 object-cover" />
                     <div>
                       <p className="text-gray-300 text-xs">{pName}</p>
                       <p className="text-[10px] text-gray-500 mt-1">QTY: {item.quantity}</p>
                     </div>
                  </div>
                  <span>₹{parsePrice(pPrice)}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between items-center text-lg font-light">
              <span className="text-xs tracking-widest uppercase text-gray-400">Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;