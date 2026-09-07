import Navbar from './components/layout/Navbar';
import CategoryGrid from './components/ui/CategoryGrid';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero section — visible through the transparent 55% right side of the mega menu */}
      <main className="relative w-full h-screen overflow-hidden">
        <img
          src="https://images.pexels.com/photos/27902336/pexels-photo-27902336.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Editorial fashion hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-24 right-24 text-right text-white max-w-md">
          <h1 className="text-5xl font-light tracking-tight mb-4">
            Fall 2026
          </h1>
          <p className="text-sm font-light tracking-wide opacity-80 mb-6">
            Discover the new season — tailored essentials and statement pieces for every moment.
          </p>
          <button className="border border-white/40 px-8 py-3 text-xs uppercase tracking-[0.2em] font-light hover:bg-white hover:text-black transition-all duration-300">
            Shop Now
          </button>
        </div>
      </main>

      {/* Massive 2-column campaign grid */}
      <CategoryGrid />

      {/* Enterprise footer */}
      <Footer />
    </div>
  );
}

export default App;
