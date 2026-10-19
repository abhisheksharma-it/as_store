// src/components/product/ProductAccordion.jsx
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ProductAccordion({ items = [] }) {
  const [openIds, setOpenIds] = useState([]);

  const toggle = (id) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className="mt-2 border-t border-white/20">
      {items.map(({ id, title, content }) => {
        if (!content) return null;
        const isOpen = openIds.includes(id);

        return (
          <div key={id} className="border-b border-white/20">
            <button
              type="button"
              onClick={() => toggle(id)}
              className="flex w-full items-center justify-between py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:text-neutral-400"
            >
              <span>{title}</span>
              {isOpen ? <Minus size={14} strokeWidth={1.2} /> : <Plus size={14} strokeWidth={1.2} />}
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[800px] pb-6' : 'max-h-0'
              }`}
            >
              <p className="whitespace-pre-wrap text-xs font-light leading-relaxed text-neutral-400">
                {content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}