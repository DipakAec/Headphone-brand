import React from 'react';
import {
  ChevronDown,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  Headphones,
  Sliders,
  Check,
} from 'lucide-react';
import { Colorway, COLORWAYS } from '../utils/productMath.ts';

interface ScrollStorylineProps {
  scrollProgress: number;
  activeStageId: string;
  selectedColorway: Colorway;
  onSelectColorway: (c: Colorway) => void;
  customEngraving: string;
  onChangeEngraving: (text: string) => void;
  isSoundPlaying: boolean;
  onToggleSound: () => void;
  onOpenOrder: () => void;
}

export const ScrollStoryline: React.FC<ScrollStorylineProps> = ({
  scrollProgress,
  activeStageId,
  selectedColorway,
  onSelectColorway,
  customEngraving,
  onChangeEngraving,
  isSoundPlaying,
  onToggleSound,
  onOpenOrder,
}) => {
  return (
    <div className="relative z-10 pointer-events-none select-none">
      
      {/* ------------------------------------------------------------- */}
      {/* STAGE 1: HERO OVERVIEW (0.00 - 0.20) */}
      {/* ------------------------------------------------------------- */}
      <section
        id="section-overview"
        className="min-h-screen flex flex-col justify-between p-6 sm:p-12 md:p-20 relative pointer-events-none"
      >
        <div className="max-w-2xl pt-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-sky-400 text-xs font-semibold tracking-wider uppercase mb-4 pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Sculpted Acoustic Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
            AURA <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300">FLOW 01</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
            Where aerospace-grade metallurgy meets nanometer planar magnetic transducer physics. An acoustic sculpture designed for infinite spatial clarity.
          </p>

          {/* Quick Specs Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pointer-events-auto max-w-lg">
            <div className="bg-[#10121a]/90 border border-zinc-800/80 rounded-xl p-3">
              <div className="text-[10px] mono-spec uppercase tracking-wider text-zinc-400">Driver</div>
              <div className="text-lg font-bold text-white mt-0.5">45mm</div>
              <div className="text-[11px] text-sky-400 font-medium">Planar Magnetic</div>
            </div>

            <div className="bg-[#10121a]/90 border border-zinc-800/80 rounded-xl p-3">
              <div className="text-[10px] mono-spec uppercase tracking-wider text-zinc-400">Range</div>
              <div className="text-lg font-bold text-white mt-0.5">4–52k</div>
              <div className="text-[11px] text-emerald-400 font-medium">Hz Ultra-wide</div>
            </div>

            <div className="bg-[#10121a]/90 border border-zinc-800/80 rounded-xl p-3">
              <div className="text-[10px] mono-spec uppercase tracking-wider text-zinc-400">THD</div>
              <div className="text-lg font-bold text-white mt-0.5">&lt;0.002%</div>
              <div className="text-[11px] text-amber-400 font-medium">At 100 dB SPL</div>
            </div>

            <div className="bg-[#10121a]/90 border border-zinc-800/80 rounded-xl p-3">
              <div className="text-[10px] mono-spec uppercase tracking-wider text-zinc-400">Battery</div>
              <div className="text-lg font-bold text-white mt-0.5">58 hrs</div>
              <div className="text-[11px] text-indigo-400 font-medium">Lossless Play</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator prompt */}
        <div className="flex items-center gap-3 text-zinc-400 text-xs mono-spec py-6 pointer-events-auto">
          <div className="w-6 h-10 rounded-full border border-zinc-700 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2 bg-sky-400 rounded-full animate-bounce" />
          </div>
          <span>SCROLL DOWN TO DISASSEMBLE &amp; INSPECT</span>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STAGE 2: EXPLODED PLANAR CORE (0.20 - 0.45) */}
      {/* ------------------------------------------------------------- */}
      <section
        id="section-driver"
        className="min-h-screen flex flex-col justify-center p-6 sm:p-12 md:p-20 relative pointer-events-none"
      >
        <div className="max-w-lg lg:ml-auto pointer-events-auto bg-[#0d0f15]/90 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Exploded Transducer Anatomy</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Nanometer Planar Magnetic Core
          </h2>

          <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
            Conventional dynamic cones suffer from cone-breakup distortion. AURA FLOW 01 embeds a microscopic spiral voice coil etched into an ultrathin 0.005mm amber substrate suspended between symmetrical Neodymium N52 magnet arrays.
          </p>

          {/* Subsystem breakdown pins */}
          <div className="mt-5 space-y-2.5">
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
              <span className="mono-spec text-xs font-bold text-amber-400 mt-0.5">01</span>
              <div>
                <h4 className="text-xs font-bold text-white">45mm Planar Substrate</h4>
                <p className="text-[11px] text-zinc-400">Zero inertia acceleration with transient impulse speed &lt; 0.1ms.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
              <span className="mono-spec text-xs font-bold text-sky-400 mt-0.5">02</span>
              <div>
                <h4 className="text-xs font-bold text-white">Laser-Etched Micro Grille</h4>
                <p className="text-[11px] text-zinc-400">812 precision apertures tuned for open-back acoustic staging.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
              <span className="mono-spec text-xs font-bold text-emerald-400 mt-0.5">03</span>
              <div>
                <h4 className="text-xs font-bold text-white">Visco-Elastic Memory Foam</h4>
                <p className="text-[11px] text-zinc-400">Adaptive pressure dispersion for fatigue-free listening marathons.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STAGE 3: TACTILE CRAFT & METALLURGY (0.45 - 0.70) */}
      {/* ------------------------------------------------------------- */}
      <section
        id="section-materials"
        className="min-h-screen flex flex-col justify-center p-6 sm:p-12 md:p-20 relative pointer-events-none"
      >
        <div className="max-w-lg pointer-events-auto bg-[#0d0f15]/90 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Industrial Metallurgy</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Grade-5 Titanium &amp; Diamond Knurled Crown
          </h2>

          <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
            Every hinge, gimbal fork, and volume crown is CNC-machined from single billets of aerospace titanium. The rotary digital crown features micro-diamond knurling for tactile precision with zero backlash.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
              <div className="text-[10px] mono-spec text-zinc-400 uppercase">Tolerances</div>
              <div className="text-lg font-bold text-white mt-0.5">±0.005mm</div>
              <div className="text-[11px] text-zinc-400">CNC Swiss-Lathe Milled</div>
            </div>
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
              <div className="text-[10px] mono-spec text-zinc-400 uppercase">Headband Core</div>
              <div className="text-lg font-bold text-white mt-0.5">Ti-6Al-4V</div>
              <div className="text-[11px] text-zinc-400">Elastic Memory Arch</div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STAGE 4: SPATIAL SOUND FIELD (0.70 - 0.88) */}
      {/* ------------------------------------------------------------- */}
      <section
        id="section-spatial"
        className="min-h-screen flex flex-col justify-center p-6 sm:p-12 md:p-20 relative pointer-events-none"
      >
        <div className="max-w-lg lg:ml-auto pointer-events-auto bg-[#0d0f15]/90 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Spatial Immersion</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dynamic Binaural Head-Tracking
          </h2>

          <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
            Proprietary spatial beamforming algorithms synthesize an expansive 360-degree sonic holographic field. Instruments remain anchored in physical space around you as if sitting front row in an acoustically mastered concert hall.
          </p>

          {/* Interactive Sound Demo trigger */}
          <div className="mt-6 p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Procedural 8D Audio Tester
              </span>
              <span className="text-[10px] mono-spec text-emerald-400">
                {isSoundPlaying ? 'LIVE BINAURAL' : 'STANDBY'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              Synthesizes real-time harmonic test sweeps and 8D spatial panning using browser Web Audio oscillators.
            </p>
            <button
              onClick={onToggleSound}
              className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isSoundPlaying
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
              }`}
            >
              {isSoundPlaying ? 'Pause Spatial Sound' : 'Play 8D Binaural Sweep'}
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STAGE 5: STUDIO LAB & CUSTOMIZER (0.88 - 1.0) */}
      {/* ------------------------------------------------------------- */}
      <section
        id="section-studio"
        className="min-h-screen flex flex-col justify-center p-6 sm:p-12 md:p-20 relative pointer-events-none"
      >
        <div className="max-w-xl pointer-events-auto bg-[#0d0f15]/95 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Studio Lab</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Customize Your Acoustic Masterpiece
          </h2>

          <p className="mt-2 text-sm text-zinc-300">
            Select your aerospace finish, personalize your laser-etched headband plaque, and complete your order.
          </p>

          {/* Colorway Selection */}
          <div className="mt-5">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Finish Palette ({selectedColorway.name})
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COLORWAYS.map((c) => {
                const isSelected = selectedColorway.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectColorway(c)}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-sky-400 bg-sky-500/10 shadow-md'
                        : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full border border-white/20 mb-1 flex items-center justify-center"
                      style={{ backgroundColor: c.bodyColor }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                    <span className="text-[10px] font-medium text-zinc-300 truncate max-w-full">
                      {c.name.split(' ')[1] || c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Headband Engraving */}
          <div className="mt-5">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Laser Engraving on Titanium Plaque
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={24}
                value={customEngraving}
                onChange={(e) => onChangeEngraving(e.target.value)}
                placeholder="AURA FLOW // SPATIAL-01"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white mono-spec focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Live updates the 3D model headband badge in real time.
            </div>
          </div>

          {/* Price & Pre-Order Button */}
          <div className="mt-6 pt-5 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] mono-spec uppercase text-zinc-400">Founder Edition Price</div>
              <div className="text-2xl font-black text-white">$699 <span className="text-xs text-zinc-400 font-normal">USD</span></div>
            </div>

            <button
              onClick={onOpenOrder}
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-sm tracking-tight flex items-center gap-2 shadow-xl shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Headphones className="w-4 h-4 fill-current" />
              <span>Configure &amp; Reserve</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer info & credits */}
      <footer className="p-8 text-center text-xs text-zinc-400 mono-spec border-t border-zinc-900 bg-[#08090d]/90 pointer-events-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            AURA ACOUSTICS © {new Date().getFullYear()} // CRAFTED WITH THREE.JS &amp; PBR REALISM
          </div>
          <div className="flex items-center gap-6">
            <span>ZERO 404 ASSETS</span>
            <span>LOSSLESS AUDIO ARCHITECTURE</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
