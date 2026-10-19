// src/utils/formatImageUrl.js
export const formatImageUrl = (productOrUrl) => {
  const raw =
    typeof productOrUrl === 'string'
      ? productOrUrl
      : productOrUrl?.image_url || productOrUrl?.image || '';

  if (!raw) return '';
  if (raw.startsWith('http')) return raw;
  if (raw.startsWith('/')) return `http://127.0.0.1:8000${raw}`;
  return `http://127.0.0.1:8000/media/${raw}`;
};