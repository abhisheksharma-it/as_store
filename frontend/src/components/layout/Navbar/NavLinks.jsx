const NavLinks = ({ activeMenu, onHover, onLeave }) => {
  const links = ['Ladies', 'Men', 'Kids', 'Home', 'Beauty'];

  return (
    <nav className="flex items-center gap-10">
      {links.map((label) => (
        <div
          key={label}
          onMouseEnter={() => onHover(label)}
          onMouseLeave={onLeave}
          className="relative inline-block"
        >
          <span
            className={`cursor-pointer text-sm transition-all duration-200 ${
              activeMenu === label
                ? 'font-bold text-white tracking-normal'
                : 'font-light text-white/80 tracking-[0.05em] hover:text-white'
            }`}
          >
            {label.toUpperCase()}
          </span>
        </div>
      ))}
    </nav>
  );
};

export default NavLinks;
