import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        <div>
          <h3 className="font-bold mb-4">Shop</h3>
          <ul className="space-y-3 text-[13px] text-gray-400 font-medium">
            <li><Link to="/" className="hover:text-white">LADIES</Link></li>
            <li><Link to="/" className="hover:text-white">MEN</Link></li>
            <li><Link to="/" className="hover:text-white">DIVIDED</Link></li>
            <li><Link to="/" className="hover:text-white">BABY</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Corporate Info</h3>
          <ul className="space-y-3 text-[13px] text-gray-400 font-medium">
            <li><Link to="/" className="hover:text-white">CAREER AT A & S</Link></li>
            <li><Link to="/" className="hover:text-white">ABOUT A & S GROUP</Link></li>
            <li><Link to="/" className="hover:text-white">SUSTAINABILITY</Link></li>
            <li><Link to="/" className="hover:text-white">PRESS</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Help</h3>
          <ul className="space-y-3 text-[13px] text-gray-400 font-medium">
            <li><Link to="/" className="hover:text-white">CUSTOMER SERVICE</Link></li>
            <li><Link to="/" className="hover:text-white">MY A & S</Link></li>
            <li><Link to="/" className="hover:text-white">FIND A STORE</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Become a member</h3>
          <p className="text-[13px] text-gray-400 mb-4">Join now and get 10% off your first purchase!</p>
          <Link to="/" className="text-[13px] font-bold underline hover:text-gray-300">SIGN UP NOW</Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto text-center">
        <Link to="/" className="text-[#e50010] text-4xl font-black font-serif italic tracking-tighter inline-block mb-4">
            A & S
        </Link>
        <p className="text-[11px] text-gray-500 max-w-2xl mx-auto mb-6">
          The content of this site is copyright-protected and is the property of A & S Group.
        </p>
      </div>
    </footer>
  );
}