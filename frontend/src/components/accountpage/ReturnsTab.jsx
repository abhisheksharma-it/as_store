// src/components/accountpage/ReturnsTab.jsx
import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Package } from 'lucide-react';

const RETURN_REASONS = [
  'Size too small / too large',
  'Changed my mind',
  'Item arrived damaged or defective',
  'Different from website description',
];

export default function ReturnsTab({ orders = [], onOrderUpdate }) {
  const [selectedReason, setSelectedReason] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const eligibleOrders = orders.filter((o) => ['PAID', 'COD'].includes(o.status?.toUpperCase()));
  const activeReturns = orders.filter((o) => ['RETURN REQUESTED', 'REFUNDED'].includes(o.status?.toUpperCase()));

  const handleReturnSubmit = async (orderId) => {
    const token = localStorage.getItem('access') || localStorage.getItem('token');
    setSubmittingId(orderId);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/return/${orderId}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: selectedReason[orderId] || RETURN_REASONS[0] }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        onOrderUpdate((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
      }
    } catch (err) {
      console.error('Return request failed:', err);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="animate-fadeIn max-w-3xl text-white space-y-10">
      <div className="border-b border-[#222] pb-6">
        <h1 className="text-xl font-light tracking-[0.2em] uppercase mb-2">Returns</h1>
        <p className="text-xs text-neutral-400 font-light tracking-wide">
          Easy 15-day returns on eligible orders. Pickup is free for members.
        </p>
      </div>

      {/* Active Return Requests */}
      {activeReturns.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Active Return Requests</h2>
          {activeReturns.map((order) => (
            <div key={order.id} className="border border-[#222] bg-[#0a0a0a] p-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest font-medium">Order #{order.id}</p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Amount: ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] uppercase tracking-widest text-amber-400">
                <CheckCircle2 size={12} /> {order.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Eligible Orders for Return */}
      <div className="space-y-4">
        <h2 className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Eligible Items to Return</h2>
        {eligibleOrders.length === 0 ? (
          <div className="border border-[#222] bg-[#0a0a0a] p-10 text-center text-xs uppercase tracking-[0.2em] text-neutral-500">
            No eligible orders available for return.
          </div>
        ) : (
          eligibleOrders.map((order) => (
            <div key={order.id} className="border border-[#222] bg-[#0a0a0a] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4">
                <span className="text-xs uppercase tracking-widest font-medium flex items-center gap-2">
                  <Package size={14} className="text-neutral-400" /> Order #{order.id}
                </span>
                <span className="text-xs tracking-wider">
                  ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedReason[order.id] || RETURN_REASONS[0]}
                  onChange={(e) => setSelectedReason({ ...selectedReason, [order.id]: e.target.value })}
                  className="flex-1 bg-black border border-[#333] px-4 py-3 text-xs text-neutral-300 outline-none focus:border-white"
                >
                  {RETURN_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <button
                  onClick={() => handleReturnSubmit(order.id)}
                  disabled={submittingId === order.id}
                  className="bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <RotateCcw size={13} />
                  {submittingId === order.id ? 'Processing...' : 'Request Return'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}