const MenMenu = () => {
  const sections = [
    {
      title: 'Shop',
      links: ['New In', 'Clothing', 'Shoes', 'Accessories', 'Sale'],
    },
    {
      title: 'Categories',
      links: ['T-Shirts', 'Shirts', 'Trousers', 'Suits', 'Outerwear'],
    },
    {
      title: 'More',
      links: ['Sustainability', 'Editorial', 'Gift Cards', 'Membership'],
    },
  ];

  const cards = [
    {
      img: 'https://images.pexels.com/photos/29173359/pexels-photo-29173359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      label: 'New Arrivals',
    },
    {
      img: 'https://images.pexels.com/photos/17806235/pexels-photo-17806235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      label: 'Essentials',
    },
    {
      img: 'https://images.pexels.com/photos/13885989/pexels-photo-13885989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      label: 'Outerwear',
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

export default MenMenu;
