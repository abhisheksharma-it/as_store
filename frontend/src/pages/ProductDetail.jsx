import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import SizeGuideModal from "../components/product/SizeGuideModal";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import BeautyProductInfo from "../components/product/BeautyProductInfo";

const PLACEHOLDER =
  "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=800";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, fetchCart } = useCartStore();
  const { wishlist, toggleWishlist } = useWishlistStore();

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/catalog/product/${id}/`
        );
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
    const imgStr = typeof rawImage === "string" ? rawImage : rawImage.image;
    if (!imgStr) return PLACEHOLDER;
    if (imgStr.startsWith("http")) return imgStr;
    if (imgStr.startsWith("/")) return `http://127.0.0.1:8000${imgStr}`;
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

  let deptName = "";
  let catName = "";
  if (product) {
    catName = String(
      typeof product.category === "object"
        ? product.category?.name
        : product.category_name || product.category || ""
    ).toUpperCase();
    deptName = String(
      typeof product.department === "object"
        ? product.department?.name
        : product.department_name ||
          product.department ||
          product.category?.department?.name ||
          ""
    ).toUpperCase();
  }

  const isClothing =
    !deptName.includes("BEAUTY") &&
    !deptName.includes("HOME") &&
    !catName.includes("BEAUTY") &&
    !catName.includes("HOME");

  const handleAddToBag = async () => {
    if (!product || product.stock <= 0) return;
    if (isClothing && !selectedSize) return;

    const safeImage = formatImageUrl(displayImages[0]);
    const finalSize = isClothing ? selectedSize : "Standard";
    const cartPayload = {
      product_id: product.id,
      ...product,
      image: safeImage,
    };

    const token =
      localStorage.getItem("access") || localStorage.getItem("token");

    if (token) {
      await addToCart(cartPayload, 1, finalSize);
      if (fetchCart) {
        await fetchCart();
      }
    } else {
      const currentLocalCart =
        JSON.parse(localStorage.getItem("guest_cart")) || [];
      const existingItemIndex = currentLocalCart.findIndex(
        (item) =>
          item.product_id === cartPayload.product_id && item.size === finalSize
      );
      if (existingItemIndex > -1) {
        currentLocalCart[existingItemIndex].quantity += 1;
      } else {
        currentLocalCart.push({
          ...cartPayload,
          quantity: 1,
          size: finalSize,
        });
      }
      localStorage.setItem("guest_cart", JSON.stringify(currentLocalCart));
    }
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-32 text-center text-xs tracking-widest uppercase text-white">
        Loading...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black py-32 text-center text-xs tracking-widest uppercase text-red-500">
        {error || "Not Found"}
      </div>
    );
  }

  const isWishlisted = Array.isArray(wishlist)
    ? wishlist.some(
        (item) => item.product === product.id || item.product?.id === product.id
      )
    : false;

  return (
    <div className="relative min-h-screen w-full bg-black font-sans text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-10">
        <nav className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
            <li>
              <Link to="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <span className="transition-colors hover:text-white">
                {catName || "Category"}
              </span>
            </li>
            <li>/</li>
            <li className="text-white">{product.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <ProductGallery
            product={product}
            displayImages={displayImages}
            formatImageUrl={formatImageUrl}
          />

          {isClothing ? (
            <ProductInfo
              product={product}
              displayImages={displayImages}
              formatImageUrl={formatImageUrl}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              isWishlisted={isWishlisted}
              toggleWishlist={toggleWishlist}
              handleAddToBag={handleAddToBag}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            />
          ) : (
            <BeautyProductInfo
              product={product}
              displayImages={displayImages}
              formatImageUrl={formatImageUrl}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              isWishlisted={isWishlisted}
              toggleWishlist={toggleWishlist}
              handleAddToBag={handleAddToBag}
            />
          )}
        </div>
      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onSelectSize={setSelectedSize}
      />
    </div>
  );
}