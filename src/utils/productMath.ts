/**
 * Pure math and configuration utilities for 3D camera choreography,
 * scroll stage interpolation, and exploded-view offsets.
 */

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface KeyframeStage {
  id: string;
  name: string;
  subtitle: string;
  scrollRange: [number, number]; // [start, end] from 0.0 to 1.0
  camera: CameraPose;
  explodedProgress: number; // 0 to 1
  rotationY: number; // radians
  rotationX: number;
  highlightPart?: 'none' | 'driver' | 'earcup' | 'crown' | 'headband' | 'cushion';
}

export interface Colorway {
  id: string;
  name: string;
  accentName: string;
  bodyColor: string; // hex
  metalColor: string;
  cushionColor: string;
  accentColor: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
}

export const COLORWAYS: Colorway[] = [
  {
    id: 'obsidian',
    name: 'Cosmic Obsidian',
    accentName: 'Black Anodized & Smoked Chrome',
    bodyColor: '#121318',
    metalColor: '#2b2d35',
    cushionColor: '#101115',
    accentColor: '#38bdf8',
    metalness: 0.88,
    roughness: 0.22,
    clearcoat: 0.6,
  },
  {
    id: 'titanium',
    name: 'Lunar Titanium',
    accentName: 'Natural Brushed Grade-5 Titanium',
    bodyColor: '#8c919d',
    metalColor: '#b8bcc6',
    cushionColor: '#252830',
    accentColor: '#e2e8f0',
    metalness: 0.95,
    roughness: 0.18,
    clearcoat: 0.4,
  },
  {
    id: 'emerald',
    name: 'Nordic Emerald',
    accentName: 'Deep Forest Green & Satin Brass',
    bodyColor: '#143026',
    metalColor: '#b8944d',
    cushionColor: '#0e1c17',
    accentColor: '#34d399',
    metalness: 0.82,
    roughness: 0.25,
    clearcoat: 0.7,
  },
  {
    id: 'copper',
    name: 'Cyber Copper',
    accentName: 'Raw Thermal Copper & Gunmetal',
    bodyColor: '#1f1b1c',
    metalColor: '#c26d4b',
    cushionColor: '#1a1618',
    accentColor: '#f97316',
    metalness: 0.92,
    roughness: 0.2,
    clearcoat: 0.5,
  },
  {
    id: 'rose',
    name: 'Solar Rose Gold',
    accentName: '18k Champagne Rose & Alabaster',
    bodyColor: '#42282e',
    metalColor: '#dca498',
    cushionColor: '#251b20',
    accentColor: '#fb7185',
    metalness: 0.85,
    roughness: 0.19,
    clearcoat: 0.8,
  },
];

export const KEYFRAME_STAGES: KeyframeStage[] = [
  {
    id: 'overview',
    name: 'Silhouette',
    subtitle: 'Sculpted Acoustic Form',
    scrollRange: [0.0, 0.18],
    camera: {
      position: [0.35, 0.65, 5.6],
      target: [0.15, 0.45, 0],
      fov: 34,
    },
    explodedProgress: 0,
    rotationY: 0.35,
    rotationX: 0.06,
    highlightPart: 'none',
  },
  {
    id: 'driver',
    name: 'Acoustic Core',
    subtitle: 'Exploded Planar Transducer',
    scrollRange: [0.18, 0.42],
    camera: {
      position: [-0.3, 0.25, 3.8],
      target: [0.55, 0.05, 0],
      fov: 32,
    },
    explodedProgress: 1.0,
    rotationY: -0.65,
    rotationX: 0.15,
    highlightPart: 'driver',
  },
  {
    id: 'materials',
    name: 'Tactile Craft',
    subtitle: 'Grade-5 Titanium & Knurled Crown',
    scrollRange: [0.42, 0.65],
    camera: {
      position: [0.45, 0.65, 2.9],
      target: [0.85, 0.25, 0.15],
      fov: 28,
    },
    explodedProgress: 0.2,
    rotationY: -1.05,
    rotationX: 0.28,
    highlightPart: 'crown',
  },
  {
    id: 'spatial',
    name: 'Spatial Field',
    subtitle: 'Dynamic Binaural Staging',
    scrollRange: [0.65, 0.85],
    camera: {
      position: [-0.2, 0.5, 5.0],
      target: [0.1, 0.35, 0],
      fov: 35,
    },
    explodedProgress: 0.0,
    rotationY: 0.0,
    rotationX: -0.04,
    highlightPart: 'earcup',
  },
  {
    id: 'studio',
    name: 'Studio Lab',
    subtitle: 'Custom Configuration & 360° Free Orbit',
    scrollRange: [0.85, 1.0],
    camera: {
      position: [-0.35, 0.6, 5.2],
      target: [0.25, 0.4, 0],
      fov: 34,
    },
    explodedProgress: 0.0,
    rotationY: 0.45,
    rotationX: 0.08,
    highlightPart: 'none',
  },
];

