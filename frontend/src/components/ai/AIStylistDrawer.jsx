// src/components/ai/AIStylistDrawer.jsx
import React, { useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import StylistMessage from './StylistMessage';
import VisualUploadBar from './VisualUploadBar';
import { API_BASE_URL } from '../../utils/constants';

const QUICK_PROMPTS = [
  'Minimalist outfit under ₹2,500',
  'Trending Home Decor',
  'Smart casual weekend look',
];

export default function AIStylistDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [imageObj, setImageObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Welcome to A&S AI Concierge. Ask for styling advice or upload an outfit photo (📷) to find matching pieces from our live catalog.',
      products: [],
    },
  ]);

  const sendMessage = async (promptText) => {
    const query = (promptText ?? input).trim();
    if ((!query && !imageObj) || loading) return;

    const userDisplay = imageObj ? `📷 [Visual Search] ${query || 'Match this outfit'}` : query;
    setMessages((prev) => [...prev, { role: 'user', text: userDisplay }]);
    setInput('');
    const currentImg = imageObj;
    setImageObj(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/ai-stylist/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          image_base64: currentImg?.base64 || '',
          mime_type: currentImg?.mimeType || 'image/jpeg',
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.reply || 'Here are the closest matches:', products: data.products || [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Styling service is temporarily unavailable.', products: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 border border-white/20 bg-black px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-2xl hover:bg-white hover:text-black transition-all"
      >
        <Sparkles size={14} /> AI Stylist & Lens
      </button>

      {isOpen && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs" onClick={() => setIsOpen(false)} />}

      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#222] bg-black text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#222] px-6 py-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em]">
            <Sparkles size={15} /> A&S Visual Stylist
          </div>
          <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {messages.map((m, idx) => (
            <StylistMessage key={idx} msg={m} onClose={() => setIsOpen(false)} />
          ))}
          {loading && (
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 animate-pulse">
              Analyzing style & scanning live inventory...
            </p>
          )}
        </div>

        <div className="border-t border-[#222] bg-[#0a0a0a] p-4 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="shrink-0 border border-[#222] bg-black px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] text-neutral-400 hover:border-white hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center border border-[#333] bg-black px-3 py-2 focus-within:border-white"
          >
            <VisualUploadBar
              imagePreview={imageObj?.preview}
              onSelectImage={setImageObj}
              onClear={() => setImageObj(null)}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="UPLOAD PHOTO OR ASK FOR OUTFITS..."
              className="flex-1 bg-transparent text-[11px] tracking-wider text-white placeholder:text-neutral-600 outline-none"
            />
            <button type="submit" disabled={loading} className="p-1 text-neutral-400 hover:text-white">
              <Send size={15} />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}