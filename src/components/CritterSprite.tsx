import React, { useState } from 'react';
import { CritterStage, CritterElement, CritterMood } from '../types/critter';
import { soundFx } from '../services/audioEngine';

interface CritterSpriteProps {
  stage: CritterStage;
  element: CritterElement;
  mood: CritterMood;
  onPet?: () => void;
}

// Color palettes per element
const ELEMENT_PALETTES: Record<CritterElement, {
  body: string;
  belly: string;
  accent: string;
  shadow: string;
  glow: string;
  highlight: string;
}> = {
  FLORA: {
    body: '#34d399',
    belly: '#a7f3d0',
    accent: '#059669',
    shadow: '#065f46',
    glow: 'rgba(52, 211, 153, 0.4)',
    highlight: '#6ee7b7',
  },
  VOLT: {
    body: '#fbbf24',
    belly: '#fef08a',
    accent: '#f59e0b',
    shadow: '#b45309',
    glow: 'rgba(251, 191, 36, 0.45)',
    highlight: '#fde047',
  },
  FERRO: {
    body: '#f97316',
    belly: '#fdba74',
    accent: '#c2410c',
    shadow: '#7c2d12',
    glow: 'rgba(249, 115, 22, 0.4)',
    highlight: '#fb923c',
  },
  TIDAL: {
    body: '#38bdf8',
    belly: '#bae6fd',
    accent: '#0284c7',
    shadow: '#0369a1',
    glow: 'rgba(56, 189, 248, 0.4)',
    highlight: '#7dd3fc',
  },
  PRISM: {
    body: '#ec4899',
    belly: '#fbcfe8',
    accent: '#be185d',
    shadow: '#831843',
    glow: 'rgba(236, 72, 153, 0.45)',
    highlight: '#f472b6',
  },
  VOID: {
    body: '#8b5cf6',
    belly: '#ddd6fe',
    accent: '#6d28d9',
    shadow: '#4c1d95',
    glow: 'rgba(139, 92, 246, 0.4)',
    highlight: '#a78bfa',
  },
};

export const CritterSprite: React.FC<CritterSpriteProps> = ({
  stage,
  element,
  mood,
  onPet,
}) => {
  const [petHearts, setPetHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const palette = ELEMENT_PALETTES[element] || ELEMENT_PALETTES.VOLT;

  const handleClick = (e: React.MouseEvent) => {
    soundFx.playPurr();
    if (onPet) onPet();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now(), x, y };
    setPetHearts((prev) => [...prev.slice(-4), newHeart]);

    setTimeout(() => {
      setPetHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);
  };

  // Determine dynamic animation class based on mood
  let animationClass = 'animate-critter-float';
  if (mood === 'HYPED') animationClass = 'animate-bounce-gentle';
  if (mood === 'HAPPY' || mood === 'FEASTING') animationClass = 'animate-wobble-happy';
  if (mood === 'SLEEPING') animationClass = 'opacity-90';

  return (
    <div 
      className="relative w-64 h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={handleClick}
      title="Click to pet your critter! 🐾"
    >
      {/* Floating Pet Hearts */}
      {petHearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute text-2xl pointer-events-none animate-ping text-pink-400 z-30"
          style={{ left: heart.x - 12, top: heart.y - 20 }}
        >
          💖
        </span>
      ))}

      {/* Sleep Zzz Bubbles */}
      {mood === 'SLEEPING' && (
        <div className="absolute -top-4 right-10 flex flex-col items-center pointer-events-none z-30">
          <span className="font-pixel text-xs text-sky-300 animate-sleep-drift">z</span>
          <span className="font-pixel text-sm text-sky-200 animate-sleep-drift delay-300">Z</span>
          <span className="font-pixel text-base text-sky-100 font-bold animate-sleep-drift delay-700">Z</span>
        </div>
      )}

      {/* Hungry Food Thought Bubble */}
      {mood === 'HUNGRY' && (
        <div className="absolute -top-6 right-8 bg-slate-900/90 border-2 border-amber-400 rounded-full px-3 py-1 text-xs text-amber-300 flex items-center gap-1 shadow-lg animate-bounce z-30">
          <span>🍪</span>
          <span className="font-pixel text-[10px]">commits?</span>
        </div>
      )}

      {/* Hyped Stars */}
      {mood === 'HYPED' && (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-2 left-8 text-yellow-300 animate-sparkle text-lg">✨</span>
          <span className="absolute top-4 right-6 text-yellow-300 animate-sparkle delay-200 text-xl">⭐</span>
          <span className="absolute bottom-6 left-6 text-yellow-300 animate-sparkle delay-500 text-sm">✨</span>
        </div>
      )}

      {/* Droopy Teardrop */}
      {mood === 'DROOPY' && (
        <div className="absolute top-16 right-14 text-cyan-400 animate-bounce text-xl pointer-events-none z-30">
          💧
        </div>
      )}

      {/* Stage-based SVG Render */}
      <div 
        className={`w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${animationClass}`}
        style={{ filter: `drop-shadow(0 10px 24px ${palette.glow})` }}
      >
        {stage === 'EGG' && <EggSprite palette={palette} mood={mood} />}
        {stage === 'HATCHLING' && <HatchlingSprite palette={palette} mood={mood} element={element} />}
        {stage === 'JUVENILE' && <JuvenileSprite palette={palette} mood={mood} element={element} />}
        {stage === 'ADULT' && <AdultSprite palette={palette} mood={mood} element={element} />}
        {stage === 'MYTHIC' && <MythicSprite palette={palette} mood={mood} element={element} />}
      </div>
    </div>
  );
};

