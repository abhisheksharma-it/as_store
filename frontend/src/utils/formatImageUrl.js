// src/utils/formatImageUrl.js
import { API_BASE_URL } from './constants';

export const formatImageUrl = (productOrUrl) => {
  const raw =
    typeof productOrUrl === 'string'
      ? productOrUrl
      : productOrUrl?.image_url || productOrUrl?.image || '';

  if (!raw) return '';
  if (raw.startsWith('http')) return raw;
  if (raw.startsWith('/')) return `${API_BASE_URL}${raw}`;
  return `${API_BASE_URL}/media/${raw}`;
};