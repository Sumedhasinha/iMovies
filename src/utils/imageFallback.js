// src/utils/imageFallback.js
// Dynamic SVG fallback generator for posters & backdrops

export function getFallbackPoster(title = 'Movie') {
  const safeTitle = (title || 'Movie').slice(0, 30);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141824"/>
        <stop offset="50%" stop-color="#0a0b0e"/>
        <stop offset="100%" stop-color="#181216"/>
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E50914"/>
        <stop offset="100%" stop-color="#B20710"/>
      </linearGradient>
    </defs>
    <rect width="400" height="600" fill="url(#bg)"/>
    <circle cx="200" cy="220" r="70" fill="url(#accent)" opacity="0.12"/>
    <polygon points="190,195 225,220 190,245" fill="#E50914"/>
    <rect x="50" y="340" width="300" height="3" fill="#E50914" opacity="0.6"/>
    <text x="200" y="390" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">${safeTitle}</text>
    <text x="200" y="420" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">IMovies Cinema Experience</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getFallbackBackdrop(title = 'IMovies') {
  const safeTitle = (title || 'IMovies').slice(0, 40);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F131D"/>
        <stop offset="100%" stop-color="#05070A"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bg)"/>
    <circle cx="640" cy="360" r="280" fill="#E50914" opacity="0.06"/>
    <text x="640" y="370" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="36" font-weight="800" text-anchor="middle">${safeTitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
