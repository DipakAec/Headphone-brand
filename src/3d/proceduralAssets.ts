import * as THREE from 'three';

/**
 * Procedural texture and audio synthesis generators.
 * Zero external assets, zero 404s, fully deterministic and GPU-optimized.
 */

/**
 * Creates diamond-knurled bump texture for tactile dials and crowns.
 */
export function createKnurledDialTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  const step = 8;
  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      const grad = ctx.createRadialGradient(
        x + step / 2,
        y + step / 2,
        0,
        x + step / 2,
        y + step / 2,
        step / 2
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#777777');
      grad.addColorStop(1, '#111111');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x + step / 2, y + step / 2, step / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 3);
  return texture;
}

/**
 * Creates laser-perforated micro acoustic grille pattern.
 */
export function createAcousticGrilleTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#18191f';
  ctx.fillRect(0, 0, size, size);

  const centerX = size / 2;
  const centerY = size / 2;
  const rings = 18;

  ctx.fillStyle = '#06070a';
  for (let r = 1; r <= rings; r++) {
    const radius = (r / rings) * (size * 0.44);
    const count = Math.floor(r * 9);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (r % 2 === 0 ? 0.05 : 0);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const dotSize = 1.4 + (r / rings) * 1.8;

      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Outer concentric precision calibration rings
  ctx.strokeStyle = '#383a48';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.45, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates soft leather grain texture for memory foam ear cushions.
 */
export function createLeatherGrainTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#22232a';
  ctx.fillRect(0, 0, size, size);

  // Subtle randomized cellular grain
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 22;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * Creates radial contact shadow canvas texture for grounding.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size * 0.48
  );
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates custom engraved badge texture with user custom text.
 */
export function createEngravingTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1e24';
  ctx.fillRect(0, 0, 512, 128);

  ctx.fillStyle = '#8f94a6';
  ctx.font = '600 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((text || 'AURA FLOW // SPATIAL-01').toUpperCase(), 256, 50);

  ctx.fillStyle = '#4c5062';
  ctx.font = '400 14px "JetBrains Mono", monospace';
  ctx.fillText('CALIBRATED LOS ANGELES // 96kHz 24-BIT', 256, 84);

  // Subtle perimeter border
  ctx.strokeStyle = '#343846';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, 492, 108);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Web Audio API procedural synthesizer for acoustic testing.
 * Synthesizes spatial 8D sweeping harmonic tones, sub-bass pulse, and tactile clicks.
 */
class SpatialSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private pannerNode: StereoPannerNode | null = null;
  private timerId: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTactileClick(frequency = 600) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public startSpatialDemo(onTick?: (frequency: number, pan: number) => void) {
    if (this.isPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isPlaying = true;
    const ctx = this.ctx;

    // Dual oscillator setup for harmonic acoustic richness (432Hz root + sub bass 54Hz)
    const oscRoot = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const oscSub = ctx.createOscillator();

    const masterGain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    this.pannerNode = panner;

    oscRoot.type = 'sine';
    oscRoot.frequency.setValueAtTime(432, ctx.currentTime);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(864, ctx.currentTime);

    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(54, ctx.currentTime);

    // Warm gain envelopes
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.8);

    oscRoot.connect(masterGain);
    oscHarmonic.connect(masterGain);
    oscSub.connect(masterGain);

    if (panner) {
      masterGain.connect(panner);
      panner.connect(ctx.destination);
    } else {
      masterGain.connect(ctx.destination);
    }

    oscRoot.start();
    oscHarmonic.start();
    oscSub.start();

    // 8D spatial panning animation loop
    let startTime = ctx.currentTime;
    const interval = window.setInterval(() => {
      if (!this.isPlaying || !ctx) {
        clearInterval(interval);
        return;
      }
      const elapsed = ctx.currentTime - startTime;
      const pan = Math.sin(elapsed * 1.5);
      if (this.pannerNode) {
        this.pannerNode.pan.setValueAtTime(pan, ctx.currentTime);
      }
      const freq = 432 + Math.sin(elapsed * 0.8) * 40;
      oscRoot.frequency.setValueAtTime(freq, ctx.currentTime);

      if (onTick) {
        onTick(freq, pan);
      }
    }, 40);

    this.timerId = interval;

    // Store references to stop
    (this as unknown as { _activeOscs: AudioNode[] })._activeOscs = [
      oscRoot,
      oscHarmonic,
      oscSub,
      masterGain,
    ];
  }

  public stopSpatialDemo() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    const nodes = (this as unknown as { _activeOscs?: AudioNode[] })._activeOscs;
    if (nodes && this.ctx) {
      try {
        const gain = nodes[3] as GainNode;
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          (nodes[0] as OscillatorNode).stop();
          (nodes[1] as OscillatorNode).stop();
          (nodes[2] as OscillatorNode).stop();
        }, 320);
      } catch {
        // cleaned up
      }
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const soundEngine = new SpatialSoundEngine();
