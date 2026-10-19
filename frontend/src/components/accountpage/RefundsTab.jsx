// src/components/accountpage/RefundsTab.jsx
import React from 'react';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';

export default function RefundsTab({ orders = [] }) {
  const refundOrders = orders.filter((o) =>
    ['RETURN REQUESTED', 'REFUNDED'].includes(o.status?.toUpperCase())
  );

  return (
    <div className="animate-fadeIn max-w-3xl text-white space-y-10">
      <div className="border-b border-[#222] pb-6">
        <h1 className="text-xl font-light tracking-[0.2em] uppercase mb-2">Refunds</h1>
        <p className="text-xs text-neutral-400 font-light tracking-wide">
          Track the refund status of your returned orders. Online payments are credited to the original source within 3–5 business days.
        </p>
      </div>

      {refundOrders.length === 0 ? (
        <div className="border border-[#222] bg-[#0a0a0a] p-12 text-center text-xs uppercase tracking-[0.2em] text-neutral-500">
          You have no active or past refunds.
        </div>
      ) : (
        <div className="space-y-4">
          {refundOrders.map((order) => {
            const isRefunded = order.status?.toUpperCase() === 'REFUNDED';
            return (
              <div key={order.id} className="border border-[#222] bg-[#0a0a0a] p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1a1a1a] pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-medium">Order #{order.id}</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                      <CreditCard size={12} />
                      {order.razorpay_payment_id
                        ? `Ref: ${order.razorpay_payment_id}`
                        : 'Refund Mode: Bank Transfer (COD)'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium tracking-wider">
                      ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 text-[9px] uppercase tracking-widest border ${
                        isRefunded
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {isRefunded ? <CheckCircle size={11} /> : <Clock size={11} />}
                      {isRefunded ? 'Refund Completed' : 'Refund Initiated'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 font-light">
                  {isRefunded
                    ? 'The refund has been credited to your original payment method.'
                    : 'Refund will be processed automatically once your return package passes quality check.'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}