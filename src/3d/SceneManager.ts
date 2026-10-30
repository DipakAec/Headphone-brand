import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { HeadphoneModel } from './HeadphoneModel.ts';
import {
  Colorway,
  interpolateScrollState,
  InterpolatedState,
} from '../utils/productMath.ts';

export type LightingPreset = 'studio' | 'cyber' | 'minimal' | 'warm';

export interface SceneManagerOptions {
  canvas: HTMLCanvasElement;
  initialColorway: Colorway;
  initialEngraving: string;
  onFpsTick?: (fps: number) => void;
  onActiveStageChange?: (stageId: string) => void;
}

export class SceneManager {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private model: HeadphoneModel;

  // Lighting
  private keyLight: THREE.DirectionalLight;
  private fillLight: THREE.HemisphereLight;
  private rimLight: THREE.DirectionalLight;

  // Loop & timing
  private isSoftwareGl: boolean;
  private frameId: number = 0;
  private isDestroyed: boolean = false;
  private lastTime: number = performance.now();
  private fpsCounter: number = 0;
  private fpsLastTime: number = performance.now();

  // Scroll & Camera animation state
  private scrollProgress: number = 0;
  private currentInterpolatedState: InterpolatedState;
  private manualExplodedOverride: number | null = null;
  private targetCamPos = new THREE.Vector3();
  private targetCamLookAt = new THREE.Vector3();
  private currentCamLookAt = new THREE.Vector3();

  // Free Orbit Mode
  private isFreeOrbit: boolean = false;
  private orbitRotation = { x: 0.1, y: 0.3 };
  private orbitTarget = { x: 0.1, y: 0.3 };
  private isPointerDown: boolean = false;
  private pointerStart = { x: 0, y: 0 };
  private orbitDistance: number = 3.2;

  // Sound simulation sync
  private isSoundPlaying: boolean = false;
  private soundPan: number = 0;

  // Callbacks
  private onFpsTick?: (fps: number) => void;
  private onActiveStageChange?: (stageId: string) => void;
  private lastReportedStageId: string = '';

  constructor(options: SceneManagerOptions) {
    this.canvas = options.canvas;
    this.onFpsTick = options.onFpsTick;
    this.onActiveStageChange = options.onActiveStageChange;

    // 1. Detect software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. Scene & Horizon Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog('#08090d', 5, 14);

    // 4. Camera
    const aspect = this.canvas.clientWidth / (this.canvas.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(34, aspect, 0.1, 50);

    // Initial state
    this.currentInterpolatedState = interpolateScrollState(0);
    this.camera.position.set(
      this.currentInterpolatedState.cameraPosition[0],
      this.currentInterpolatedState.cameraPosition[1],
      this.currentInterpolatedState.cameraPosition[2]
    );
    this.currentCamLookAt.set(
      this.currentInterpolatedState.cameraTarget[0],
      this.currentInterpolatedState.cameraTarget[1],
      this.currentInterpolatedState.cameraTarget[2]
    );
    this.camera.lookAt(this.currentCamLookAt);

    // 5. Studio Environment Map (Mandatory RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    pmremGenerator.dispose();

    // 6. Balanced 3-Point Lighting Rig
    this.keyLight = new THREE.DirectionalLight('#fff7eb', 2.4);
    this.keyLight.position.set(3, 4, 3.5);
    this.keyLight.castShadow = !this.isSoftwareGl;
    if (!this.isSoftwareGl) {
      this.keyLight.shadow.mapSize.width = 1024;
      this.keyLight.shadow.mapSize.height = 1024;
      this.keyLight.shadow.bias = -0.0005;
      this.keyLight.shadow.normalBias = 0.02;
      this.keyLight.shadow.camera.left = -2;
      this.keyLight.shadow.camera.right = 2;
      this.keyLight.shadow.camera.top = 2;
      this.keyLight.shadow.camera.bottom = -2;
    }
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.HemisphereLight('#dbeafe', '#0a0d14', 1.2);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.DirectionalLight('#93c5fd', 1.8);
    this.rimLight.position.set(-3, 2, -3);
    this.scene.add(this.rimLight);

    // 7. Instantiate Headphone Model
    this.model = new HeadphoneModel(
      options.initialColorway,
      options.initialEngraving
    );
    this.scene.add(this.model.group);

    // 8. Event bindings
    this.bindWindowEvents();

    // 9. Start render loop
    this.tick = this.tick.bind(this);
    this.startLoop();
  }

  private bindWindowEvents() {
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    // Pointer events for free orbit mode
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
  }

  private onPointerDown(e: PointerEvent) {
    if (!this.isFreeOrbit) return;
    this.isPointerDown = true;
    this.pointerStart = { x: e.clientX, y: e.clientY };
  }

  private onPointerMove(e: PointerEvent) {
    if (!this.isFreeOrbit || !this.isPointerDown) return;
    const dx = e.clientX - this.pointerStart.x;
    const dy = e.clientY - this.pointerStart.y;
    this.pointerStart = { x: e.clientX, y: e.clientY };

    this.orbitTarget.y += dx * 0.006;
    this.orbitTarget.x = Math.max(-0.6, Math.min(0.8, this.orbitTarget.x + dy * 0.006));
  }

  private onPointerUp() {
    this.isPointerDown = false;
  }

  public onResize() {
    if (!this.canvas || this.isDestroyed) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / (height || 1);
      this.camera.updateProjectionMatrix();
    }
  }

