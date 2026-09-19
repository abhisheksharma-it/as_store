import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import { Heart } from 'lucide-react'; // 🔴 Naya Import
import { useWishlistStore } from '../store/wishlistStore'; // 🔴 Naya Import

const ProductDetail = () => {
  const { id } = useParams(); 
  const [selectedSize, setSelectedSize] = useState(null);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCartStore();
  
  // 🔴 Wishlist store se data nikala
  const { wishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/catalog/product/${id}/`);
        
        if (response.data.status === 'success') {
          setProduct(response.data.product);
        } else {
          setError("Product not found.");
        }
        
      } catch (err) {
        console.error("Error fetching product detail:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const placeholderImage = 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1200';

  if (loading) return <div className="pt-32 text-center text-white tracking-widest uppercase">Loading Product...</div>;
  if (error) return <div className="pt-32 text-center text-red-500 tracking-widest uppercase">{error}</div>;
  if (!product) return null;

  // 🔴 Check: Kya ye product already wishlist me hai?
  const isFavourited = wishlist.some((item) => item.product === product.id || item.product?.id === product.id);

  return (
    <div className="pt-24 pb-20 min-h-screen text-white max-w-[1800px] mx-auto px-4 md:px-8">
      <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-8 mt-4">
        Home / {product.category || 'Category'} / <span className="text-white">{product.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        <div className="w-full lg:w-[65%] flex flex-col gap-4">
          <img 
            src={product.image_url || placeholderImage} 
            alt={product.title} 
            className="w-full h-auto object-cover bg-[#111]"
          />
        </div>

        <div className="w-full lg:w-[35%]">
          <div className="sticky top-32 space-y-8">
            <div>
              <h1 className="text-2xl font-light tracking-[0.1em] mb-3 uppercase">
                {product.title}
                {product.is_new && <span className="ml-3 text-sm font-bold text-gray-400">*NEW</span>}
              </h1>
              <p className="text-lg font-light">₹{product.price}</p>
            </div>

            <div className="text-sm font-light leading-relaxed text-gray-300">
              <p>{product.description || 'Premium quality piece designed for modern comfort and style. Tailored with care.'}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] uppercase tracking-widest text-gray-400">Select Size</span>
                <span className="text-[11px] underline cursor-pointer text-gray-400 hover:text-white">Size Guide</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border h-12 text-xs font-light transition-all duration-300 ${
                      selectedSize === size 
                        ? 'border-white bg-white text-black' 
                        : 'border-white/20 hover:border-white text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              {product.stock > 0 ? (
                 <p className="mt-3 text-[10px] tracking-widest uppercase text-green-400">
                    {product.stock} items left in stock
                 </p>
              ) : (
                  <p className="mt-3 text-[10px] tracking-widest uppercase text-red-500">
                    Out of stock
                 </p>
              )}
            </div>

            {/* 🔴 ACTION BUTTONS WRAPPER (Cart + Heart) */}
            <div className="flex gap-3">
              <button 
                onClick={() => addToCart(product, 1, selectedSize)}
                className={`flex-1 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
                  selectedSize && product.stock > 0
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-white/10 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!selectedSize || product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : (selectedSize ? 'Add to Bag' : 'Select a Size')}
              </button>

              {/* 🔴 HEART BUTTON */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.id);
                }}
                className="w-[52px] h-[52px] shrink-0 flex items-center justify-center border border-white/20 hover:border-white transition-colors"
              >
                <Heart
                  size={20}
                  strokeWidth={1.5}
                  fill={isFavourited ? "white" : "none"}
                  className="text-white"
                />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;