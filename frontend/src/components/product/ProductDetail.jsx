import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import BeautyProductInfo from "../components/product/BeautyProductInfo";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { addToCart, fetchCart } = useCartStore();
  const { wishlist, toggleWishlist } = useWishlistStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

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

  // SMART LOGIC: Check karo ki product beauty/home ka toh nahi
  let deptName = "";
  let catName = "";
  if (product) {
    catName = String(typeof product.category === 'object' ? product.category?.name : product.category_name || product.category || '').toUpperCase();
    deptName = String(typeof product.department === 'object' ? product.department?.name : product.department_name || product.department || product.category?.department?.name || '').toUpperCase();
  }
  const isClothing = !deptName.includes('BEAUTY') && !deptName.includes('HOME') && !catName.includes('BEAUTY') && !catName.includes('HOME');

  const handleAddToBag = async () => {
    if (!product || product.stock <= 0) return;
    
    // Agar clothing hai aur size nahi chuna, tabhi block karo
    if (isClothing && !selectedSize) return; 

    const safeImage = formatImageUrl(displayImages[0]); 
    const finalSize = isClothing ? selectedSize : 'Standard';
    
    const cartPayload = { 
      product_id: product.id, // Ensure ID is passed for guest cart
      ...product, 
      image: safeImage 
    };
    
    // 1. Token check karo (Login status)
    const token = localStorage.getItem('access') || localStorage.getItem('token');

    if (token) {
      // LOGGED IN USER: Backend API call (Tera purana logic)
      await addToCart(cartPayload, 1, finalSize);
      if (fetchCart) {
          await fetchCart();
      }
    } else {
      // GUEST USER: LocalStorage mein save karo
      const currentLocalCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
      
      // Check if item already exists in local cart
      const existingItemIndex = currentLocalCart.findIndex(
        item => item.product_id === cartPayload.product_id && item.size === finalSize
      );

      if (existingItemIndex > -1) {
        currentLocalCart[existingItemIndex].quantity += 1;
      } else {
        currentLocalCart.push({ ...cartPayload, quantity: 1, size: finalSize });
      }

      localStorage.setItem('guest_cart', JSON.stringify(currentLocalCart));
      
      // Optional: Agar tera zustand store locally update karne ka option deta hai
      // setLocalCartState(currentLocalCart); 
    }
    
    // 3. Chain se cart page par redirect maaro
    navigate('/cart');
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
            <li><span className="hover:text-white transition-colors">{catName || "Category"}</span></li>
            <li>/</li>
            <li className="text-white">{product.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          <ProductGallery 
            product={product} 
            displayImages={displayImages} 
            formatImageUrl={formatImageUrl} 
          />

          {isClothing ? (
            <ProductInfo 
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              isWishlisted={isWishlisted}
              toggleWishlist={toggleWishlist}
              handleAddToBag={handleAddToBag}
            />
          ) : (
            <BeautyProductInfo 
              product={product}
              setSelectedSize={setSelectedSize}
              isWishlisted={isWishlisted}
              toggleWishlist={toggleWishlist}
              handleAddToBag={handleAddToBag}
            />
          )}
          
        </div>
      </div>
    </div>
  );
}