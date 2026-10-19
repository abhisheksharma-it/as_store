// src/components/ui/SearchDrawer.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { formatImageUrl } from '../../utils/formatImageUrl';

const POPULAR_SEARCHES = [
  'CUSHION',
  'SHIRT',
  'JACKET',
  'TROUSERS',
  'DRESS',
  'SWEATER',
];

export default function SearchDrawer({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://127.0.0.1:8000/api/catalog/search/', {
          params: { q: query, search: query },
        });
        const rawData = res.data.results || res.data.products || res.data || [];
        const list = Array.isArray(rawData) ? rawData : [];

        // Client-side fallback filter agar backend saare products return kare
        const qLower = query.toLowerCase();
        const filtered = list.filter(
          (item) =>
            item.title?.toLowerCase().includes(qLower) ||
            item.category?.toLowerCase().includes(qLower) ||
            item.department?.toLowerCase().includes(qLower)
        );
        setResults(filtered);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleProductClick = (id) => {
    onClose();
    setQuery('');
    navigate(`/product/${id}`);
  };

  return (
    <div className={`fixed inset-0 z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      <aside
        className={`absolute right-0 top-0 h-full w-full md:w-[42vw] bg-black border-l border-[#222] text-white flex flex-col transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#222]">
          <Search size={18} strokeWidth={1.5} className="text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH PRODUCTS, CATEGORIES..."
            autoFocus={isOpen}
            className="flex-1 bg-transparent text-xs tracking-[0.2em] uppercase placeholder:text-neutral-600 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[10px] tracking-widest uppercase text-neutral-500 hover:text-white">
              Clear
            </button>
          )}
          <button aria-label="Close search" onClick={onClose} className="text-neutral-400 hover:text-white transition-colors shrink-0 ml-2">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {!query.trim() ? (
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="border border-[#222] bg-[#0a0a0a] px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-neutral-300 hover:border-white hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Searching catalog...</p>
          ) : results.length === 0 ? (
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
              No matching pieces found for "{query}".
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-4">
                Results ({results.length})
              </p>
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleProductClick(item.id)}
                  className="flex items-center gap-4 border border-[#1a1a1a] bg-[#0a0a0a] p-3 hover:border-white/30 cursor-pointer transition-colors group"
                >
                  <img
                    src={formatImageUrl(item)}
                    alt={item.title}
                    className="w-14 h-18 object-cover bg-neutral-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-light uppercase tracking-[0.15em] text-white truncate group-hover:underline">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-400 tracking-wider mt-1">
                      ₹{Number(item.price || 0).toLocaleString('en-IN')}
                    </p>
                    {Number(item.stock ?? 1) <= 0 && (
                      <span className="inline-block mt-1 text-[9px] uppercase tracking-widest text-red-400">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <ArrowUpRight size={16} className="text-neutral-600 group-hover:text-white transition-colors mr-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}