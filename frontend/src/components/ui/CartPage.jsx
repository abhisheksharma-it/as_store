// src/components/ui/CartPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import CartItemRow from './CartItemRow';
import FreeShippingBar from './FreeShippingBar';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, fetchCart } = useCartStore();

  useEffect(() => {
    if (fetchCart) fetchCart();
  }, [fetchCart]);

  const subtotal = cart.reduce((total, item) => {
    const prod = item.product || item;
    return total + (Number(prod.price) || 0) * (Number(item.quantity) || 1);
  }, 0);

  const shippingThreshold = 1999;
  const shipping = subtotal === 0 ? 0 : subtotal >= shippingThreshold ? 0 : 199;
  const total = subtotal + shipping;

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-xl font-light tracking-[0.25em] uppercase mb-8 text-center">Your bag is empty</h1>
        <Link
          to="/"
          className="bg-white text-black text-xs font-bold uppercase tracking-[0.2em] py-4 px-12 hover:bg-neutral-200 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-10">
        <h1 className="text-2xl font-light tracking-[0.25em] uppercase mb-8 text-center lg:text-left">
          Shopping Bag
        </h1>

        <div className="mb-10 border border-[#222]">
          <FreeShippingBar subtotal={subtotal} threshold={shippingThreshold} />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="w-full lg:w-[65%] flex flex-col gap-8">
            {cart.map((item, index) => (
              <CartItemRow
                key={`${item.id || index}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <aside className="w-full lg:w-[35%] lg:sticky lg:top-28 lg:self-start">
            <div className="bg-[#0a0a0a] border border-[#222] p-8">
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase mb-8">Order Summary</h2>

              <div className="space-y-4 text-xs font-light tracking-widest text-neutral-300 border-b border-[#222] pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Order value</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={shipping === 0 ? 'text-emerald-400 font-normal' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-sm font-bold tracking-widest uppercase mb-8">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors"
              >
                <span>Continue to Checkout</span>
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}