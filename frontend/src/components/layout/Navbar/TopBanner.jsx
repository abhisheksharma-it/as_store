// src/components/layout/AnnouncementBar.jsx
import React from 'react';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-black border-b border-[#1a1a1a] py-2.5 px-4 text-center">
      <p className="text-[10px] font-light uppercase tracking-[0.25em] text-neutral-300">
        Free shipping on orders over ₹4,999 — Members get free returns
      </p>
    </div>
  );
}