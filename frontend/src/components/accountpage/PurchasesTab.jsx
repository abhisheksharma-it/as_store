// src/components/accountpage/PurchasesTab.jsx
import React, { useState } from 'react';
import { ChevronDown, Package, CreditCard, RotateCcw } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return isNaN(date)
    ? dateStr
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

const getStatusStyle = (status = '') => {
  const s = status.toUpperCase();
  if (s === 'PAID') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  if (s === 'COD') return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  if (s === 'RETURN REQUESTED') return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
  if (s === 'REFUNDED') return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
  if (s === 'FAILED') return 'text-red-400 border-red-500/30 bg-red-500/10';
  return 'text-gray-400 border-white/20 bg-white/5';
};

export default function PurchasesTab({ orders = [], isLoading, onOrderUpdate, onSelectTab }) {
  const [expandedId, setExpandedId] = useState(null);
  const [returningId, setReturningId] = useState(null);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const handleDirectReturn = async (orderId) => {
    const token = localStorage.getItem('access') || localStorage.getItem('token');
    setReturningId(orderId);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/return/${orderId}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Requested from My Purchases' }),
      });

      if (res.ok && onOrderUpdate) {
        const updatedOrder = await res.json();
        onOrderUpdate((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
      }
    } catch (err) {
      console.error('Return error:', err);
    } finally {
      setReturningId(null);
    }
  };

  if (isLoading) {
    return <div className="text-xs tracking-[0.2em] text-gray-500 uppercase py-10">Loading your orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="border border-[#222] bg-[#0a0a0a] p-12 text-center text-xs tracking-[0.2em] text-gray-500 uppercase">
        No orders found in your account.
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="mb-10 text-xl font-light tracking-[0.2em] uppercase text-white">My Purchases</h1>

      <div className="border border-[#222] bg-[#0a0a0a] overflow-x-auto">
        <table className="w-full text-left text-xs tracking-widest text-white">
          <thead className="border-b border-[#222] text-gray-500 text-[10px]">
            <tr>
              <th className="font-normal py-4 px-6 uppercase">Order ID</th>
              <th className="font-normal py-4 px-6 uppercase">Date</th>
              <th className="font-normal py-4 px-6 uppercase">Status</th>
              <th className="font-normal py-4 px-6 uppercase text-right">Total</th>
              <th className="w-10 py-4 px-4"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#222]">
            {orders.map((order) => {
              const isOpen = expandedId === order.id;
              const items = order.items || order.order_items || [];
              const statusLabel = order.status || 'PAID';
              const isEligibleForReturn = ['PAID', 'COD'].includes(statusLabel.toUpperCase());

              return (
                <React.Fragment key={order.id}>
                  <tr
                    onClick={() => toggle(order.id)}
                    className={`hover:bg-[#141414] transition-colors cursor-pointer ${isOpen ? 'bg-[#141414]' : ''}`}
                  >
                    <td className="py-6 px-6 font-medium">#{order.id}</td>
                    <td className="py-6 px-6 text-gray-400">{formatDate(order.date || order.created_at)}</td>
                    <td className="py-6 px-6">
                      <span className={`px-2.5 py-1 text-[10px] border uppercase tracking-widest ${getStatusStyle(statusLabel)}`}>
                        {statusLabel === 'COD' ? 'CASH ON DELIVERY' : statusLabel}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-right font-medium">
                      ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-6 px-4 text-right text-gray-500">
                      <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className="bg-[#0f0f0f] border-t border-[#222]">
                      <td colSpan={5} className="p-6 md:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#222]">
                          <div className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Package size={14} /> Included Items ({items.length})
                          </div>
                          {order.razorpay_payment_id && (
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                              <CreditCard size={13} /> Payment Ref: <span className="text-gray-300">{order.razorpay_payment_id}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {items.length > 0 ? (
                            items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-6 border border-[#222] bg-black/40 p-4">
                                <img
                                  src={item.image}
                                  alt={item.name || item.product_name}
                                  className="w-16 h-20 object-cover bg-neutral-900"
                                />
                                <div className="flex-grow">
                                  <p className="text-xs md:text-sm font-light tracking-widest uppercase text-white">
                                    {item.name || item.product_name}
                                  </p>
                                  <p className="text-[10px] text-gray-500 uppercase mt-1.5 tracking-widest">
                                    Size: {item.size || 'Standard'} &nbsp;|&nbsp; Qty: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs md:text-sm tracking-wider">
                                    ₹{Number(item.price || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No item details available.</p>
                          )}
                        </div>

                        {/* RETURN ACTION FOOTER INSIDE MY PURCHASES */}
                        <div className="mt-6 pt-4 border-t border-[#222] flex items-center justify-between">
                          {isEligibleForReturn ? (
                            <>
                              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                                Eligible for 15-day free return
                              </p>
                              <button
                                type="button"
                                onClick={() => handleDirectReturn(order.id)}
                                disabled={returningId === order.id}
                                className="border border-white/40 bg-transparent px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-colors flex items-center gap-2"
                              >
                                <RotateCcw size={12} />
                                {returningId === order.id ? 'Processing...' : 'Return This Order'}
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center justify-between w-full">
                              <p className="text-[10px] text-purple-400 uppercase tracking-widest">
                                ✓ Return initiated — refund is being processed
                              </p>
                              {onSelectTab && (
                                <button
                                  type="button"
                                  onClick={() => onSelectTab('refunds')}
                                  className="text-[10px] uppercase tracking-widest text-white underline underline-offset-4 hover:text-neutral-400"
                                >
                                  Track Refund Status →
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}