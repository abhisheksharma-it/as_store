// src/components/ai/VisualUploadBar.jsx
import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';

export default function VisualUploadBar({ imagePreview, onSelectImage, onClear }) {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const fullDataUrl = reader.result;
      const base64String = fullDataUrl.split(',')[1];
      onSelectImage({
        preview: fullDataUrl,
        base64: base64String,
        mimeType: file.type || 'image/jpeg',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="flex items-center">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {imagePreview ? (
        <div className="relative mr-2 h-9 w-9 shrink-0 border border-white/40 bg-neutral-900">
          <img src={imagePreview} alt="Upload preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-1.5 -right-1.5 bg-white text-black rounded-full p-0.5 hover:bg-neutral-300"
          >
            <X size={10} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          title="Visual Search: Upload outfit photo"
          className="mr-2 p-1.5 text-neutral-400 hover:text-white transition-colors"
        >
          <Camera size={16} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}