// ==========================================
// 1. EGG STAGE
// ==========================================
const EggSprite: React.FC<{ palette: typeof ELEMENT_PALETTES['VOLT']; mood: CritterMood }> = ({ palette }) => (
  <svg viewBox="0 0 200 200" className="w-48 h-48">
    <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(0,0,0,0.25)" />
    {/* Egg Base */}
    <ellipse cx="100" cy="115" rx="55" ry="68" fill={palette.body} />
    <ellipse cx="100" cy="125" rx="42" ry="50" fill={palette.belly} />
    {/* Elemental Speckles */}
    <circle cx="80" cy="90" r="7" fill={palette.accent} />
    <circle cx="120" cy="100" r="9" fill={palette.accent} />
    <circle cx="95" cy="140" r="6" fill={palette.accent} />
    <circle cx="75" cy="125" r="5" fill={palette.highlight} />
    {/* Decorative Egg Shell Cracks */}
    <path 
      d="M90 60 L98 75 L92 88 L104 102" 
      stroke={palette.shadow} 
      strokeWidth="3" 
      strokeLinecap="round" 
      fill="none" 
    />
    <path 
      d="M115 70 L110 82 L120 95" 
      stroke={palette.shadow} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      fill="none" 
    />
  </svg>
);

// ==========================================
// 2. HATCHLING STAGE (Baby Dino-Blob)
// ==========================================
const HatchlingSprite: React.FC<{ 
  palette: typeof ELEMENT_PALETTES['VOLT']; 
  mood: CritterMood; 
  element: CritterElement;
}> = ({ palette, mood }) => {
  const isSleeping = mood === 'SLEEPING';
  const isDroopy = mood === 'DROOPY';
  const isHyped = mood === 'HYPED';

  return (
    <svg viewBox="0 0 200 200" className="w-52 h-52">
      <ellipse cx="100" cy="178" rx="65" ry="12" fill="rgba(0,0,0,0.3)" />
      
      {/* Tiny Horn Nubs */}
      <path d="M68 62 Q75 42 85 58 Z" fill={palette.accent} />
      <path d="M132 62 Q125 42 115 58 Z" fill={palette.accent} />

      {/* Main Blob Body */}
      <path 
        d="M50 120 C45 75 75 55 100 55 C125 55 155 75 150 120 C155 155 140 170 100 170 C60 170 45 155 50 120 Z" 
        fill={palette.body} 
      />
      {/* Soft Belly */}
      <ellipse cx="100" cy="132" rx="35" ry="30" fill={palette.belly} />

      {/* Stubby Paws */}
      <ellipse cx="70" cy="165" rx="14" ry="9" fill={palette.accent} />
      <ellipse cx="130" cy="165" rx="14" ry="9" fill={palette.accent} />

      {/* Cute Cheeks */}
      <circle cx="68" cy="125" r="7" fill="#f43f5e" opacity="0.45" />
      <circle cx="132" cy="125" r="7" fill="#f43f5e" opacity="0.45" />

      {/* Eyes */}
      {isSleeping ? (
        // Curved Sleeping Eyes (⌒ ⌒)
        <>
          <path d="M72 108 Q82 102 92 108" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M108 108 Q118 102 128 108" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      ) : isDroopy ? (
        // Droopy Sad Eyes
        <>
          <ellipse cx="82" cy="110" rx="7" ry="9" fill="#1e293b" />
          <ellipse cx="118" cy="110" rx="7" ry="9" fill="#1e293b" />
          <line x1="72" y1="100" x2="90" y2="104" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <line x1="128" y1="100" x2="110" y2="104" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : isHyped ? (
        // Hyped Star Eyes
        <>
          <text x="74" y="116" fontSize="22" textAnchor="middle" fill="#1e293b">★</text>
          <text x="126" y="116" fontSize="22" textAnchor="middle" fill="#1e293b">★</text>
        </>
      ) : (
        // Big Glossy Anime Eyes
        <>
          <ellipse cx="82" cy="108" rx="8" ry="11" fill="#0f172a" />
          <ellipse cx="118" cy="108" rx="8" ry="11" fill="#0f172a" />
          <circle cx="80" cy="104" r="3.5" fill="#ffffff" />
          <circle cx="116" cy="104" r="3.5" fill="#ffffff" />
          <circle cx="84" cy="112" r="1.5" fill="#ffffff" />
          <circle cx="120" cy="112" r="1.5" fill="#ffffff" />
        </>
      )}

      {/* Mouth */}
      {isHyped || mood === 'HAPPY' ? (
        <path d="M92 122 Q100 134 108 122 Z" fill="#e11d48" />
      ) : isDroopy ? (
        <path d="M93 128 Q100 122 107 128" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M93 124 Q100 130 107 124" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
};

// ==========================================
// 3. JUVENILE STAGE (Playful Young Dino)
// ==========================================
const JuvenileSprite: React.FC<{ 
  palette: typeof ELEMENT_PALETTES['VOLT']; 
  mood: CritterMood; 
  element: CritterElement;
}> = ({ palette, mood }) => {
  const isSleeping = mood === 'SLEEPING';
  const isDroopy = mood === 'DROOPY';

  return (
    <svg viewBox="0 0 220 220" className="w-56 h-56">
      <ellipse cx="110" cy="190" rx="75" ry="14" fill="rgba(0,0,0,0.3)" />

      {/* Dynamic Tail */}
      <path d="M150 145 Q190 140 185 110 Q170 120 150 135 Z" fill={palette.body} />
      <circle cx="185" cy="110" r="7" fill={palette.accent} />

      {/* Back Spikes / Ridges */}
      <polygon points="105,45 115,28 120,47" fill={palette.accent} />
      <polygon points="125,55 135,38 138,58" fill={palette.accent} />
      <polygon points="142,70 150,56 153,74" fill={palette.accent} />

      {/* Horns */}
      <path d="M72 58 Q82 32 94 52 Z" fill={palette.accent} />
      <path d="M148 58 Q138 32 126 52 Z" fill={palette.accent} />

      {/* Body */}
      <path 
        d="M55 125 C48 70 80 48 110 48 C140 48 172 70 165 125 C170 165 155 182 110 182 C65 182 50 165 55 125 Z" 
        fill={palette.body} 
      />
      {/* Belly */}
      <ellipse cx="110" cy="138" rx="42" ry="36" fill={palette.belly} />

      {/* Little Wings */}
      <path d="M52 110 Q28 105 38 125 Q48 122 55 118 Z" fill={palette.highlight} />
      
      {/* Paws */}
      <ellipse cx="78" cy="178" rx="16" ry="10" fill={palette.accent} />
      <ellipse cx="142" cy="178" rx="16" ry="10" fill={palette.accent} />

      {/* Cheeks */}
      <circle cx="74" cy="130" r="8" fill="#f43f5e" opacity="0.45" />
      <circle cx="146" cy="130" r="8" fill="#f43f5e" opacity="0.45" />

      {/* Eyes */}
      {isSleeping ? (
        <>
          <path d="M80 110 Q92 102 102 110" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M118 110 Q128 102 140 110" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      ) : isDroopy ? (
        <>
          <ellipse cx="90" cy="112" rx="8" ry="10" fill="#1e293b" />
          <ellipse cx="130" cy="112" rx="8" ry="10" fill="#1e293b" />
        </>
      ) : (
        <>
          <ellipse cx="90" cy="110" rx="9" ry="12" fill="#0f172a" />
          <ellipse cx="130" cy="110" rx="9" ry="12" fill="#0f172a" />
          <circle cx="87" cy="106" r="4" fill="#ffffff" />
          <circle cx="127" cy="106" r="4" fill="#ffffff" />
        </>
      )}

      {/* Mouth */}
      <path d="M102 126 Q110 134 118 126" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
};

// ==========================================
// 4. ADULT STAGE (Majestic Elemental Beast)
// ==========================================
const AdultSprite: React.FC<{ 
  palette: typeof ELEMENT_PALETTES['VOLT']; 
  mood: CritterMood; 
  element: CritterElement;
}> = ({ palette, mood }) => {
  const isSleeping = mood === 'SLEEPING';

  return (
    <svg viewBox="0 0 240 240" className="w-60 h-60">
      <ellipse cx="120" cy="205" rx="85" ry="16" fill="rgba(0,0,0,0.35)" />

      {/* Large Dragon Wings */}
      <path 
        d="M60 115 C20 70 15 35 45 40 C55 65 65 95 75 110 Z" 
        fill={palette.highlight} 
        stroke={palette.accent}
        strokeWidth="2"
      />
      <path 
        d="M180 115 C220 70 225 35 195 40 C185 65 175 95 165 110 Z" 
        fill={palette.highlight} 
        stroke={palette.accent}
        strokeWidth="2"
      />

      {/* Swirling Tail with Elemental Flame */}
      <path d="M165 160 Q215 150 205 115 Q185 130 160 148 Z" fill={palette.body} />
      <polygon points="205,115 218,98 212,118 225,110 205,125" fill={palette.accent} />

      {/* Majestic Sweeping Horns */}
      <path d="M75 62 Q60 25 85 35 Q95 50 98 68 Z" fill={palette.accent} />
      <path d="M165 62 Q180 25 155 35 Q145 50 142 68 Z" fill={palette.accent} />

      {/* Mighty Body */}
      <path 
        d="M62 135 C52 75 85 52 120 52 C155 52 188 75 178 135 C185 180 168 198 120 198 C72 198 55 180 62 135 Z" 
        fill={palette.body} 
      />
      {/* Segmented Armor Chest */}
      <path d="M90 115 Q120 100 150 115 L145 175 Q120 190 95 175 Z" fill={palette.belly} />
      <line x1="95" y1="135" x2="145" y2="135" stroke={palette.shadow} strokeWidth="2" />
      <line x1="100" y1="155" x2="140" y2="155" stroke={palette.shadow} strokeWidth="2" />

      {/* Sturdy Claws */}
      <ellipse cx="82" cy="194" rx="18" ry="10" fill={palette.shadow} />
      <ellipse cx="158" cy="194" rx="18" ry="10" fill={palette.shadow} />

      {/* Expressive Eyes */}
      {isSleeping ? (
        <>
          <path d="M88 108 Q100 100 110 108" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M130 108 Q140 100 152 108" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <polygon points="86,104 108,102 104,115 88,114" fill="#0f172a" />
          <polygon points="154,104 132,102 136,115 152,114" fill="#0f172a" />
          <circle cx="98" cy="108" r="3" fill="#ffffff" />
          <circle cx="142" cy="108" r="3" fill="#ffffff" />
        </>
      )}

      {/* Determined Smile */}
      <path d="M110 128 Q120 136 130 128" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  );
};

// ==========================================
// 5. MYTHIC STAGE (Ascended Sovereign)
// ==========================================
const MythicSprite: React.FC<{ 
  palette: typeof ELEMENT_PALETTES['VOLT']; 
  mood: CritterMood; 
  element: CritterElement;
}> = ({ palette, mood }) => {
  return (
    <svg viewBox="0 0 260 260" className="w-64 h-64">
      {/* Floating Celestial Halo / Aura */}
      <ellipse cx="130" cy="45" rx="55" ry="14" fill="none" stroke={palette.highlight} strokeWidth="4" className="animate-spin" style={{ animationDuration: '8s' }} />
      <circle cx="130" cy="31" r="5" fill="#ffffff" />
      <circle cx="180" cy="45" r="4" fill="#ffffff" />
      <circle cx="80" cy="45" r="4" fill="#ffffff" />

      {/* Radiant Aura Backing */}
      <circle cx="130" cy="130" r="100" fill={palette.glow} opacity="0.35" className="animate-pulse" />

      {/* Adult Frame inside Sovereign Aura */}
      <g transform="translate(10, 10)">
        <AdultSprite palette={palette} mood={mood} element="VOID" />
      </g>

      {/* Crown Jewels */}
      <polygon points="120,50 130,30 140,50 130,45" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
    </svg>
  );
};
