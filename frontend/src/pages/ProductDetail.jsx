import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Heart, Plus, Minus } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useNavigate } from "react-router-dom";

const Accordion = ({ title, content, isOpen, onToggle }) => {
  if (!content) return null;
  return (
    <div className="border-b border-white/20">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-[11px] uppercase tracking-widest text-white transition-colors hover:text-gray-400"
      >
        <span>{title}</span>
        {isOpen ? <Minus size={14} strokeWidth={1} /> : <Plus size={14} strokeWidth={1} />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] pb-6" : "max-h-0"}`}>
        <p className="text-xs font-light leading-relaxed text-gray-400 whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
};

export default function ProductDetail() {
  const { id } = useParams();
  
  const { addToCart } = useCartStore();
  const { wishlist, toggleWishlist } = useWishlistStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [openSections, setOpenSections] = useState([]); 
  
  const [lightboxImage, setLightboxImage] = useState(null);

  const SIZES = ["XS", "S", "M", "L", "XL"];
  const PLACEHOLDER = "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=800";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://127.0.0.1:8000/api/catalog/product/${id}/`);
        setProduct(data.product || data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatImageUrl = (rawImage) => {
    if (!rawImage) return PLACEHOLDER;
    const imgStr = typeof rawImage === 'string' ? rawImage : rawImage.image;
    if (!imgStr) return PLACEHOLDER;
    
    if (imgStr.startsWith('http')) return imgStr;
    if (imgStr.startsWith('/')) return `http://127.0.0.1:8000${imgStr}`;
    return `http://127.0.0.1:8000/media/${imgStr}`;
  };

  const displayImages = useMemo(() => {
    if (!product) return [];
    
    let allImages = [];
    if (product.image_url || product.image) {
      allImages.push(product.image_url || product.image);
    }
    if (product.gallery_images && Array.isArray(product.gallery_images)) {
      allImages = [...allImages, ...product.gallery_images];
    }
    if (allImages.length === 0) {
       allImages = [{ image: PLACEHOLDER }];
    }
    return allImages;
  }, [product]);

  // 🔴 REAL FIX: Backend Data Extraction (Nested vs Flat)
  let deptName = "";
  let catName = "";

  if (product) {
    catName = String(typeof product.category === 'object' ? product.category?.name : product.category_name || product.category || '').toUpperCase();
    deptName = String(typeof product.department === 'object' ? product.department?.name : product.department_name || product.department || product.category?.department?.name || '').toUpperCase();
  }

  // Ab filter 100% perfectly kaam karega
  const isClothing = !deptName.includes('BEAUTY') && !deptName.includes('HOME') && !catName.includes('BEAUTY') && !catName.includes('HOME');

  const handleAddToBag = () => {
    if (!product || product.stock <= 0) return;
    
    if (isClothing && !selectedSize) return; 

    const safeImage = formatImageUrl(displayImages[0]); 
    const cartPayload = { ...product, image: safeImage };
    
    const finalSize = isClothing ? selectedSize : 'Standard';
    
    addToCart(cartPayload, 1, finalSize);
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => 
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  if (loading) return <div className="min-h-screen bg-black py-32 text-center tracking-widest text-[11px] uppercase text-white">Loading...</div>;
  if (error || !product) return <div className="min-h-screen bg-black py-32 text-center tracking-widest text-[11px] uppercase text-red-500">{error || "Not Found"}</div>;

  const isWishlisted = wishlist.some((item) => item.product === product.id || item.product?.id === product.id);

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans relative">
      <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-10">
        
        <nav className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            {/* 🔴 Breadcrumb ab fix ho jayega */}
            <li><span className="hover:text-white transition-colors">{catName || "Category"}</span></li>
            <li>/</li>
            <li className="text-white">{product.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          <section className="w-full lg:w-[60%] flex flex-col gap-1">
            {displayImages.length > 0 && (
              <div 
                className="w-full aspect-[3/4] bg-[#111] cursor-pointer overflow-hidden" 
                onClick={() => setLightboxImage(displayImages[0])}
              >
                <img
                  src={formatImageUrl(displayImages[0])}
                  alt={`${product.title} - Main`}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            )}

            {displayImages.length > 1 && (
              <div className="grid grid-cols-2 gap-1">
                {displayImages.slice(1).map((img, idx) => (
                  <div 
                    key={idx} 
                    className="aspect-[3/4] bg-[#111] cursor-pointer overflow-hidden" 
                    onClick={() => setLightboxImage(img)}
                  >
                    <img
                      src={formatImageUrl(img)}
                      alt={`${product.title} - ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="w-full lg:w-[40%] lg:sticky lg:top-24 lg:self-start lg:pr-8">
            
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-sm font-light uppercase tracking-widest text-white leading-relaxed pr-4">
                {product.title}
                {product.is_new && <span className="ml-2 text-[9px] font-bold text-gray-500 align-top">*NEW</span>}
              </h1>
              <button onClick={() => toggleWishlist(product.id)} className="shrink-0 p-1 mt-1 hover:scale-110 transition-transform">
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-white stroke-white" : "stroke-white"}`} strokeWidth={1} />
              </button>
            </div>

            <div className="mb-8 mt-4">
              <p className="text-[13px] font-light tracking-wider text-white">
                Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-gray-500">MRP inclusive of all taxes</p>
            </div>

            <div className="mb-8 border-t border-white/20 pt-8">
              <p className="mb-4 text-[10px] uppercase tracking-widest text-gray-400">
                COLOUR: <span className="text-white ml-1">{product.color_name || 'Standard'}</span>
              </p>
              <div className="flex gap-2">
                <div className="h-16 w-12 border border-white p-[1px]">
                  <img src={formatImageUrl(displayImages[0])} alt="swatch" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>

            {/* 🔴 SIZES: Sirf clothing ke liye dikhega */}
            {isClothing && (
              <div className="mb-8">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border py-3 text-[11px] font-light tracking-widest transition-colors ${
                        selectedSize === size 
                          ? "border-white bg-white text-black font-medium" 
                          : "border-white/30 bg-transparent text-white hover:border-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-[9px] uppercase tracking-widest mt-4">
                  {product.stock > 0 ? (
                    <span className="text-[#34d399]">{product.stock} items left</span>
                  ) : (
                    <span className="text-red-500">Out of stock</span>
                  )}
                  <button className="text-gray-400 underline underline-offset-4 hover:text-white">SIZE GUIDE</button>
                </div>
              </div>
            )}
            
            {/* Out of stock message for Beauty/Home */}
            {!isClothing && product.stock <= 0 && (
              <div className="mb-4 text-[9px] uppercase tracking-widest text-red-500">
                Out of stock
              </div>
            )}

            <button
              onClick={handleAddToBag}
              disabled={(isClothing && !selectedSize) || product.stock <= 0}
              className={`mb-6 w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                (!isClothing || selectedSize) && product.stock > 0
                  ? "bg-white text-black hover:bg-gray-200"
                  : "cursor-not-allowed bg-[#222] text-gray-500 border border-[#333]"
              }`}
            >
              {product.stock <= 0 ? "Out of stock" : ((isClothing && !selectedSize) ? "Select a Size" : "ADD TO BAG")}
            </button>

            <div className="mb-4 flex flex-col space-y-3 text-[10px] uppercase tracking-widest text-gray-400 pb-6 border-b border-white/20">
              <button className="text-left hover:text-white flex items-center gap-2">
                <span>Find in store</span>
              </button>
              <button className="text-left hover:text-white">
                NOT AVAILABLE IN STORES
              </button>
            </div>

            <div className="mt-2">
              <Accordion
                title="DESCRIPTION"
                content={product.description_and_fit || product.description}
                isOpen={openSections.includes("description")}
                onToggle={() => toggleSection("description")}
              />
              <Accordion
                title="MATERIALS"
                content={product.materials}
                isOpen={openSections.includes("materials")}
                onToggle={() => toggleSection("materials")}
              />
              <Accordion
                title="DELIVERY & PAYMENT"
                content={product.delivery_and_payment}
                isOpen={openSections.includes("delivery")}
                onToggle={() => toggleSection("delivery")}
              />
            </div>
          </aside>
        </div>
      </div>

      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-6 right-6 lg:right-10 text-white hover:text-gray-400 p-2 transition-transform hover:rotate-90"
            onClick={() => setLightboxImage(null)}
          >
            <Plus size={36} className="rotate-45" strokeWidth={1} />
          </button>
          
          <img
            src={formatImageUrl(lightboxImage)}
            alt="Enlarged View"
            className="max-h-[90vh] max-w-[95vw] lg:max-w-[70vw] object-contain cursor-default"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

    </div>
  );
}