// src/components/accountpage/InvoiceModal.jsx
import React from 'react';
import { X, Printer } from 'lucide-react';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const items = order.items || order.order_items || [];
  const total = Number(order.total_amount || 0);
  const tax = Math.round(total * 0.18);
  const net = total - tax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 print:bg-white print:p-0">
      <div className="w-full max-w-xl border border-[#222] bg-black p-8 text-white print:border-none print:bg-white print:text-black">
        <div className="flex items-center justify-between border-b border-[#222] pb-6 mb-6 print:border-black/20">
          <div>
            <h2 className="text-lg font-bold tracking-[0.3em] uppercase">A&S STUDIO</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-1">
              Official Tax Invoice • Order #{order.id}
            </p>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 border border-white/30 px-3 py-1.5 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              <Printer size={12} /> Print / PDF
            </button>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3 border-b border-[#222] pb-6 mb-6 text-xs print:border-black/20">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between tracking-wider">
              <span className="uppercase font-light">
                {item.name || item.product_name} × {item.quantity}
              </span>
              <span>₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-xs tracking-widest text-neutral-400">
          <div className="flex justify-between">
            <span>Net Taxable Value</span>
            <span>₹{net.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span>IGST (18% Included)</span>
            <span>₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between border-t border-[#222] pt-3 text-sm font-bold text-white print:text-black">
            <span>Total Paid ({order.status})</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}