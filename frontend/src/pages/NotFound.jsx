// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 mb-3">Error 404</p>
      <h1 className="text-2xl md:text-3xl font-light uppercase tracking-[0.25em] mb-4">
        Page Not Found
      </h1>
      <p className="text-xs text-neutral-400 font-light tracking-wider max-w-md mb-10">
        The piece or collection you are looking for is no longer available or has been moved.
      </p>
      <Link
        to="/"
        className="bg-white text-black px-10 py-4 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors"
      >
        Return to Storefront
      </Link>
    </div>
  );
}