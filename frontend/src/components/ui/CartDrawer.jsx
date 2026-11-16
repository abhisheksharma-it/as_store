// src/components/ui/CartDrawer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatImageUrl } from '../../utils/formatImageUrl';
import FreeShippingBar from './FreeShippingBar';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCartStore();

  const subtotal = cart.reduce((sum, item) => {
    const prod = item.product || item;
    return sum + Number(prod.price || 0) * Number(item.quantity || 1);
  }, 0);

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={closeCart}
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-black border-l border-[#222] text-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#222] px-6 py-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Shopping Bag ({cart.length})</h2>
          <button onClick={closeCart} className="p-1 text-neutral-400 hover:text-white transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {cart.length > 0 && <FreeShippingBar subtotal={subtotal} />}

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-5 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Your shopping bag is empty</p>
              <button
                onClick={closeCart}
                className="border border-white px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => {
                const prod = item.product || item;
                const qty = Number(item.quantity || 1);
                const maxStock = Number(prod.stock ?? 10);
                const isAtMax = qty >= maxStock;

                return (
                  <div key={item.id || index} className="flex gap-4 border-b border-[#1a1a1a] pb-6">
                    <Link to={`/product/${prod.id}`} onClick={closeCart} className="h-28 w-20 shrink-0 bg-[#111]">
                      <img src={formatImageUrl(prod)} alt={prod.title} className="h-full w-full object-cover" />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-[11px] font-light uppercase tracking-[0.15em] line-clamp-1">
                            {prod.title}
                          </h3>
                          <button
                            onClick={() => removeFromCart(prod.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors shrink-0"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-white tracking-wider">
                          ₹{Number(prod.price || 0).toLocaleString('en-IN')}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-500">
                          Size: {item.size || 'Standard'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#333] px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(prod.id, Math.max(1, qty - 1), item.size)}
                            disabled={qty <= 1}
                            className="text-neutral-400 hover:text-white disabled:opacity-30 p-1"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-[11px] w-6 text-center">{qty}</span>
                          <button
                            onClick={() => !isAtMax && updateQuantity(prod.id, qty + 1, item.size)}
                            disabled={isAtMax}
                            className="text-neutral-400 hover:text-white disabled:opacity-30 p-1"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        {isAtMax && <span className="text-[9px] uppercase tracking-widest text-amber-400">Max Stock</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-[#222] p-6 bg-[#0a0a0a] space-y-3">
            <div className="mb-4 flex justify-between text-xs font-bold uppercase tracking-[0.2em]">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="flex w-full justify-center bg-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black hover:bg-neutral-200 transition-colors"
            >
              Continue to Checkout
            </Link>
            <Link
              to="/cart"
              onClick={closeCart}
              className="flex w-full justify-center border border-[#333] py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-300 hover:border-white hover:text-white transition-colors"
            >
              View Shopping Bag
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}