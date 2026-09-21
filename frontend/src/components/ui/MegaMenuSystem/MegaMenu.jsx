import LadiesMenu from './LadiesMenu';
import MenMenu from './MenMenu';
import KidsMenu from './KidsMenu';
import HomeMenu from './HomeMenu';
import BeautyMenu from './BeautyMenu';

const menuComponents = {
  Ladies: LadiesMenu,
  Men: MenMenu,
  Kids: KidsMenu,
  Home: HomeMenu,
  Beauty: BeautyMenu,
};

const MegaMenu = ({ activeMenu, onClose }) => {
  const ActiveMenuComponent = activeMenu ? menuComponents[activeMenu] : null;

  // Kisi bhi link (<a> tag) par click hote hi menu band ho jayega
  const handleMenuClick = (e) => {
    if (e.target.closest('a') && onClose) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleMenuClick}
      className={`absolute top-full left-0 h-[calc(100vh-100%)] w-[45vw] bg-black overflow-y-auto transition-all duration-300 ease-out z-50 ${
        activeMenu
          ? 'opacity-100 visible translate-y-0'
          : 'opacity-0 invisible -translate-y-2 pointer-events-none'
      } [&::-webkit-scrollbar]:hidden`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {ActiveMenuComponent && <ActiveMenuComponent onClose={onClose} />}
    </div>
  );
};

export default MegaMenu;