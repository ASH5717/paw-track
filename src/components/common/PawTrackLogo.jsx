// PAW TRACK — Brand logo (SVG)

export function PawTrackLogo({ size = 38, light = false }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className="relative flex items-center justify-center rounded-xl shadow-sm"
        style={{
          width: size,
          height: size,
          backgroundColor: light ? '#FAF8F1' : '#174D37',
        }}
      >
        <svg
          width={size * 0.68}
          height={size * 0.68}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Location Pin Outline */}
          <path
            d="M18 3C11.3726 3 6 8.37258 6 15C6 22.8 18 33 18 33C18 33 30 22.8 30 15C30 8.37258 24.6274 3 18 3Z"
            stroke={light ? '#174D37' : '#E8A64A'}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Paw Main Pad */}
          <path
            d="M18 14.5C15.8 14.5 14 16.3 14 18.2C14 19.6 15.1 20.5 16.4 20.5C17.1 20.5 17.5 20.2 18 20.2C18.5 20.2 18.9 20.5 19.6 20.5C20.9 20.5 22 19.6 22 18.2C22 16.3 20.2 14.5 18 14.5Z"
            fill={light ? '#174D37' : '#FAF8F1'}
          />
          {/* Paw Toe Beans */}
          <circle cx="13.5" cy="13.2" r="1.45" fill={light ? '#174D37' : '#FAF8F1'} />
          <circle cx="16.4" cy="11.2" r="1.45" fill={light ? '#174D37' : '#FAF8F1'} />
          <circle cx="19.6" cy="11.2" r="1.45" fill={light ? '#174D37' : '#FAF8F1'} />
          <circle cx="22.5" cy="13.2" r="1.45" fill={light ? '#174D37' : '#FAF8F1'} />
        </svg>
      </div>
      <div className="leading-tight">
        <span
          className="font-extrabold tracking-tight text-lg block"
          style={{ color: light ? '#FAF8F1' : '#174D37' }}
        >
          PAW TRACK
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-widest block"
          style={{ color: light ? '#A5B99A' : '#5C6B62' }}
        >
          Track · Protect · Care
        </span>
      </div>
    </div>
  );
}

// Deterministic Vector QR Code based on Animal Unique ID
