import { useState } from "react";
import { Plus } from "lucide-react";

export default function ProductGallery({ product, displayImages, formatImageUrl }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <>
      <section className="w-full lg:w-[60%] flex flex-col gap-1">
        {/* Pehli Badi Image */}
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

        {/* Baaki Images ka Grid */}
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

      {/* LIGHTBOX MODAL */}
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
    </>
  );
}