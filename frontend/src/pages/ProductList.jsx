import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const { department, category } = useParams();
  
  // State variables for storing backend data and loading status
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API call function
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Abhi hum search API hit kar rahe hain bina parameters ke taaki sab products aa jayein
        const response = await axios.get('http://127.0.0.1:8000/api/catalog/search/');
        setProducts(response.data); // Backend se jo array aayega usko state me set kar diya
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Is backend running?");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty array ka matlab ye component mount hote hi chalega

  // Filtering based on URL parameters (abhi sirf frontend pe filter kar rahe hain, baad me backend query likhenge)
  const filteredProducts = category 
    ? products.filter(p => p.category_name?.toLowerCase().includes(category.toLowerCase().replace('-', ' ')))
    : products;

  let pageTitle = 'New Arrivals';
  if (category) {
    pageTitle = category.replace('-', ' '); 
  } else if (department) {
    pageTitle = department;
  }

  // Placeholder image just in case image_url is null
  const placeholderImage = 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <div className="pt-28 pb-20 min-h-screen text-white px-6 md:px-12 max-w-[1800px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-4 md:mb-0">
          {pageTitle}
        </h1>
        <div className="text-xs uppercase tracking-widest cursor-pointer flex items-center gap-2 hover:text-gray-300 transition-colors">
          <span>Sort By: Recommended</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="space-y-10 sticky top-32">
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-5">Category</h3>
              <ul className="space-y-4 text-xs font-light tracking-wide">
                <li className="hover:text-white cursor-pointer transition-colors">All Clothing</li>
                <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Coats & Jackets</li>
                <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Knitwear</li>
                <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Trousers</li>
                <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Accessories</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-5">Size</h3>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button 
                    key={size} 
                    className="border border-white/20 w-12 h-12 flex items-center justify-center text-xs font-light hover:border-white hover:bg-white hover:text-black transition-all duration-300"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
             <div className="py-20 text-center text-gray-400 text-sm tracking-widest uppercase">
                Loading collection...
             </div>
          ) : error ? (
            <div className="py-20 text-center text-red-400 text-sm tracking-widest uppercase">
                {error}
             </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12">
              {filteredProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer block">
                  <div className="aspect-[3/4] overflow-hidden mb-4 bg-[#111] relative">
                    <img
                      src={product.image_url || placeholderImage}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                      <button 
                        className="w-full bg-white text-black text-[10px] uppercase tracking-[0.2em] font-medium py-3 hover:bg-gray-200 transition-colors"
                        onClick={(e) => {
                          e.preventDefault(); 
                          console.log('Quick add feature coming soon for', product.title);
                        }}
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-[11px] font-light tracking-widest text-gray-300 mb-1.5 line-clamp-1 w-full uppercase">
                      {product.title}
                      {product.is_new && <span className="ml-2 text-white font-bold">*NEW</span>}
                    </h2>
                    <p className="text-xs tracking-wide">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
             <div className="py-20 text-center text-gray-400 text-sm tracking-widest uppercase">
                Products for this category are arriving soon.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;