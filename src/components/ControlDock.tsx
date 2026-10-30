import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Palette,
  Sun,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { COLORWAYS, Colorway } from '../utils/productMath.ts';
import { LightingPreset } from '../3d/SceneManager.ts';

interface ControlDockProps {
  selectedColorway: Colorway;
  onSelectColorway: (c: Colorway) => void;
  explodedProgress: number;
  onExplodedChange: (val: number) => void;
  activeLighting: LightingPreset;
  onSelectLighting: (preset: LightingPreset) => void;
  isFreeOrbit: boolean;
  onToggleFreeOrbit: () => void;
  isSoundPlaying: boolean;
  onToggleSound: () => void;
  fps: number;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  selectedColorway,
  onSelectColorway,
  explodedProgress,
  onExplodedChange,
  activeLighting,
  onSelectLighting,
  isFreeOrbit,
  onToggleFreeOrbit,
  isSoundPlaying,
  onToggleSound,
  fps,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'finish' | 'explode' | 'light' | 'view'>('finish');

  const lightingPresets: { id: LightingPreset; name: string }[] = [
    { id: 'studio', name: 'Studio PBR' },
    { id: 'cyber', name: 'Cyber Blue' },
    { id: 'minimal', name: 'Monochrome' },
    { id: 'warm', name: 'Golden Hour' },
  ];

  return (
    <aside
      aria-label="3D Viewport Controls"
      className="fixed bottom-5 inset-x-0 mx-auto z-40 transition-transform duration-300 ease-out w-fit max-w-[92vw]"
      style={{
        transform: isCollapsed
          ? 'translateY(calc(100% - 32px))'
          : 'translateY(0)',
      }}
    >
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-t-md bg-[#13151b] border-t border-x border-zinc-800 text-[11px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors shadow-md"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Show Studio Dock</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              <span>Hide Controls (Cinema View)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glass-free Solid/RGBA Control Dock Container */}
      <div className="bg-[#0f1117] border border-zinc-800 rounded-2xl p-3 shadow-2xl shadow-black/80">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Tabs bar */}
          <div className="flex items-center gap-1 bg-[#161822] p-1 rounded-xl border border-zinc-800/80 shrink-0">
            <button
              onClick={() => setActiveTab('finish')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'finish'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-sky-400" />
              <span>Finish</span>
            </button>

            <button
              onClick={() => setActiveTab('explode')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'explode'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Explode</span>
            </button>

            <button
              onClick={() => setActiveTab('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'light'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
              <span>Lighting</span>
            </button>

            <button
              onClick={() => setActiveTab('view')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'view'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Camera</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 min-w-[280px] sm:min-w-[360px] flex items-center justify-between px-2">
            
            {/* 1. Finishes Swatches */}
            {activeTab === 'finish' && (
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2">
                  {COLORWAYS.map((c) => {
                    const isSelected = selectedColorway.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => onSelectColorway(c)}
                        title={c.name}
                        className={`group relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0f1117] scale-110'
                            : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.bodyColor }}
                      >
                        <div
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: c.metalColor }}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">
                    {selectedColorway.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate max-w-[150px]">
                    {selectedColorway.accentName}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Exploded View Slider */}
            {activeTab === 'explode' && (
              <div className="flex items-center gap-4 w-full">
                <span className="mono-spec text-[11px] text-zinc-400 shrink-0">
                  {Math.round(explodedProgress * 100)}% DISASSEMBLED
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedProgress}
                  onChange={(e) => onExplodedChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <button
                  onClick={() => onExplodedChange(explodedProgress > 0.5 ? 0 : 1)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-semibold text-zinc-300"
                >
                  {explodedProgress > 0.5 ? 'Assemble' : 'Explode'}
                </button>
              </div>
            )}

            {/* 3. Lighting Presets */}
            {activeTab === 'light' && (
              <div className="flex items-center gap-2 w-full justify-around">
                {lightingPresets.map((lp) => {
                  const isActive = activeLighting === lp.id;
                  return (
                    <button
                      key={lp.id}
                      onClick={() => onSelectLighting(lp.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : 'bg-[#181a24] text-zinc-400 hover:text-zinc-200 border border-transparent'
                      }`}
                    >
                      {lp.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 4. Camera Mode & Quick Views */}
            {activeTab === 'view' && (
              <div className="flex items-center justify-between w-full gap-3">
                <button
                  onClick={onToggleFreeOrbit}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                    isFreeOrbit
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-[#181a24] text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{isFreeOrbit ? 'Lock to Storyline' : 'Enable Free 360° Drag'}</span>
                </button>

                <button
                  onClick={onToggleSound}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                    isSoundPlaying
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#181a24] text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  {isSoundPlaying ? (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                  <span>{isSoundPlaying ? 'Stop Audio' : 'Audio Sweep'}</span>
                </button>
              </div>
            )}

          </div>

          {/* Telemetry / FPS indicator (static, no pulsating dot) */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-zinc-800 text-[11px] mono-spec text-zinc-400 shrink-0">
            <span className="text-zinc-400 font-medium">PBR 60FPS</span>
            <span className="text-sky-400 font-semibold">{fps || 60} fps</span>
          </div>

        </div>
      </div>
    </aside>
  );
};
