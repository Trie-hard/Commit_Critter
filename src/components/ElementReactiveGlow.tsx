import React from 'react';
import { CritterElement } from '../types/critter';

interface ElementReactiveGlowProps {
  element: CritterElement;
}

// Each element gets a dual-color ambient glow that bleeds across the page
const ELEMENT_GLOWS: Record<CritterElement, { color1: string; color2: string; label: string }> = {
  FLORA: {
    color1: 'rgba(34,197,94,0.12)',
    color2: 'rgba(16,185,129,0.07)',
    label:  'Flora',
  },
  VOLT: {
    color1: 'rgba(234,179,8,0.13)',
    color2: 'rgba(249,115,22,0.07)',
    label:  'Volt',
  },
  FERRO: {
    color1: 'rgba(249,115,22,0.14)',
    color2: 'rgba(239,68,68,0.07)',
    label:  'Ferro',
  },
  TIDAL: {
    color1: 'rgba(56,189,248,0.12)',
    color2: 'rgba(6,182,212,0.07)',
    label:  'Tidal',
  },
  PRISM: {
    color1: 'rgba(236,72,153,0.13)',
    color2: 'rgba(167,139,250,0.07)',
    label:  'Prism',
  },
  VOID: {
    color1: 'rgba(139,92,246,0.14)',
    color2: 'rgba(99,102,241,0.07)',
    label:  'Void',
  },
};

export const ElementReactiveGlow: React.FC<ElementReactiveGlowProps> = ({ element }) => {
  const glow = ELEMENT_GLOWS[element] ?? ELEMENT_GLOWS.VOID;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-all duration-[2000ms]"
      aria-hidden="true"
    >
      {/* Top-right primary glow */}
      <div
        className="absolute"
        style={{
          top: '-120px',
          right: '-80px',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${glow.color1} 0%, transparent 65%)`,
          filter: 'blur(40px)',
          transition: 'background 2s ease',
        }}
      />
      {/* Bottom-left secondary glow */}
      <div
        className="absolute"
        style={{
          bottom: '5%',
          left: '-60px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${glow.color2} 0%, transparent 65%)`,
          filter: 'blur(60px)',
          transition: 'background 2s ease',
        }}
      />
    </div>
  );
};
