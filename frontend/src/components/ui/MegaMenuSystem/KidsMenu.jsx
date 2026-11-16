import { Link } from 'react-router-dom';

const KidsMenu = () => {
  const col1 = [
    'New In',
    'Baby (0-24m)',
    'Kids (2-8y)',
    'Tops',
    'Bottoms',
    'Dresses',
    'Outerwear',
    'Accessories',
  ];

  const col2 = [
    'Trending Now',
    'Back to School',
    'Occasion Wear',
    'Playtime Essentials',
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
          const slug = item
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[()]/g, '');
          return (
            <Link
              key={item}
              to={`/products/kids/${slug}`}
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
              to={`/products/kids/${slug}`}
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
              to={`/products/kids/${slug}`}
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
          src="https://images.pexels.com/photos/35078823/pexels-photo-35078823.jpeg?auto=compress&cs=tinysrgb&h=900&w=600"
          alt="Kids editorial"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <Link
          to="/products/kids/new-in"
          className="absolute bottom-4 left-4 border border-white/50 px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-light text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          Shop the Look
        </Link>
      </div>
    </div>
  );
};

export default KidsMenu;
