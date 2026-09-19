import { useState, useRef } from 'react';
import TopBanner from './TopBanner';
import NavLinks from './NavLinks';
import NavIcons from './NavIcons';
import MegaMenu from "../../ui/MegaMenuSystem/MegaMenu";

const Navbar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const closeTimer = useRef(null);

  // Triggered by NavLinks onHover
  const handleMenuEnter = (category) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveCategory(category);
  };

  // Triggered by NavLinks onLeave or MegaMenu onMouseLeave
  const handleMenuLeave = () => {
    closeTimer.current = setTimeout(() => {
      setActiveCategory(null);
    }, 300);
  };

  // Keeps the menu open when cursor moves down into the drawer
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

            {/* Exactly matching the props your NavLinks.jsx is expecting */}
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
        <MegaMenu activeMenu={activeCategory} />
      </div>
    </header>
  );
};

export default Navbar;