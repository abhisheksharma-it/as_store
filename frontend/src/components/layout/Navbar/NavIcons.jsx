import { Search, User, Heart, ShoppingBag } from 'lucide-react';

const NavIcons = () => {
  const icons = [
    { Icon: Search, label: 'Search' },
    { Icon: User, label: 'Account' },
    { Icon: Heart, label: 'Wishlist' },
    { Icon: ShoppingBag, label: 'Bag' },
  ];

  return (
    <div className="flex items-center gap-5 text-white">
      {icons.map(({ Icon, label }) => (
        <button
          key={label}
          aria-label={label}
          className="p-1 transition-opacity duration-200 hover:opacity-60"
        >
          <Icon size={20} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
};

export default NavIcons;
