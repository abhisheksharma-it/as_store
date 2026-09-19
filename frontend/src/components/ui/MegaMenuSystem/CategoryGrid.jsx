const CategoryGrid = () => {
  const categories = [
    {
      name: 'Suits & Tailoring',
      img: 'https://images.pexels.com/photos/38399171/pexels-photo-38399171.jpeg?auto=compress&cs=tinysrgb&h=1200&w=960',
    },
    {
      name: 'T-Shirts & Tanks',
      img: 'https://images.pexels.com/photos/4118956/pexels-photo-4118956.jpeg?auto=compress&cs=tinysrgb&h=1200&w=960',
    },
    {
      name: 'Shirts',
      img: 'https://images.pexels.com/photos/30916977/pexels-photo-30916977.jpeg?auto=compress&cs=tinysrgb&h=1200&w=960',
    },
    {
      name: 'Streetwear',
      img: 'https://images.pexels.com/photos/29660402/pexels-photo-29660402.jpeg?auto=compress&cs=tinysrgb&h=1200&w=960',
    },
    {
      name: 'Outerwear',
      img: 'https://images.pexels.com/photos/7880141/pexels-photo-7880141.jpeg?auto=compress&cs=tinysrgb&h=1200&w=960',
    },
    {
      name: 'Accessories',
      img: 'https://images.pexels.com/photos/7236438/pexels-photo-7236438.jpeg?auto=compress&cs=tinysrgb&h=1200&w=960',
    },
  ];

  return (
    <section className="bg-white px-6 md:px-12 lg:px-20 py-16 md:py-24">
      {/* Section heading */}
      <div className="mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black mb-2">
          New Season Edit
        </h2>
        <p className="text-sm font-light text-gray-400 tracking-wide">
          Curated categories for the modern man
        </p>
      </div>

      {/* Massive 2-column campaign grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 md:gap-y-20">
        {categories.map((cat) => (
          <a key={cat.name} href="#" className="group block">
            {/* Editorial image — 4:5 aspect ratio */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
              <img
                src={cat.img}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* Minimal left-aligned text */}
            <div className="mt-4 flex flex-col items-start">
              <span className="text-sm font-normal uppercase tracking-[0.1em] text-black">
                {cat.name}
              </span>
              <span className="mt-1.5 text-[11px] font-light uppercase tracking-[0.15em] text-gray-400 transition-colors duration-200 group-hover:text-black">
                Explore
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
