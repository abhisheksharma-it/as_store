import { Search, X } from 'lucide-react';

const popularSearches = [
  "WOMEN'S LONG SLEEVE TOPS",
  'T-SHIRTS MEN',
  'WOOL COATS',
  'KNIT SWEATERS',
  'PLEATED SKIRTS',
  'LEATHER JACKETS',
];

// 🔴 FIXED: Store hatakar Props (isOpen, onClose) use kar rahe hain
const SearchDrawer = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-500 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-full md:w-[40vw] bg-black text-white flex flex-col transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header / Input */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <Search size={20} strokeWidth={1.5} className="text-white/60 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            autoFocus={isOpen}
            className="flex-1 bg-transparent text-sm font-light tracking-wide placeholder:text-white/40 outline-none pb-1"
          />
          <button
            aria-label="Close search"
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors duration-300 shrink-0"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4 px-6 py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-light">
            Popular Searches
          </h3>
          {popularSearches.map((term) => (
            <a
              key={term}
              href="#"
              className="text-[13px] uppercase tracking-[0.1em] font-light text-gray-300 hover:text-white transition-colors duration-300"
            >
              {term}
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default SearchDrawer;