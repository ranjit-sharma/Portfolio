/**
 * getAssetUrl — Resolve a stored asset path to an absolute URL in production.
 *
 * Asset paths in the DB are stored as relative paths, e.g. `/uploads/filename.png`.
 * In development, Vite proxies /uploads → localhost:5000 so relative URLs work.
 * In production, if the frontend is hosted on a different origin than the backend
 * (e.g. Vercel + Render), the browser will try to load /uploads/... from the
 * frontend host (e.g. vercel.app) where it doesn't exist, causing broken images.
 *
 * Set VITE_API_URL to your backend's production URL (e.g. https://api.yoursite.com)
 * to prefix all asset paths correctly.
 *
 * If VITE_API_URL is not set (same-origin deployment), relative paths are used as-is.
 */

const API_ORIGIN =
  typeof import.meta !== 'undefined'
    ? (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '')
    : '';

/**
 * Prefix a relative asset path with the backend origin.
 * @param {string} path - e.g. "/uploads/image.png" or "https://...full-url"
 * @returns {string}
 */
export function getAssetUrl(path) {
  if (!path) return '';
  // Already an absolute URL – return as-is
  if (/^https?:\/\//.test(path)) return path;
  // Prefix with backend origin if configured, otherwise keep relative
  return API_ORIGIN ? `${API_ORIGIN}${path}` : path;
}

export default getAssetUrl;