/**
 * Linear interpolation helper
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Clamp a number between min and max
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Smoothstep easing for silky transitions between keyframe ranges
 */
export function smoothstep(min: number, max: number, val: number): number {
  const x = clamp((val - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
}

export interface InterpolatedState {
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  cameraFov: number;
  explodedProgress: number;
  rotationY: number;
  rotationX: number;
  activeStageIndex: number;
  activeStage: KeyframeStage;
  stageProgress: number; // 0 to 1 within current stage
}

/**
 * Computes interpolated camera pose and 3D exploded state for any scroll progress (0..1)
 */
export function interpolateScrollState(progress: number): InterpolatedState {
  const p = clamp(progress, 0, 1);
  const stages = KEYFRAME_STAGES;

  // Find active stage and next stage
  let activeIndex = 0;
  for (let i = 0; i < stages.length; i++) {
    const [start, end] = stages[i].scrollRange;
    if (p >= start && (p <= end || i === stages.length - 1)) {
      activeIndex = i;
      break;
    }
  }

  const current = stages[activeIndex];
  const next = stages[Math.min(activeIndex + 1, stages.length - 1)];

  // Calculate local progress between stages
  let stageProgress = 0;
  if (activeIndex < stages.length - 1) {
    const currentMid = (current.scrollRange[0] + current.scrollRange[1]) / 2;
    const nextMid = (next.scrollRange[0] + next.scrollRange[1]) / 2;
    if (p <= currentMid) {
      stageProgress = 0;
    } else if (p >= nextMid) {
      stageProgress = 1;
    } else {
      stageProgress = smoothstep(currentMid, nextMid, p);
    }
  } else {
    stageProgress = 1;
  }

  const t = stageProgress;

  // Camera position lerp
  const posX = lerp(current.camera.position[0], next.camera.position[0], t);
  const posY = lerp(current.camera.position[1], next.camera.position[1], t);
  const posZ = lerp(current.camera.position[2], next.camera.position[2], t);

  // Camera target lerp
  const tgtX = lerp(current.camera.target[0], next.camera.target[0], t);
  const tgtY = lerp(current.camera.target[1], next.camera.target[1], t);
  const tgtZ = lerp(current.camera.target[2], next.camera.target[2], t);

  // FOV lerp
  const fov = lerp(current.camera.fov, next.camera.fov, t);

  // Exploded progress lerp
  const exploded = lerp(current.explodedProgress, next.explodedProgress, t);

  // Rotation lerp
  const rotY = lerp(current.rotationY, next.rotationY, t);
  const rotX = lerp(current.rotationX, next.rotationX, t);

  return {
    cameraPosition: [posX, posY, posZ],
    cameraTarget: [tgtX, tgtY, tgtZ],
    cameraFov: fov,
    explodedProgress: exploded,
    rotationY: rotY,
    rotationX: rotX,
    activeStageIndex: activeIndex,
    activeStage: current,
    stageProgress,
  };
}

/**
 * Calculates local 3D displacement vectors for each exploded sub-component
 * along their respective outward normal axes (lateral X, vertical Y, depth Z).
 */
export interface ExplodedOffsets {
  earcupOuter: number; // lateral shift along cup axis
  driverDiaphragm: number;
  acousticGrille: number;
  earCushion: number;
  crownDial: number;
  gimbalFork: number;
  headbandLift: number;
}

export function computeExplodedOffsets(progress: number): ExplodedOffsets {
  const p = clamp(progress, 0, 1);
  return {
    earcupOuter: p * 0.32,
    driverDiaphragm: p * 0.18,
    acousticGrille: p * 0.45,
    earCushion: p === 0 ? 0 : p * -0.22, // shifts inward towards listener
    crownDial: p * 0.12,
    gimbalFork: p * 0.08,
    headbandLift: p * 0.06,
  };
}

/**
 * Formats sound frequency and decibel response
 */
export function formatFrequency(hz: number): string {
  if (hz >= 1000) {
    return `${(hz / 1000).toFixed(1)} kHz`;
  }
  return `${Math.round(hz)} Hz`;
}
