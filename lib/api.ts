const DEFAULT_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://easykosbackend-production.up.railway.app/api'
  : 'http://localhost:8000/api';

const ensureApiSuffix = (url: string): string => {
  const trimmedUrl = url.trim().replace(/\/+$/, '');
  return /\/api$/i.test(trimmedUrl) ? trimmedUrl : `${trimmedUrl}/api`;
};

export const API_URL = ensureApiSuffix(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL);

export const apiConfig = {
  baseUrl: API_URL,
  status: 'UI_ONLY',
  note: 'Backend belum terhubung. Placeholder ini dipakai sampai kontrak API tersedia.',
};
