const BeautyMenu = () => {
  const sections = [
    {
      title: 'Shop',
      links: ['New In', 'Makeup', 'Skincare', 'Fragrance', 'Sale'],
    },
    {
      title: 'Categories',
      links: ['Lips', 'Eyes', 'Face', 'Body', 'Hair'],
    },
    {
      title: 'More',
      links: ['Sustainability', 'Editorial', 'Gift Cards', 'Membership'],
    },
  ];

  const cards = [
    {
      img: 'https://images.pexels.com/photos/7256063/pexels-photo-7256063.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      label: 'New Arrivals',
    },
    {
      img: 'https://images.pexels.com/photos/17566314/pexels-photo-17566314.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      label: 'Makeup',
    },
    {
      img: 'https://images.pexels.com/photos/7258259/pexels-photo-7258259.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      label: 'Eyes',
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

export default BeautyMenu;
