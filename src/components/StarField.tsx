import React, { useEffect, useRef } from 'react';

// Generates a deterministic but visually organic set of stars
const STAR_COUNT = 120;

interface Star {
  x: number; y: number;
  r: number;
  opacity: number;
  delay: number;
  duration: number;
  color: string;
}

function generateStars(seed: number): Star[] {
  const stars: Star[] = [];
  // Deterministic pseudo-random from seed
  let s = seed;
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
  const colors = [
    'rgba(232,240,253,', // white-blue
    'rgba(167,139,250,', // purple
    'rgba(126,168,216,', // mist blue
    'rgba(0,240,255,',   // neon cyan
  ];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x:        rand() * 100,
      y:        rand() * 100,
      r:        rand() * 1.4 + 0.4,
      opacity:  rand() * 0.7 + 0.2,
      delay:    rand() * 6,
      duration: rand() * 4 + 3,
      color:    colors[Math.floor(rand() * colors.length)],
    });
  }
  return stars;
}

const STARS = generateStars(42);

export const StarField: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Lightweight CSS animation via style attribute — no JS frame loop
  }, []);

  return (
    <div className="star-field select-none" aria-hidden="true">
      {/* SVG star field */}
      <svg
        ref={ref}
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        {STARS.map((star, i) => (
          <circle
            key={i}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.r * 0.25}
            fill={`${star.color}${star.opacity})`}
            style={{
              animation: `starTwinkle1 ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
              transformOrigin: `${star.x}% ${star.y}%`,
            }}
          />
        ))}
      </svg>

      {/* Nebula ambient blobs — purely decorative radial fills */}
      <div
        className="nebula-blob animate-ambient-drift"
        style={{
          width: '600px', height: '600px',
          top: '-100px', right: '-150px',
          background: 'radial-gradient(ellipse, rgba(0,100,200,0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="nebula-blob"
        style={{
          width: '500px', height: '500px',
          bottom: '10%', left: '-100px',
          background: 'radial-gradient(ellipse, rgba(100,0,180,0.1) 0%, transparent 70%)',
          animation: 'ambientDrift 10s ease-in-out infinite alternate-reverse',
        }}
      />
      <div
        className="nebula-blob"
        style={{
          width: '400px', height: '400px',
          top: '40%', left: '40%',
          background: 'radial-gradient(ellipse, rgba(0,180,140,0.06) 0%, transparent 70%)',
          animation: 'ambientDrift 14s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
};
