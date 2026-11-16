// src/components/product/SizeGuideModal.jsx
import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const CHART = [
  ['XS', '34-36"', '28-30"'],
  ['S', '36-38"', '30-32"'],
  ['M', '38-40"', '32-34"'],
  ['L', '40-42"', '34-36"'],
  ['XL', '42-44"', '36-38"'],
];

export default function SizeGuideModal({ isOpen, onClose, onSelectSize }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [recSize, setRecSize] = useState(null);

  if (!isOpen) return null;

  const handleCalculate = (e) => {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w) return;
    const bmi = w / ((h / 100) ** 2);
    let idx = bmi < 18.5 ? 0 : bmi < 21.5 ? 1 : bmi < 24.5 ? 2 : bmi < 27.5 ? 3 : 4;
    if (h > 182 && idx < 4) idx += 1;
    setRecSize(SIZES[idx]);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md border border-[#333] bg-black p-6 text-white shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-[#222] pb-3">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
            <Sparkles size={14} /> Size & AI Fit Guide
          </span>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleCalculate} className="mb-5 space-y-3 border border-[#222] bg-[#0a0a0a] p-3.5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">AI Smart Size Recommender</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Height (cm) e.g. 175" value={height} onChange={(e) => setHeight(e.target.value)} className="border border-[#333] bg-black px-3 py-2 text-xs text-white outline-none focus:border-white" required />
            <input type="number" placeholder="Weight (kg) e.g. 68" value={weight} onChange={(e) => setWeight(e.target.value)} className="border border-[#333] bg-black px-3 py-2 text-xs text-white outline-none focus:border-white" required />
          </div>
          <button type="submit" className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black hover:bg-neutral-200">
            Find My Best Size
          </button>
          {recSize && (
            <div className="flex items-center justify-between border-t border-[#222] pt-3">
              <span className="text-xs">Recommended: <strong className="text-emerald-400">{recSize} (96% Match)</strong></span>
              <button type="button" onClick={() => { onSelectSize?.(recSize); onClose(); }} className="flex items-center gap-1 border border-white px-3 py-1 text-[10px] uppercase hover:bg-white hover:text-black">
                <Check size={12} /> Select {recSize}
              </button>
            </div>
          )}
        </form>

        <table className="w-full border border-[#222] text-left text-xs">
          <thead className="bg-[#111] text-[10px] uppercase text-neutral-400">
            <tr><th className="p-2.5">Size</th><th className="p-2.5">Chest</th><th className="p-2.5">Waist</th></tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {CHART.map(([s, c, w]) => (
              <tr key={s}><td className="p-2.5 font-bold">{s}</td><td className="p-2.5 text-neutral-300">{c}</td><td className="p-2.5 text-neutral-300">{w}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}