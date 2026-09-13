import { Link } from 'react-router-dom';

const HomeMenu = () => {
  const col1 = [
    'New In',
    'Decor',
    'Bedding',
    'Bath',
    'Tableware',
    'Cushions',
    'Candles',
    'Storage',
  ];

  const col2 = [
    'Trending Now',
    'Fall Collection',
    'Minimalist Living',
    'Cozy Textiles',
    'Sustainable Choice',
    'Premium Selection',
  ];

  const col3 = [
    'Up to 40% Off',
    'Final Sale',
    'Member Exclusive',
    'Gift Cards',
    'A&S Membership',
  ];

  return (
    <div className="grid grid-cols-4 gap-6 p-8">
      {/* Column 1 — Shop by Product */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-500 mb-1">
          Shop by Product
        </h3>
        {col1.map((item) => {
          const slug = item.toLowerCase().replace(/\s+/g, '-');
          return (
            <Link
              key={item}
              to={`/products/home/${slug}`}
              className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-400 hover:text-white transition-colors duration-300"
            >
              {item}
            </Link>
          );
        })}
      </div>

      {/* Column 2 — Trending */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-500 mb-1">
          Trending
        </h3>
        {col2.map((item) => {
          const slug = item.toLowerCase().replace(/\s+/g, '-');
          return (
            <Link
              key={item}
              to={`/products/home/${slug}`}
              className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-400 hover:text-white transition-colors duration-300"
            >
              {item}
            </Link>
          );
        })}
      </div>

      {/* Column 3 — Collections & Offers */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-500 mb-1">
          Collections
        </h3>
        {col3.map((item) => {
          const slug = item.toLowerCase().replace(/\s+/g, '-');
          return (
            <Link
              key={item}
              to={`/products/home/${slug}`}
              className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-400 hover:text-white transition-colors duration-300"
            >
              {item}
            </Link>
          );
        })}
      </div>

      {/* Column 4 — Editorial image */}
      <div className="relative h-full min-h-[400px] overflow-hidden group">
        <img
          src="https://images.pexels.com/photos/30386991/pexels-photo-30386991.jpeg?auto=compress&cs=tinysrgb&h=900&w=600"
          alt="Home editorial"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <Link
          to="/products/home/new-in"
          className="absolute bottom-4 left-4 border border-white/50 px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-light text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          Shop the Look
        </Link>
      </div>
    </div>
  );
};

export default HomeMenu;
