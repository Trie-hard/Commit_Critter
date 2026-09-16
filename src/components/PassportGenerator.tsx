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

    // High-Resolution 1200 x 630 (Standard Twitter/Social OpenGraph format)
    canvas.width = 1200;
    canvas.height = 630;

    // 1. Warm Paper White Canvas (#fafafb & #ffffff)
    ctx.fillStyle = '#fafafb';
    ctx.fillRect(0, 0, 1200, 630);

    // Inner White Card with Hairline Border
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(36, 36, 1128, 558, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 2. Top Header & Typography (Newsreader / Georgia serif)
    ctx.fillStyle = '#777b86';
    ctx.font = '500 13px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillText('OFFICIAL DIGITAL PET REGISTRY · FIRSTCOMMIT HACKATHON 2026', 72, 86);

    ctx.fillStyle = '#17191c';
    ctx.font = 'normal 44px "Newsreader", Georgia, serif';
    ctx.fillText('Commit Critter Passport', 72, 138);

    // 3. Critter Character Frame — Blush Peach Accent (#fbe1d1) with Sienna Ink (#5d2a1a)
    ctx.fillStyle = '#fbe1d1';
    ctx.beginPath();
    ctx.roundRect(72, 172, 320, 360, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(93, 42, 26, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Elemental Icon Stamp
    let critterSymbol = '🐾';
    if (stats.element === 'FLORA') critterSymbol = '🌱';
    if (stats.element === 'VOLT') critterSymbol = '⚡';
    if (stats.element === 'FERRO') critterSymbol = '🦀';
    if (stats.element === 'TIDAL') critterSymbol = '🌊';
    if (stats.element === 'PRISM') critterSymbol = '💎';
    if (stats.element === 'VOID') critterSymbol = '🌌';

    ctx.font = '88px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(critterSymbol, 232, 335);

    // Stage & Element tag in peach card
    ctx.font = '500 16px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillStyle = '#5d2a1a';
    ctx.fillText(`${stats.stage} · ${stats.element}`, 232, 435);

    ctx.font = 'normal 13px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillStyle = 'rgba(93, 42, 26, 0.7)';
    ctx.fillText(`LVL ${stats.level} COMPANION`, 232, 465);

    // 4. User Details
    ctx.textAlign = 'left';
    ctx.fillStyle = '#17191c';
    ctx.font = 'normal 34px "Newsreader", Georgia, serif';
    ctx.fillText(githubData.name || githubData.username, 428, 214);

    ctx.fillStyle = '#777b86';
    ctx.font = '15px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillText(`@${githubData.username} · ${stats.title}`, 428, 246);

    // Personality Quirk Card (Mist Gray)
    ctx.fillStyle = '#f2f2f3';
    ctx.beginPath();
    ctx.roundRect(428, 272, 696, 72, 16);
    ctx.fill();

    ctx.fillStyle = '#17191c';
    ctx.font = 'italic 17px "Newsreader", Georgia, serif';
    ctx.fillText(`"${stats.personalityQuirk}"`, 452, 316);

    // 5. Vital Metric Tiles
    const statBox = (label: string, value: string, x: number, y: number) => {
      ctx.fillStyle = '#f2f2f3';
      ctx.beginPath();
      ctx.roundRect(x, y, 162, 92, 16);
      ctx.fill();

      ctx.font = '500 11px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillStyle = '#777b86';
      ctx.fillText(label.toUpperCase(), x + 16, y + 28);

      ctx.font = '600 24px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillStyle = '#17191c';
      ctx.fillText(value, x + 16, y + 68);
    };

    statBox('Active Streak', `${githubData.streakDays} Days`, 428, 366);
    statBox('Total Commits', `${githubData.totalRecentCommits}`, 606, 366);
    statBox('Language DNA', `${githubData.primaryLanguage}`, 784, 366);
    statBox('Vitality', `${stats.happiness}% Morale`, 962, 366);

    // 6. Verified Watermark Footer
    ctx.font = '12px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillStyle = '#979799';
    ctx.fillText('VERIFIED PARTICIPANT: BEGINNER\'S PARADISE · FIRSTCOMMIT 2026', 428, 502);
    ctx.fillText('Crafted with React, HTML5 Canvas, Web Audio API & Steep Design System', 428, 524);

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
          text: `Check out my Commit Critter! Level ${stats.level} ${stats.stage} with a ${githubData.streakDays}-day streak! 🐾`,
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans animate-fade-in">
      <div className="bg-white border border-black/[0.08] rounded-[28px] p-6 max-w-2xl w-full shadow-modal flex flex-col gap-4 relative animate-slide-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-ink-black">
                Editorial Passport Card
              </h2>
              <p className="text-xs text-slate-gray">
                Export an OpenGraph social share card of your pet
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-black/[0.08] flex items-center justify-center text-slate-gray hover:text-ink-black hover:bg-mist-gray transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Preview Area */}
        <div className="flex flex-col items-center justify-center bg-fog-white rounded-2xl p-4 border border-black/[0.06] overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className={`max-w-full h-auto rounded-xl shadow-sm ${!isGenerated ? 'hidden' : 'block'}`}
          />
          {!isGenerated && (
            <div className="py-12 flex flex-col items-center text-center gap-3">
              <span className="text-3xl">📸</span>
              <p className="text-xs text-slate-gray max-w-sm">
                Generates a 1200×630 editorial stationery card containing your pet's portrait, habit metrics, and stage progress.
              </p>
              <button
                onClick={generateCard}
                className="pill-button-primary text-xs py-2 px-6 mt-1"
              >
                Render High-Res Card
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        {isGenerated && (
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/[0.06]">
            <button
              onClick={handleShare}
              className="pill-button-ghost text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={handleDownload}
              className="pill-button-primary text-xs py-2 px-5 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG (1200×630)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
