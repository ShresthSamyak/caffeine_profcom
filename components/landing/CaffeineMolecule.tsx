"use client";

interface CaffeineMoleculeProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function CaffeineMolecule({
  size = 120,
  className = "",
  animated = false,
}: CaffeineMoleculeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer ring — xanthine skeleton */}
      <g opacity="0.9">
        {/* Bonds */}
        <line x1="60" y1="18" x2="88" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="88" y1="35" x2="88" y2="65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="88" y1="65" x2="72" y2="82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="72" y1="82" x2="48" y2="82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="48" y1="82" x2="32" y2="65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="65" x2="32" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="35" x2="60" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        {/* Inner ring */}
        <line x1="48" y1="35" x2="72" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="72" y1="35" x2="80" y2="58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="80" y1="58" x2="60" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="70" x2="40" y2="58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1="58" x2="48" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        {/* Atoms — Nitrogen */}
        <circle cx="60" cy="18" r="5" fill="currentColor" opacity="0.8" />
        <circle cx="88" cy="35" r="4" fill="currentColor" opacity="0.6" />
        <circle cx="88" cy="65" r="4" fill="currentColor" opacity="0.6" />
        <circle cx="48" cy="82" r="5" fill="currentColor" opacity="0.8" />
        <circle cx="32" cy="35" r="4" fill="currentColor" opacity="0.6" />
        <circle cx="32" cy="65" r="4" fill="currentColor" opacity="0.6" />

        {/* Methyl groups (CH3) */}
        <line x1="60" y1="18" x2="60" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="48" y1="82" x2="36" y2="96" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="72" y1="82" x2="84" y2="96" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Methyl tips */}
        <circle cx="60" cy="5" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="35" cy="97" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="85" cy="97" r="3" fill="currentColor" opacity="0.5" />

        {/* Oxygen double bonds */}
        <line x1="88" y1="35" x2="100" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="32" y1="65" x2="20" y2="76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <circle cx="101" cy="23" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="19" cy="77" r="3" fill="currentColor" opacity="0.5" />
      </g>
    </svg>
  );
}
