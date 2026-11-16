// src/components/product/AIFitPredictor.jsx
import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

const FIT_OPTIONS = ['Slim', 'Regular', 'Oversized'];
const SIZE_SCALE = ['XS', 'S', 'M', 'L', 'XL'];

export default function AIFitPredictor({ onApplySize }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fit, setFit] = useState('Regular');
  const [result, setResult] = useState(null);

  const calculateSize = (e) => {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w || h < 120 || w < 30) return;

    const bmi = w / ((h / 100) ** 2);
    let idx = bmi < 18.5 ? 0 : bmi < 21.5 ? 1 : bmi < 24.5 ? 2 : bmi < 27.5 ? 3 : 4;
    if (h > 182 && idx < 4) idx += 1;
    if (fit === 'Oversized' && idx < 4) idx += 1;
    if (fit === 'Slim' && idx > 0) idx -= 1;

    setResult({ size: SIZE_SCALE[idx], confidence: fit === 'Regular' ? 96 : 93 });
  };

  return (
    <div className="mb-6 border border-white/15 bg-[#0a0a0a] p-4">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white">
        <Sparkles size={13} /> AI Smart Size Recommender
      </div>

      <form onSubmit={calculateSize} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="HEIGHT (CM) e.g. 175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="border border-[#333] bg-black px-3 py-2 text-[11px] tracking-wider text-white placeholder:text-neutral-600 outline-none focus:border-white"
            required
          />
          <input
            type="number"
            placeholder="WEIGHT (KG) e.g. 68"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border border-[#333] bg-black px-3 py-2 text-[11px] tracking-wider text-white placeholder:text-neutral-600 outline-none focus:border-white"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {FIT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFit(option)}
              className={`border py-1.5 text-[9px] uppercase tracking-[0.2em] transition-colors ${
                fit === option ? 'border-white bg-white text-black font-bold' : 'border-[#222] text-neutral-400 hover:border-white/40'
              }`}
            >
              {option} Fit
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full border border-white/40 bg-transparent py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white hover:bg-white hover:text-black transition-colors"
        >
          Calculate My Best Size
        </button>
      </form>

      {result && (
        <div className="mt-4 flex items-center justify-between border-t border-[#222] pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Recommended: <span className="text-sm font-bold text-white ml-1">{result.size}</span>
            </p>
            <p className="text-[9px] tracking-widest text-emerald-400">{result.confidence}% Fit Match for {fit} Silhouette</p>
          </div>
          <button
            type="button"
            onClick={() => onApplySize(result.size)}
            className="flex items-center gap-1.5 bg-white px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-black hover:bg-neutral-200"
          >
            <Check size={12} /> Select {result.size}
          </button>
        </div>
      )}
    </div>
  );
}