// src/components/ai/StylistMessage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { formatImageUrl } from '../../utils/formatImageUrl';

export default function StylistMessage({ msg, onClose }) {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-3`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-xs leading-relaxed tracking-wide ${
          isUser
            ? 'bg-white text-black font-medium'
            : 'border border-[#222] bg-[#0a0a0a] text-neutral-200 font-light'
        }`}
      >
        {!isUser && (
          <div className="mb-1.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-neutral-400">
            <Sparkles size={10} /> A&S Stylist
          </div>
        )}
        <p>{msg.text}</p>
      </div>

      {msg.products?.length > 0 && (
        <div className="w-full space-y-2 pl-1">
          {msg.products.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              onClick={onClose}
              className="flex items-center gap-3 border border-[#222] bg-[#0a0a0a] p-2.5 hover:border-white/40 transition-colors group"
            >
              <img
                src={formatImageUrl(item)}
                alt={item.title}
                className="h-14 w-11 object-cover bg-neutral-900 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-light uppercase tracking-[0.15em] text-white group-hover:underline">
                  {item.title}
                </p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  ₹{Number(item.price || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-white mr-1" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}