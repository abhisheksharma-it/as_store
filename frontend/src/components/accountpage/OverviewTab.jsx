// src/components/accountpage/OverviewTab.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, User, ArrowRight } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

export default function OverviewTab({ onSelect, orders = [] }) {
  const navigate = useNavigate();

  // Sabse latest Paid ya COD order (warna list ka pehla order)
  const latestOrder = orders.find((o) => ['PAID', 'COD'].includes(o.status?.toUpperCase())) || orders[0];
  const items = latestOrder?.items || latestOrder?.order_items || [];

  return (
    <div className="flex flex-col animate-fadeIn max-w-3xl text-white space-y-12">
      {/* Header */}
      <div className="border-b border-[#222] pb-6">
        <h1 className="text-xl font-light tracking-[0.2em] uppercase mb-2">Account Overview</h1>
        <p className="text-xs text-neutral-400 font-light tracking-wide">
          Manage your recent purchases, saved addresses, and personal preferences.
        </p>
      </div>

      {/* Latest Order Snapshot */}
      {latestOrder ? (
        <div className="border border-[#222] bg-[#0a0a0a] p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-[#222] pb-4 mb-6">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-neutral-400">
              <Package size={14} /> Latest Order
            </div>
            <button
              onClick={() => onSelect('purchases')}
              className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-neutral-400 flex items-center gap-1.5 transition-colors"
            >
              View All ({orders.length}) <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs tracking-widest uppercase font-medium">Order #{latestOrder.id}</p>
              <p className="text-[10px] text-neutral-500 tracking-widest mt-1">
                {formatDate(latestOrder.date || latestOrder.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-2.5 py-1 text-[10px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 uppercase tracking-widest">
                {latestOrder.status === 'COD' ? 'CASH ON DELIVERY' : (latestOrder.status || 'PAID')}
              </span>
              <span className="text-sm font-medium tracking-wider">
                ₹{Number(latestOrder.total_amount || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pt-2">
              {items.slice(0, 4).map((item, idx) => (
                <img
                  key={idx}
                  src={item.image}
                  alt={item.name || 'Product'}
                  className="w-14 h-18 object-cover bg-neutral-900 border border-[#222]"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="border border-[#222] bg-[#0a0a0a] p-8">
          <h2 className="text-sm tracking-[0.15em] uppercase font-bold mb-2">You're up to date</h2>
          <p className="text-xs text-neutral-400 font-light mb-6">
            Discover new arrivals, collections, and pieces that suit you.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] py-3.5 px-8 hover:bg-neutral-200 transition-colors"
          >
            See what's new
          </button>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('addresses')}
          className="border border-[#222] bg-[#0a0a0a] p-6 text-left hover:border-white/40 transition-colors group"
        >
          <MapPin size={16} className="text-neutral-400 mb-3 group-hover:text-white transition-colors" />
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-1">Shipping Addresses</h3>
          <p className="text-[11px] text-neutral-500 font-light">Edit or add delivery addresses for faster checkout.</p>
        </button>

        <button
          onClick={() => onSelect('details')}
          className="border border-[#222] bg-[#0a0a0a] p-6 text-left hover:border-white/40 transition-colors group"
        >
          <User size={16} className="text-neutral-400 mb-3 group-hover:text-white transition-colors" />
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-1">My Details</h3>
          <p className="text-[11px] text-neutral-500 font-light">View and update your personal profile details.</p>
        </button>
      </div>
    </div>
  );
}