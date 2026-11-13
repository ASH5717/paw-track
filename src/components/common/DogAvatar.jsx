// PAW TRACK — Dog avatar with a built-in default placeholder (like a social default pfp)

const DEFAULT_DOG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#EAF0E6"/>
  <g fill="#1F4D38">
    <path d="M34 40C24 30 14 26 15 40c1 10 9 14 17 10z"/>
    <path d="M66 40c10-10 20-14 19 0-1 10-9 14-17 10z"/>
    <circle cx="50" cy="56" r="26"/>
  </g>
  <circle cx="41" cy="53" r="3.6" fill="#EAF0E6"/>
  <circle cx="59" cy="53" r="3.6" fill="#EAF0E6"/>
  <ellipse cx="50" cy="69" rx="12" ry="8.5" fill="#EAF0E6"/>
  <ellipse cx="50" cy="64.5" rx="4.2" ry="3.2" fill="#1F4D38"/>
  <path d="M50 68v3.5M50 71.5c-1.8 2.6-4.4 2.4-5.6.8M50 71.5c1.8 2.6 4.4 2.4 5.6.8" stroke="#1F4D38" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`;

export const DEFAULT_DOG_AVATAR = `data:image/svg+xml,${encodeURIComponent(DEFAULT_DOG_SVG)}`;

export function DogAvatar({ animal, src, alt, className = '' }) {
  const photo = src || animal?.photos?.[0];
  return (
    <img
      src={photo || DEFAULT_DOG_AVATAR}
      alt={alt || animal?.name || 'Community dog'}
      className={className}
    />
  );
}
