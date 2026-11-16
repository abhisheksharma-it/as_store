import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import TopBanner from './TopBanner';
import NavLinks from './NavLinks';
import NavIcons from './NavIcons';
import MegaMenu from "../../ui/MegaMenuSystem/MegaMenu";

const Navbar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const closeTimer = useRef(null);

  const handleMenuEnter = (category) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveCategory(category);
  };

  const handleMenuLeave = () => {
    closeTimer.current = setTimeout(() => {
      setActiveCategory(null);
    }, 300);
  };

  const handleDrawerEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <TopBanner />
      
      <div className="bg-black border-b border-white/10">
        <div className="flex items-center justify-between px-8 h-16 relative">
          
          <div className="flex items-center gap-12">
            <Link
              to="/"
              onClick={() => setActiveCategory(null)}
              className="group flex items-baseline select-none text-2xl font-black tracking-[0.12em] text-white transition-opacity hover:opacity-80"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <span>A</span>
              <span className="mx-0.5 font-serif text-xl italic font-normal text-red-600 transition-transform duration-300 group-hover:scale-110">
                &amp;
              </span>
              <span>S</span>
            </Link>

            <NavLinks 
              activeMenu={activeCategory} 
              onHover={handleMenuEnter} 
              onLeave={handleMenuLeave} 
            />
          </div>

          <NavIcons />
        </div>
      </div>

      {/* Drawer Wrapper */}
      <div 
        onMouseEnter={handleDrawerEnter} 
        onMouseLeave={handleMenuLeave}
      >
        <MegaMenu 
          activeMenu={activeCategory} 
          onClose={() => setActiveCategory(null)} 
        />
      </div>
    </header>
  );
};

export default Navbar;