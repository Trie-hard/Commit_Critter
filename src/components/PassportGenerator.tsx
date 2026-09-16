import React, { useRef, useState } from 'react';
import { CritterStats, GitHubActivityData } from '../types/critter';
import { soundFx } from '../services/audioEngine';
import { Download, Share2, Sparkles, X } from 'lucide-react';

interface PassportGeneratorProps {
  stats: CritterStats;
  githubData: GitHubActivityData;
  onClose: () => void;
}

export const PassportGenerator: React.FC<PassportGeneratorProps> = ({
  stats,
  githubData,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [cardUrl, setCardUrl] = useState<string | null>(null);

  const generateCard = () => {
    soundFx.playLevelUp();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-Resolution 1200 x 630 (Standard Twitter/Social OpenGraph size)
    canvas.width = 1200;
    canvas.height = 630;

    // 1. Dark Cyberpunk Background with Radial Glow
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGradient.addColorStop(0, '#0a0d14');
    bgGradient.addColorStop(0.5, '#111827');
    bgGradient.addColorStop(1, '#05070c');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Neon Accent Glow Circles
    const glow1 = ctx.createRadialGradient(1000, 150, 10, 1000, 150, 450);
    glow1.addColorStop(0, 'rgba(0, 240, 255, 0.18)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1200, 630);

    const glow2 = ctx.createRadialGradient(200, 500, 10, 200, 500, 400);
    glow2.addColorStop(0, 'rgba(255, 0, 127, 0.15)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1200, 630);

    // 2. Holographic Card Border
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 570);

    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, 1120, 550);

    // 3. Header Branding
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('OFFICIAL DIGITAL PET REGISTRY // FIRST COMMIT HACKATHON 2026', 70, 85);

    ctx.font = 'bold 44px "Arial Black", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('COMMIT CRITTER PASSPORT', 70, 140);

    // 4. Critter Portrait & Character Frame
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(70, 180, 320, 320);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(70, 180, 320, 320);

    // Draw Elemental Stamp Symbol
    ctx.font = '80px sans-serif';
    ctx.textAlign = 'center';
    let critterSymbol = '🐾';
    if (stats.element === 'FLORA') critterSymbol = '🌱';
    if (stats.element === 'VOLT') critterSymbol = '⚡';
    if (stats.element === 'FERRO') critterSymbol = '🦀';
    if (stats.element === 'TIDAL') critterSymbol = '🌊';
    if (stats.element === 'PRISM') critterSymbol = '💎';
    if (stats.element === 'VOID') critterSymbol = '🌌';
    ctx.fillText(critterSymbol, 230, 350);

    // Stage & Element banner
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`${stats.stage} • ${stats.element}`, 230, 450);

    // 5. User Details & Bio
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(githubData.name || githubData.username, 430, 220);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px "Courier New", monospace';
    ctx.fillText(`@${githubData.username} | ${stats.title}`, 430, 260);

    // Quirk Box
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(430, 290, 680, 70);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(430, 290, 680, 70);

    ctx.fillStyle = '#facc15';
    ctx.font = 'italic 18px sans-serif';
    ctx.fillText(`"${stats.personalityQuirk}"`, 450, 335);

    // 6. Vital Stats Quad-Grid
    const statBox = (label: string, value: string, x: number, y: number, color: string) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, y, 160, 95);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, 160, 95);

      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(label, x + 15, y + 30);

      ctx.font = 'bold 30px sans-serif';
      ctx.fillStyle = color;
      ctx.fillText(value, x + 15, y + 72);
    };

    statBox('LEVEL', `LVL ${stats.level}`, 430, 385, '#38bdf8');
    statBox('STREAK', `${githubData.streakDays} Days`, 605, 385, '#f97316');
    statBox('COMMITS', `${githubData.totalRecentCommits}`, 780, 385, '#10b981');
    statBox('HAPPINESS', `${stats.happiness}%`, 955, 385, '#ec4899');

    // 7. Footer Hackathon Watermark
    ctx.font = '14px "Courier New", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('VERIFIED PARTICIPANT: BEGINNER\'S PARADISE - FIRSTCOMMIT 2026', 430, 525);
    ctx.fillText('Built with React, Web Audio & HTML5 Canvas', 430, 550);

    const dataUrl = canvas.toDataURL('image/png');
    setCardUrl(dataUrl);
    setIsGenerated(true);
  };

  const handleDownload = () => {
    if (!cardUrl) return;
    const a = document.createElement('a');
    a.href = cardUrl;
    a.download = `${githubData.username}-commit-critter-passport.png`;
    a.click();
    soundFx.playChirp();
  };

  const handleShare = async () => {
    if (!cardUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${githubData.username}'s Commit Critter`,
          text: `Check out my Commit Critter! Level ${stats.level} ${stats.stage} with a ${githubData.streakDays}-day streak! 🐾💻`,
          url: window.location.href,
        });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 max-w-2xl w-full shadow-2xl flex flex-col gap-5 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="font-pixel text-sm text-white">Generate Critter Passport</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Preview Area */}
        <div className="flex flex-col items-center justify-center bg-slate-950 rounded-2xl p-4 border border-slate-800 overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className={`max-w-full h-auto rounded-lg shadow-lg ${!isGenerated ? 'hidden' : 'block'}`}
          />
          {!isGenerated && (
            <div className="py-12 flex flex-col items-center text-center gap-3">
              <span className="text-4xl">📸</span>
              <p className="font-mono text-xs text-slate-300 max-w-sm">
                Renders a high-resolution Spotify-Wrapped style passport card of your pet, stats, and achievements!
              </p>
              <button
                onClick={generateCard}
                className="mt-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
              >
                Render High-Res Card
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        {isGenerated && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-mono text-xs font-bold transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-mono text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG (1200x630)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
