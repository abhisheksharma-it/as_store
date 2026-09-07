const HomeMenu = () => {
  const sections = [
    {
      title: 'Shop',
      links: ['New In', 'Decor', 'Bedding', 'Bath', 'Sale'],
    },
    {
      title: 'Categories',
      links: ['Vases', 'Cushions', 'Candles', 'Tableware', 'Storage'],
    },
    {
      title: 'More',
      links: ['Sustainability', 'Editorial', 'Gift Cards', 'Membership'],
    },
  ];

  const cards = [
    {
      img: 'https://images.pexels.com/photos/7019021/pexels-photo-7019021.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      label: 'New Arrivals',
    },
    {
      img: 'https://images.pexels.com/photos/4207780/pexels-photo-4207780.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      label: 'Decor',
    },
    {
      img: 'https://images.pexels.com/photos/19341648/pexels-photo-19341648.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      label: 'Vases',
    },
  ];

  return (
    <div className="flex gap-8 p-8">
      <div className="w-[60%] flex gap-12">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-4">
            <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-light">
              {section.title}
            </h3>
            {section.links.map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/90 text-[11px] uppercase tracking-[0.15em] font-light hover:text-white hover:font-normal transition-all duration-150"
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="w-[40%] flex flex-col gap-4">
        {cards.map((card) => (
          <a key={card.label} href="#" className="group block relative overflow-hidden">
            <div className="aspect-[3/4] w-full overflow-hidden bg-white/5">
              <img
                src={card.img}
                alt={card.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="absolute bottom-3 left-3 text-white text-[10px] uppercase tracking-[0.2em] font-light">
              {card.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default HomeMenu;