  public setScrollProgress(progress: number) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
    // Clear manual override when scrolling naturally
    this.manualExplodedOverride = null;
  }

  public setExplodedOverride(val: number | null) {
    this.manualExplodedOverride = val !== null ? Math.max(0, Math.min(1, val)) : null;
  }

  public setFreeOrbit(enabled: boolean) {
    this.isFreeOrbit = enabled;
    if (enabled) {
      // Sync orbit target with current rotation
      this.orbitTarget.y = this.model.group.rotation.y;
      this.orbitTarget.x = this.model.group.rotation.x;
      this.orbitRotation.y = this.orbitTarget.y;
      this.orbitRotation.x = this.orbitTarget.x;
    }
  }

  public getIsFreeOrbit(): boolean {
    return this.isFreeOrbit;
  }

  public setColorway(colorway: Colorway) {
    this.model.setColorway(colorway);
  }

  public setEngraving(text: string) {
    this.model.updateEngraving(text);
  }

  public setLightingPreset(preset: LightingPreset) {
    switch (preset) {
      case 'studio':
        this.keyLight.color.set('#fff7eb');
        this.keyLight.intensity = 2.4;
        this.fillLight.color.set('#dbeafe');
        this.rimLight.color.set('#93c5fd');
        this.renderer.toneMappingExposure = 1.15;
        break;
      case 'cyber':
        this.keyLight.color.set('#06b6d4');
        this.keyLight.intensity = 2.2;
        this.fillLight.color.set('#3b82f6');
        this.rimLight.color.set('#ec4899');
        this.renderer.toneMappingExposure = 1.3;
        break;
      case 'minimal':
        this.keyLight.color.set('#ffffff');
        this.keyLight.intensity = 1.8;
        this.fillLight.color.set('#94a3b8');
        this.rimLight.color.set('#64748b');
        this.renderer.toneMappingExposure = 0.95;
        break;
      case 'warm':
        this.keyLight.color.set('#f97316');
        this.keyLight.intensity = 2.6;
        this.fillLight.color.set('#fed7aa');
        this.rimLight.color.set('#f43f5e');
        this.renderer.toneMappingExposure = 1.2;
        break;
    }
  }

  public setSoundPlaying(playing: boolean, pan: number = 0) {
    this.isSoundPlaying = playing;
    this.soundPan = pan;
  }

  public jumpToStageProgress(progress: number) {
    this.scrollProgress = progress;
  }

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.isDestroyed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private tick() {
    if (this.isDestroyed) return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // FPS meter
    this.fpsCounter++;
    if (now - this.fpsLastTime >= 1000) {
      if (this.onFpsTick) {
        this.onFpsTick(this.fpsCounter);
      }
      this.fpsCounter = 0;
      this.fpsLastTime = now;
    }

    // 1. Calculate target scroll interpolation
    this.currentInterpolatedState = interpolateScrollState(this.scrollProgress);

    // Report active stage change
    if (
      this.currentInterpolatedState.activeStage.id !== this.lastReportedStageId
    ) {
      this.lastReportedStageId = this.currentInterpolatedState.activeStage.id;
      if (this.onActiveStageChange) {
        this.onActiveStageChange(this.lastReportedStageId);
      }
    }

    const dampFactor = 1 - Math.exp(-6 * dt);

    if (this.isFreeOrbit) {
      // Free orbit mode: user drags model rotation
      this.orbitRotation.x += (this.orbitTarget.x - this.orbitRotation.x) * dampFactor;
      this.orbitRotation.y += (this.orbitTarget.y - this.orbitRotation.y) * dampFactor;

      this.model.group.rotation.x = this.orbitRotation.x;
      this.model.group.rotation.y = this.orbitRotation.y;

      // Keep camera centered in free orbit
      this.targetCamPos.set(0, 0.3, this.orbitDistance);
      this.targetCamLookAt.set(0, 0, 0);
    } else {
      // Scrollytelling Mode
      const targetPos = this.currentInterpolatedState.cameraPosition;
      const targetLook = this.currentInterpolatedState.cameraTarget;

      this.targetCamPos.set(targetPos[0], targetPos[1], targetPos[2]);
      this.targetCamLookAt.set(targetLook[0], targetLook[1], targetLook[2]);

      // Model base rotation from scroll
      const rotY = this.currentInterpolatedState.rotationY;
      const rotX = this.currentInterpolatedState.rotationX;

      this.model.group.rotation.y += (rotY - this.model.group.rotation.y) * dampFactor;
      this.model.group.rotation.x += (rotX - this.model.group.rotation.x) * dampFactor;

      // Subtle ambient hovering floating bob
      this.model.group.position.y = 0.15 + Math.sin(now * 0.0015) * 0.02;
    }

    // Smooth camera damping
    this.camera.position.x += (this.targetCamPos.x - this.camera.position.x) * dampFactor;
    this.camera.position.y += (this.targetCamPos.y - this.camera.position.y) * dampFactor;
    this.camera.position.z += (this.targetCamPos.z - this.camera.position.z) * dampFactor;

    this.currentCamLookAt.x += (this.targetCamLookAt.x - this.currentCamLookAt.x) * dampFactor;
    this.currentCamLookAt.y += (this.targetCamLookAt.y - this.currentCamLookAt.y) * dampFactor;
    this.currentCamLookAt.z += (this.targetCamLookAt.z - this.currentCamLookAt.z) * dampFactor;

    this.camera.lookAt(this.currentCamLookAt);

    // Update FOV smoothly
    if (Math.abs(this.camera.fov - this.currentInterpolatedState.cameraFov) > 0.01) {
      this.camera.fov += (this.currentInterpolatedState.cameraFov - this.camera.fov) * dampFactor;
      this.camera.updateProjectionMatrix();
    }

    // Update Exploded View
    const targetExploded = this.manualExplodedOverride !== null
      ? this.manualExplodedOverride
      : this.currentInterpolatedState.explodedProgress;
    this.model.updateExplodedView(targetExploded);

    // Update Sound Visualizer Rings
    this.model.updateSpatialWaves(now * 0.001, this.isSoundPlaying, this.soundPan);

    // Render frame
    this.renderer.render(this.scene, this.camera);

    // Schedule next tick
    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  }

  private startLoop() {
    this.onResize();
    this.tick();
  }

  public dispose() {
    this.isDestroyed = true;
    if (this.isSoftwareGl) {
      clearTimeout(this.frameId);
    } else {
      cancelAnimationFrame(this.frameId);
    }
    window.removeEventListener('resize', this.onResize);
    this.model.dispose();
    this.renderer.dispose();
  }
}
