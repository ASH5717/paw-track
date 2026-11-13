// PAW TRACK — Community rating on a Harmful (1) → Excellent (5) scale

import { useState } from 'react';

export const RATING_LEVELS = ['Harmful', 'Poor', 'Average', 'Good', 'Excellent'];

const clampLevel = (value) => Math.min(5, Math.max(1, Math.round(value)));
const ratingColor = (value) =>
  value >= 4 ? '#174D37' : value >= 3 ? '#E8A64A' : '#C0392B';

// Read-only summary: numeric score, gauge bar and qualitative label.
export function RatingSummary({ value = 0, count = 0, compact = false, className = '' }) {
  const pct = Math.min(100, (value / 5) * 100);
  const label = value > 0 ? RATING_LEVELS[clampLevel(value) - 1] : 'Unrated';
  const color = value > 0 ? ratingColor(value) : '#C9CFC4';

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-xs font-extrabold text-[#26332B]">
          {value > 0 ? value.toFixed(1) : '—'}
        </span>
        <span className="relative h-1.5 w-16 rounded-full bg-stone-200 overflow-hidden">
          <span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </span>
        <span className="text-[11px] font-semibold text-[#5C6B62]">
          {label}
          {count > 0 ? ` · ${count}` : ''}
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-extrabold text-[#26332B]">
          {value > 0 ? value.toFixed(1) : '—'}
        </span>
        <span className="text-xs font-bold text-[#5C6B62]">/ 5</span>
        <span
          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-stone-200 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-[#5C6B62] mt-1">
        <span>Harmful</span>
        <span>Excellent</span>
      </div>
      <p className="text-xs text-[#5C6B62] mt-1.5">
        {count > 0
          ? `Average of ${count} community rating${count > 1 ? 's' : ''}`
          : 'Be the first to rate this dog'}
      </p>
    </div>
  );
}

// Interactive slider input.
export function RatingScale({ defaultValue = 4, onRate, className = '' }) {
  const [value, setValue] = useState(defaultValue);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-[#26332B]">
          Your rating: {RATING_LEVELS[value - 1]}
        </span>
        <span className="text-xs font-extrabold" style={{ color: ratingColor(value) }}>
          {value} / 5
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => {
          setValue(Number(e.target.value));
          setSubmitted(false);
        }}
        className="w-full accent-[#174D37] cursor-pointer"
        aria-label="Rate this dog from Harmful to Excellent"
      />
      <div className="flex justify-between text-[10px] font-bold text-[#5C6B62]">
        <span>Harmful</span>
        <span>Excellent</span>
      </div>
      <button
        type="button"
        disabled={submitted}
        onClick={() => {
          onRate?.(value);
          setSubmitted(true);
        }}
        className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-colors ${
          submitted
            ? 'bg-stone-100 text-[#5C6B62] cursor-default'
            : 'bg-[#174D37] text-white hover:bg-[#226B4D]'
        }`}
      >
        {submitted ? 'Rating submitted — thanks!' : 'Submit Rating'}
      </button>
    </div>
  );
}
