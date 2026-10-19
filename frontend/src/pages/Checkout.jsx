import { useState, useEffect } from 'react';
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
  const { cart, clearCart, fetchCart } = useCartStore(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [manualAddress, setManualAddress] = useState({
    full_name: 'Abhishek Sharma',
    address_line: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    phone_number: ''
  });

  // 🔴 NAYI STATE: Payment Method ke liye (H&M Style)
  const [paymentMethod, setPaymentMethod] = useState('UPI'); 

  useEffect(() => {
    const syncGuestCart = async () => {
      const guestCart = JSON.parse(localStorage.getItem('guest_cart'));
      if (guestCart && guestCart.length > 0) {
        try {
          for (const item of guestCart) {
            await api.post('cart/', {
              product_id: item.product_id || item.product?.id || item.id,
              size: item.size || 'Standard',
              quantity: item.quantity || 1
            });
          }
          localStorage.removeItem('guest_cart');
          await fetchCart();
        } catch (err) {
          console.error("Failed to sync guest cart:", err);
          await fetchCart();
        }
      } else {
        await fetchCart();
      }
    };
    syncGuestCart();
  }, [fetchCart]);

  useEffect(() => {
    const getAddresses = async () => {
      try {
        const res = await api.get('orders/address/');
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setSavedAddresses(data);
        if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        } else {
          setIsAddingNew(true); 
        }
      } catch (err) {
        console.error("Error fetching addresses in checkout:", err);
      }
    };
    getAddresses();
  }, []);

  const cartTotal = cart.reduce((total, item) => {
    const actualPrice = item.product?.price || item.price;
    return total + (parsePrice(actualPrice) * (item.quantity || 1));
  }, 0);

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualAddress({ ...manualAddress, [name]: value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const orderItems = cart.map(item => {
      const actualPrice = item.product?.price || item.price;
      return {
        product_id: item.product?.id || item.product_id || item.id,
        quantity: item.quantity || 1,
        price: parsePrice(actualPrice) 
      };
    });

    if (cartTotal === 0) {
      setError("Error: Order total is ₹0. Please remove items and try again.");
      setLoading(false);
      return;
    }

    try {
      let finalAddressId = selectedAddressId;

      if (isAddingNew || savedAddresses.length === 0) {
        const addressResponse = await api.post('orders/address/', manualAddress);
        finalAddressId = addressResponse.data.id || addressResponse.data.data?.id; 
      }

      if (!finalAddressId) throw new Error("Please provide a valid delivery address.");

      // Backend ko order create karne ke sath payment method bhi bhej rahe hain
      const orderResponse = await api.post('orders/checkout/', {
        address_id: finalAddressId,
        items: orderItems,
        payment_method: paymentMethod 
      });
      const orderId = orderResponse.data.order.id;

      // 🔴 COD LOGIC: Agar COD hai, toh seedha success
      if (paymentMethod === 'COD') {
        alert("Order Placed Successfully via Cash on Delivery!");
        clearCart();
        navigate('/account');
        return; 
      }

      // 🔴 ONLINE PAYMENT LOGIC (Razorpay)
      const initResponse = await api.post('orders/payment/initiate/', {
        order_id: orderId
      });
      
      const mockRazorpayId = initResponse.data.razorpay_order_id;
      
      const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // 🔴 RAZORPAY TEST KEY DAALNA MAT BHOOLNA
          amount: initResponse.data.amount, 
          currency: "INR",
          name: "A&S Store",
          description: "Order Payment",
          order_id: mockRazorpayId, 
          handler: async function (response) {
              try {
                  await api.post('orders/payment/verify/', {
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                      status: 'success' 
                  });
                  alert("Payment Successful!");
                  clearCart(); 
                  navigate('/account'); 
              } catch (verifyErr) {
                  alert("Payment verification failed at backend.");
              }
          },
          prefill: {
              name: isAddingNew ? manualAddress.full_name : "Customer",
              contact: isAddingNew ? manualAddress.phone_number : ""
          },
          theme: { color: "#000000" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
          alert("Payment failed or cancelled. Please try again.");
      });
      rzp1.open();
      
    } catch (err) {
      setError(err.message || err.response?.data?.error || 'Failed to process order.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return <div className="pt-32 pb-20 text-center text-white min-h-screen"><p>Your bag is empty.</p></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 text-white max-w-[1200px] mx-auto px-4 md:px-8">
      <h1 className="text-2xl font-light tracking-[0.2em] uppercase mb-12 text-center">Checkout</h1>
      
      {error && <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-4 mb-8 tracking-wide text-center">{error}</div>}

      <div className="flex flex-col lg:flex-row gap-16">
        
        <div className="w-full lg:w-2/3">
          <form onSubmit={handlePlaceOrder}>
            
            {/* DELIVERY SECTION */}
            <h2 className="text-sm tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Delivery Options</h2>
            <div className="space-y-4 mb-12">
              {savedAddresses.map((addr) => (
                <label key={addr.id} className={`block border p-6 cursor-pointer transition-colors ${selectedAddressId === addr.id && !isAddingNew ? 'border-white bg-white/5' : 'border-neutral-800 hover:border-neutral-600'}`} onClick={() => setIsAddingNew(false)}>
                  <div className="flex items-start gap-4">
                    <input type="radio" name="delivery_address" checked={selectedAddressId === addr.id && !isAddingNew} readOnly className="mt-1 accent-white" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1">{addr.full_name}</p>
                      <p className="text-xs text-gray-400">{addr.address_line}, {addr.city}, {addr.state} {addr.pincode}</p>
                    </div>
                  </div>
                </label>
              ))}
              <label className={`block border p-6 cursor-pointer transition-colors ${isAddingNew ? 'border-white bg-white/5' : 'border-neutral-800 hover:border-neutral-600'}`} onClick={() => setIsAddingNew(true)}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="delivery_address" checked={isAddingNew} readOnly className="accent-white" />
                  <span className="text-xs font-bold uppercase tracking-widest">+ Add New Address</span>
                </div>
              </label>
            </div>

            {/* MANUAL ADDRESS FORM */}
            {(isAddingNew || savedAddresses.length === 0) && (
              <div className="p-6 border border-neutral-700 bg-black/50 space-y-6 mb-12">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Full Name *</label>
                    <input required type="text" name="full_name" value={manualAddress.full_name} onChange={handleManualInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-2">Phone Number *</label>
                    <input required type="tel" name="phone_number" value={manualAddress.phone_number} onChange={handleManualInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-2">Full Address *</label>
                  <input required type="text" name="address_line" value={manualAddress.address_line} onChange={handleManualInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div><label className="block text-[10px] uppercase text-gray-400 mb-2">City *</label><input required type="text" name="city" value={manualAddress.city} onChange={handleManualInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white" /></div>
                  <div><label className="block text-[10px] uppercase text-gray-400 mb-2">State *</label><input required type="text" name="state" value={manualAddress.state} onChange={handleManualInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white" /></div>
                  <div><label className="block text-[10px] uppercase text-gray-400 mb-2">PIN Code *</label><input required type="text" name="pincode" value={manualAddress.pincode} onChange={handleManualInputChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white" /></div>
                </div>
              </div>
            )}

            {/* 🔴 NAYA PAYMENT SECTION (H&M STYLE) */}
            <h2 className="text-sm tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Payment</h2>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-6">How would you like to pay?</p>
            
            <div className="space-y-0 border-t border-white/10">
              
              {/* UPI Option */}
              <label className="flex items-center justify-between p-6 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setPaymentMethod('UPI')}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment_method" checked={paymentMethod === 'UPI'} readOnly className="accent-white" />
                  <span className="font-bold text-xs tracking-widest uppercase">UPI</span>
                </div>
                <span className="text-[10px] text-gray-500 uppercase">Supports instant refund</span>
              </label>

              {/* Card Option */}
              <label className="flex items-center justify-between p-6 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setPaymentMethod('CARD')}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment_method" checked={paymentMethod === 'CARD'} readOnly className="accent-white" />
                  <span className="font-bold text-xs tracking-widest uppercase">Card</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-white text-black px-1 font-bold rounded-sm">VISA</span>
                  <span className="text-[10px] bg-white text-black px-1 font-bold rounded-sm">MC</span>
                </div>
              </label>

              {/* Netbanking Option */}
              <label className="flex items-center justify-between p-6 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setPaymentMethod('NETBANKING')}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment_method" checked={paymentMethod === 'NETBANKING'} readOnly className="accent-white" />
                  <span className="font-bold text-xs tracking-widest uppercase">Netbanking</span>
                </div>
              </label>

              {/* COD Option */}
              <label className="flex items-center justify-between p-6 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setPaymentMethod('COD')}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment_method" checked={paymentMethod === 'COD'} readOnly className="accent-white" />
                  <span className="font-bold text-xs tracking-widest uppercase">Cash on Delivery</span>
                </div>
                <span className="text-[10px] text-gray-500 uppercase">Pay in cash at time of receiving</span>
              </label>

            </div>

            <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors disabled:bg-white/50 mt-12">
              {paymentMethod === 'COD' ? 'Complete Purchase' : 'Proceed to Pay'}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-[#0a0a0a] p-8 border border-white/10 sticky top-32">
            <h2 className="text-sm tracking-widest uppercase mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cart.map((item, index) => {
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
            
            <div className="border-t border-white/10 pt-6 space-y-3">
               <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                  <span>Order Value</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                  <span>Delivery Fee</span>
                  <span className="text-green-400">FREE</span>
               </div>
            </div>

            <div className="border-t border-white/10 mt-6 pt-6">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-xs tracking-widest uppercase">Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;