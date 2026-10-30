/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SceneManager, LightingPreset } from './3d/SceneManager.ts';
import { COLORWAYS, Colorway } from './utils/productMath.ts';
import { soundEngine } from './3d/proceduralAssets.ts';
import { Header } from './components/Header.tsx';
import { ControlDock } from './components/ControlDock.tsx';
import { ScrollStoryline } from './components/ScrollStoryline.tsx';
import { OrderModal } from './components/OrderModal.tsx';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  // Application state
  const [selectedColorway, setSelectedColorway] = useState<Colorway>(COLORWAYS[0]);
  const [customEngraving, setCustomEngraving] = useState<string>('AURA FLOW // SPATIAL-01');
  const [explodedProgress, setExplodedProgress] = useState<number>(0);
  const [activeLighting, setActiveLighting] = useState<LightingPreset>('studio');
  const [activeStageId, setActiveStageId] = useState<string>('overview');
  const [isFreeOrbit, setIsFreeOrbit] = useState<boolean>(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);
  const [isOrderOpen, setIsOrderOpen] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Initialize SceneManager once on mount
  useEffect(() => {
    if (!canvasRef.current) return;

    const manager = new SceneManager({
      canvas: canvasRef.current,
      initialColorway: selectedColorway,
      initialEngraving: customEngraving,
      onFpsTick: (currentFps) => {
        setFps(currentFps);
      },
      onActiveStageChange: (stageId) => {
        setActiveStageId(stageId);
      },
    });

    sceneManagerRef.current = manager;

    // Window scroll handler
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? Math.max(0, Math.min(1, scrollY / totalScroll)) : 0;
      setScrollProgress(progress);
      manager.setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      manager.dispose();
      soundEngine.stopSpatialDemo();
    };
  }, []);

  // Update colorway
  const handleSelectColorway = useCallback((colorway: Colorway) => {
    setSelectedColorway(colorway);
    sceneManagerRef.current?.setColorway(colorway);
    soundEngine.playTactileClick(520);
  }, []);

  // Update custom engraving
  const handleEngravingChange = useCallback((text: string) => {
    setCustomEngraving(text);
    sceneManagerRef.current?.setEngraving(text);
  }, []);

  // Update exploded progress from slider
  const handleExplodedChange = useCallback((val: number) => {
    setExplodedProgress(val);
    sceneManagerRef.current?.setExplodedOverride(val);
    soundEngine.playTactileClick(700);
  }, []);

  // Update lighting preset
  const handleSelectLighting = useCallback((preset: LightingPreset) => {
    setActiveLighting(preset);
    sceneManagerRef.current?.setLightingPreset(preset);
    soundEngine.playTactileClick(640);
  }, []);

  // Toggle Free Orbit Mode
  const handleToggleFreeOrbit = useCallback(() => {
    setIsFreeOrbit((prev) => {
      const next = !prev;
      sceneManagerRef.current?.setFreeOrbit(next);
      soundEngine.playTactileClick(next ? 880 : 440);
      return next;
    });
  }, []);

  // Toggle Spatial Sound Demo
  const handleToggleSound = useCallback(() => {
    if (isSoundPlaying) {
      soundEngine.stopSpatialDemo();
      setIsSoundPlaying(false);
      sceneManagerRef.current?.setSoundPlaying(false);
    } else {
      setIsSoundPlaying(true);
      sceneManagerRef.current?.setSoundPlaying(true);
      soundEngine.startSpatialDemo((_, pan) => {
        sceneManagerRef.current?.setSoundPlaying(true, pan);
      });
    }
  }, [isSoundPlaying]);

  // Jump to specific chapter section
  const handleJumpStage = useCallback((index: number) => {
    const stageIds = ['section-overview', 'section-driver', 'section-materials', 'section-spatial', 'section-studio'];
    const targetElement = document.getElementById(stageIds[index]);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      soundEngine.playTactileClick(600);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#08090d] text-white">
      {/* 1. Full-Bleed 100vw x 100vh Fixed WebGL 3D Canvas */}
      <div className="fixed inset-0 z-0 w-screen h-screen overflow-hidden pointer-events-none">
        <canvas
          ref={canvasRef}
          data-testid="threejs-canvas"
          className={`w-full h-full block ${isFreeOrbit ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
        />
      </div>

      {/* 2. Top Header Navigation */}
      <Header
        activeStageId={activeStageId}
        isSoundPlaying={isSoundPlaying}
        onToggleSound={handleToggleSound}
        onJumpStage={handleJumpStage}
        onOpenOrder={() => setIsOrderOpen(true)}
        isFreeOrbit={isFreeOrbit}
        onToggleFreeOrbit={handleToggleFreeOrbit}
      />

      {/* 3. Multi-Stage Scroll Storyline (Over the canvas) */}
      <ScrollStoryline
        scrollProgress={scrollProgress}
        activeStageId={activeStageId}
        selectedColorway={selectedColorway}
        onSelectColorway={handleSelectColorway}
        customEngraving={customEngraving}
        onChangeEngraving={handleEngravingChange}
        isSoundPlaying={isSoundPlaying}
        onToggleSound={handleToggleSound}
        onOpenOrder={() => setIsOrderOpen(true)}
      />

      {/* 4. Collapsible Bottom Floating Control Dock */}
      <ControlDock
        selectedColorway={selectedColorway}
        onSelectColorway={handleSelectColorway}
        explodedProgress={explodedProgress}
        onExplodedChange={handleExplodedChange}
        activeLighting={activeLighting}
        onSelectLighting={handleSelectLighting}
        isFreeOrbit={isFreeOrbit}
        onToggleFreeOrbit={handleToggleFreeOrbit}
        isSoundPlaying={isSoundPlaying}
        onToggleSound={handleToggleSound}
        fps={fps}
      />

      {/* 5. Interactive Configuration & Pre-order Reservation Modal */}
      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        selectedColorway={selectedColorway}
        customEngraving={customEngraving}
      />
    </div>
  );
}
