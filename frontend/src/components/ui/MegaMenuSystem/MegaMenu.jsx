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

const MegaMenu = ({ activeMenu }) => {
  const ActiveMenuComponent = activeMenu ? menuComponents[activeMenu] : null;

  return (
    <div
      className={`absolute top-full left-0 h-[calc(100vh-100%)] w-[45vw] bg-black overflow-y-auto transition-all duration-300 ease-out ${
        activeMenu
          ? 'opacity-100 visible translate-y-0'
          : 'opacity-0 invisible -translate-y-2 pointer-events-none'
      } [&::-webkit-scrollbar]:hidden`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {ActiveMenuComponent && <ActiveMenuComponent />}
    </div>
  );
};

export default MegaMenu;
