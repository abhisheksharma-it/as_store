import { useState, useRef } from 'react';
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
            <a
              href="#"
              className="text-white font-bold text-2xl tracking-tight select-none"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              A&amp;S
            </a>

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
        {/* 🔥 YAHAN CHANGE KIYA HAI: onClose prop add kiya */}
        <MegaMenu 
          activeMenu={activeCategory} 
          onClose={() => setActiveCategory(null)} 
        />
      </div>
    </header>
  );
};

export default Navbar;