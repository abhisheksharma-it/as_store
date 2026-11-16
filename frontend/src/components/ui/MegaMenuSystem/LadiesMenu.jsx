import { Link } from 'react-router-dom';

const LadiesMenu = ({ onClose }) => {
  const col1 = [
    'New In', 'Dresses', 'Tops', 'Bottoms',
    'Knitwear', 'Outerwear', 'Shoes', 'Accessories',
  ];

  const col2 = [
    'Trending Now', 'Fall Essentials', 'Workwear',
    'Evening Wear', 'Sustainable Choice', 'Premium Selection',
  ];

  const col3 = [
    'Up to 50% Off', 'Final Sale', 'Member Exclusive',
    'Gift Cards', 'A&S Membership',
  ];

  const renderLinks = (items) =>
    items.map((item) => {
      const slug = item.toLowerCase().replace(/\s+/g, '-');
      return (
        <Link
          key={item}
          to={`/products/ladies/${slug}`}
          onClick={onClose}
          className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-400 hover:text-white transition-colors duration-300"
        >
          {item}
        </Link>
      );
    });

  return (
    <div className="grid grid-cols-4 gap-6 p-8">
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-500 mb-1">
          Shop by Product
        </h3>
        {renderLinks(col1)}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-500 mb-1">
          Trending
        </h3>
        {renderLinks(col2)}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-500 mb-1">
          Collections
        </h3>
        {renderLinks(col3)}
      </div>

      <div className="relative h-full min-h-[400px] overflow-hidden group">
        <img
          src="https://images.pexels.com/photos/15432337/pexels-photo-15432337.jpeg?auto=compress&cs=tinysrgb&h=900&w=600"
          alt="Ladies editorial"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <Link
          to="/products/ladies/shop-the-look"
          onClick={onClose}
          className="absolute bottom-4 left-4 border border-white/50 px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-light text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          Shop the Look
        </Link>
      </div>
    </div>
  );
};

export default LadiesMenu;