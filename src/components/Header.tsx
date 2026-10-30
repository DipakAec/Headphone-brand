import React from 'react';
import { Volume2, VolumeX, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeStageId: string;
  isSoundPlaying: boolean;
  onToggleSound: () => void;
  onJumpStage: (index: number) => void;
  onOpenOrder: () => void;
  isFreeOrbit: boolean;
  onToggleFreeOrbit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeStageId,
  isSoundPlaying,
  onToggleSound,
  onJumpStage,
  onOpenOrder,
  isFreeOrbit,
  onToggleFreeOrbit,
}) => {
  const chapters = [
    { id: 'overview', label: 'Silhouette' },
    { id: 'driver', label: 'Planar Core' },
    { id: 'materials', label: 'Craft' },
    { id: 'spatial', label: 'Spatial Field' },
    { id: 'studio', label: 'Studio Lab' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
      {/* Brand logo & badge */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onJumpStage(0);
          }}
          className="flex items-center gap-2.5 text-white hover:opacity-85 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-sky-400 font-bold text-sm tracking-wider">
            AF
          </div>
          <div>
            <div className="font-extrabold tracking-tight text-base leading-none text-white">
              AURA <span className="text-sky-400 font-light">FLOW 01</span>
            </div>
            <div className="mono-spec text-[10px] text-zinc-400 tracking-wider uppercase mt-0.5">
              Planar Spatial Audio
            </div>
          </div>
        </a>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-[11px] mono-spec text-zinc-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>96kHz / 24-Bit Lossless</span>
        </div>
      </div>

      {/* Chapters navigation */}
      <nav aria-label="Story Chapters" className="hidden lg:flex items-center gap-1 bg-zinc-950/90 border border-zinc-800/80 rounded-full px-3 py-1.5 pointer-events-auto shadow-lg shadow-black/40">
        {chapters.map((chap, idx) => {
          const isActive = activeStageId === chap.id;
          return (
            <button
              key={chap.id}
              onClick={() => onJumpStage(idx)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                isActive
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <span className="mono-spec text-[10px] opacity-60 mr-1.5">0{idx + 1}</span>
              {chap.label}
            </button>
          );
        })}
      </nav>

      {/* Action buttons */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Free Orbit button */}
        <button
          onClick={onToggleFreeOrbit}
          title={isFreeOrbit ? 'Lock to Storyline' : 'Free 360 Orbit'}
          className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
            isFreeOrbit
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">{isFreeOrbit ? 'Orbit Active' : '360° Free View'}</span>
        </button>

        {/* Spatial Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
            isSoundPlaying
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
          }`}
          title="Synthesizes real-time 8D spatial sound test"
        >
          {isSoundPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-none" />
              <span className="hidden sm:inline">Audio Playing</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Test Spatial Audio</span>
            </>
          )}
        </button>

        {/* Configure / Pre-order CTA */}
        <button
          onClick={onOpenOrder}
          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs tracking-tight flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Configure & Buy</span>
        </button>
      </div>
    </header>
  );
};
