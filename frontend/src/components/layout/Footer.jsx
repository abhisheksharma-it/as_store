import { FaInstagram, FaYoutube, FaPinterestP, FaXTwitter, FaFacebookF } from 'react-icons/fa6';

const Footer = () => {
  const columns = [
    {
      title: 'Shop',
      links: ['Ladies', 'Men', 'Divided', 'Baby', 'Kids', 'Home'],
    },
    {
      title: 'Corporate Info',
      links: [
        'Career at A&S',
        'About A&S Group',
        'Sustainability',
        'Press',
        'Investor Relations',
        'Corporate Governance',
      ],
    },
    {
      title: 'Help',
      links: [
        'Customer Service',
        'My A&S',
        'Find a Store',
        'Legal & Privacy',
        'Contact',
        'Cookie Notice',
        'Cookie Settings',
      ],
    },
  ];

  const socials = [
    { Icon: FaInstagram, label: 'Instagram' },
    { Icon: FaYoutube, label: 'YouTube' },
    { Icon: FaPinterestP, label: 'Pinterest' },
    { Icon: FaXTwitter, label: 'X / Twitter' },
    { Icon: FaFacebookF, label: 'Facebook' },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-base font-bold uppercase tracking-wide text-white mb-6">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-1">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="block text-sm uppercase font-sans leading-relaxed tracking-wide text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="text-base font-bold uppercase tracking-wide text-white mb-6">
              Become a Member
            </h4>
            <p className="text-sm uppercase font-sans leading-relaxed tracking-wide text-gray-400 mb-4">
              Join now and get 10% off your first purchase!
            </p>
            <a
              href="#"
              className="inline-block text-sm uppercase font-sans tracking-wide text-white border-b border-white/30 pb-1 transition-colors duration-200 hover:border-white"
            >
              Sign Up Now
            </a>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-20 py-12 border-t border-white/10">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white select-none">
            A&amp;S
          </h2>
          <p className="text-sm uppercase font-sans tracking-wide text-gray-400">
            India (Rs.){' '}
            <span className="underline font-bold cursor-pointer hover:text-white transition-colors duration-200">
              Change Region
            </span>
          </p>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-20 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-xs font-sans text-gray-500 max-w-md leading-relaxed">
            The content of this site is copyright-protected and is the property of A&amp;S.
          </p>
          <div className="flex items-center gap-5">
            {socials.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="text-gray-400 transition-colors duration-200 hover:text-white"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 🚨 Yahan se exact wale icons hain (Ditto 100%) */}
      <div className="px-6 md:px-12 lg:px-20 py-8 border-t border-white/10">
        <div className="flex flex-col gap-4">
          <h5 className="text-xs uppercase font-sans tracking-wide text-gray-500">
            Payments
          </h5>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* COD (Exact white box wala text) */}
            <div className="flex items-center justify-center w-14 h-8 rounded bg-white px-1">
              <span className="text-[7px] font-black leading-[1.1] text-center text-black uppercase">
                Cash on<br/>Delivery
              </span>
            </div>

            {/* VISA (Blue Text) */}
            <div className="flex items-center justify-center w-14 h-8 rounded bg-white">
              <svg viewBox="0 0 48 16" className="h-3 w-auto">
                <text x="0" y="13" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fill="#1A1F71" letterSpacing="1">VISA</text>
              </svg>
            </div>

            {/* Mastercard (Red/Yellow Circles) */}
            <div className="flex items-center justify-center w-12 h-8 rounded bg-white">
              <svg viewBox="0 0 32 20" className="h-4 w-auto">
                <circle cx="12" cy="10" r="7" fill="#EB001B" />
                <circle cx="20" cy="10" r="7" fill="#F79E1B" opacity="0.9" />
              </svg>
            </div>

            {/* UPI (Full Flag + Text) */}
            <div className="flex items-center justify-center w-16 h-8 rounded bg-white px-1">
              <svg viewBox="0 0 60 24" className="h-5 w-auto">
                <text x="0" y="13" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900" fill="#333">UPI</text>
                <path d="M26 5 L34 5 L30 12 Z" fill="#f97316" />
                <path d="M34 5 L42 5 L38 12 Z" fill="#8b5cf6" />
                <text x="0" y="21" fontFamily="Arial, sans-serif" fontSize="4" fontWeight="400" fill="#666">UNIFIED PAYMENTS INTERFACE</text>
              </svg>
            </div>

            {/* View all payment options */}
            <a href="#" className="text-sm font-sans underline text-white hover:text-gray-300 ml-2">
              View all payment options
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;