import { useState, useRef } from 'react';
import TopBanner from './TopBanner';
import NavLinks from './NavLinks';
import NavIcons from './NavIcons';
import MegaMenu from '../../ui/MegaMenu';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const closeTimer = useRef(null);

  const handleHover = (label) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveMenu(label);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 50);
  };

  const handleMenuEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <TopBanner />
      
      {/* Navbar Container */}
      <div className="bg-black border-b border-white/10">
        <div className="flex items-center justify-between px-8 h-16 relative">
          
          {/* Left Side: Logo and Links together */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <a
              href="#"
              className="text-white font-bold text-2xl tracking-tight select-none"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              A&amp;S
            </a>

            {/* Links next to Logo */}
            <div>
              <NavLinks
                activeMenu={activeMenu}
                onHover={handleHover}
                onLeave={handleLeave}
              />
            </div>
          </div>

          {/* Right Side: Icons */}
          <NavIcons />
        </div>
      </div>

      {/* Mega menu overlay */}
      <div onMouseEnter={handleMenuEnter} onMouseLeave={handleLeave}>
        <MegaMenu activeMenu={activeMenu} />
      </div>
    </header>
  );
};

export default Navbar;