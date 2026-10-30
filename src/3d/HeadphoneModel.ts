import * as THREE from 'three';
import {
  createKnurledDialTexture,
  createAcousticGrilleTexture,
  createLeatherGrainTexture,
  createContactShadowTexture,
  createEngravingTexture,
} from './proceduralAssets.ts';
import { Colorway, computeExplodedOffsets } from '../utils/productMath.ts';

export class HeadphoneModel {
  public group: THREE.Group;
  
  // Materials that change with colorway
  private bodyMaterials: THREE.MeshStandardMaterial[] = [];
  private metalMaterials: THREE.MeshStandardMaterial[] = [];
  private cushionMaterials: THREE.MeshStandardMaterial[] = [];
  private accentMaterials: THREE.MeshStandardMaterial[] = [];

  // Exploded part groups for left and right assemblies
  private leftCupAssembly: THREE.Group;
  private rightCupAssembly: THREE.Group;

  // Individual movable exploded parts
  private leftShell: THREE.Mesh;
  private rightShell: THREE.Mesh;
  private leftDriver: THREE.Group;
  private rightDriver: THREE.Group;
  private leftGrille: THREE.Mesh;
  private rightGrille: THREE.Mesh;
  private leftCushion: THREE.Mesh;
  private rightCushion: THREE.Mesh;
  private rightCrownDial: THREE.Group;
  private leftGimbal: THREE.Group;
  private rightGimbal: THREE.Group;
  private headbandGroup: THREE.Group;

  // Engraving badge mesh & texture
  private badgeMesh: THREE.Mesh;
  private currentEngravingTexture: THREE.CanvasTexture;

  // Spatial wave visualizer rings
  private spatialWavesGroup: THREE.Group;
  private spatialWaveMaterials: THREE.MeshBasicMaterial[] = [];

  // Reusable textures
  private knurledTexture: THREE.CanvasTexture;
  private grilleTexture: THREE.CanvasTexture;
  private leatherTexture: THREE.CanvasTexture;

  constructor(initialColorway: Colorway, customEngraving: string) {
    this.group = new THREE.Group();
    this.group.name = 'HeadphoneModel';

    // 1. Procedural textures
    this.knurledTexture = createKnurledDialTexture();
    this.grilleTexture = createAcousticGrilleTexture();
    this.leatherTexture = createLeatherGrainTexture();
    this.currentEngravingTexture = createEngravingTexture(customEngraving);

    // 2. Base Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(initialColorway.bodyColor),
      metalness: initialColorway.metalness,
      roughness: initialColorway.roughness,
    });
    this.bodyMaterials.push(bodyMat);

    const metalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(initialColorway.metalColor),
      metalness: 0.95,
      roughness: 0.18,
    });
    this.metalMaterials.push(metalMat);

    const cushionMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(initialColorway.cushionColor),
      roughness: 0.8,
      metalness: 0.05,
      bumpMap: this.leatherTexture,
      bumpScale: 0.015,
    });
    this.cushionMaterials.push(cushionMat);

    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(initialColorway.accentColor),
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(initialColorway.accentColor),
      emissiveIntensity: 0.25,
    });
    this.accentMaterials.push(accentMat);

    // Copper material for internal transducer coils
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xcc6633,
      metalness: 0.96,
      roughness: 0.15,
    });

    // Dark acoustic chassis material
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      metalness: 0.5,
      roughness: 0.4,
    });

    // -----------------------------------------------------------------
    // 3. Headband Assembly (Arch, slider rails, comfort canopy & badge)
    // -----------------------------------------------------------------
    this.headbandGroup = new THREE.Group();
    this.headbandGroup.name = 'HeadbandAssembly';

    // Main structural arc curve
    const arcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.95, 0.45, 0),
      new THREE.Vector3(-0.7, 1.15, 0),
      new THREE.Vector3(0, 1.35, 0),
      new THREE.Vector3(0.7, 1.15, 0),
      new THREE.Vector3(0.95, 0.45, 0),
    ]);

    const arcGeom = new THREE.TubeGeometry(arcCurve, 48, 0.038, 16, false);
    const arcMesh = new THREE.Mesh(arcGeom, metalMat);
    arcMesh.castShadow = true;
    arcMesh.receiveShadow = true;
    this.headbandGroup.add(arcMesh);

    // Inner comfort suspension canopy
    const innerCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.75, 0.65, 0),
      new THREE.Vector3(-0.5, 1.12, 0),
      new THREE.Vector3(0, 1.25, 0),
      new THREE.Vector3(0.5, 1.12, 0),
      new THREE.Vector3(0.75, 0.65, 0),
    ]);
    const canopyGeom = new THREE.TubeGeometry(innerCurve, 40, 0.052, 12, false);
    const canopyMesh = new THREE.Mesh(canopyGeom, cushionMat);
    canopyMesh.scale.set(1, 0.45, 1.6);
    canopyMesh.castShadow = true;
    this.headbandGroup.add(canopyMesh);

    // Laser-engraved titanium badge on top center of the headband
    const badgeGeom = new THREE.BoxGeometry(0.36, 0.08, 0.01);
    const badgeMat = new THREE.MeshStandardMaterial({
      map: this.currentEngravingTexture,
      metalness: 0.85,
      roughness: 0.25,
    });
    this.badgeMesh = new THREE.Mesh(badgeGeom, badgeMat);
    this.badgeMesh.position.set(0, 1.39, 0.038);
    this.badgeMesh.rotation.x = -Math.PI / 14;
    this.headbandGroup.add(this.badgeMesh);

    this.group.add(this.headbandGroup);

    // -----------------------------------------------------------------
    // 4. Slider Arms & Gimbal Yokes (Left & Right)
    // -----------------------------------------------------------------
    const createGimbalArm = (side: 'left' | 'right') => {
      const g = new THREE.Group();
      const xMult = side === 'left' ? -1 : 1;

      // Telescopic slider stalk
      const stalkGeom = new THREE.BoxGeometry(0.04, 0.35, 0.04);
      const stalk = new THREE.Mesh(stalkGeom, metalMat);
      stalk.position.set(xMult * 0.95, 0.38, 0);
      stalk.rotation.z = xMult * 0.18;
      stalk.castShadow = true;
      g.add(stalk);

      // Yoke pivot ring / joint
      const pivotGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.05, 24);
      const pivot = new THREE.Mesh(pivotGeom, metalMat);
      pivot.position.set(xMult * 0.98, 0.18, 0);
      pivot.rotation.x = Math.PI / 2;
      g.add(pivot);

      // Curved Yoke fork
      const yokeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xMult * 0.98, 0.18, 0),
        new THREE.Vector3(xMult * 0.96, -0.05, 0.28),
        new THREE.Vector3(xMult * 0.92, -0.16, 0.22),
      ]);
      const yokeGeom = new THREE.TubeGeometry(yokeCurve, 20, 0.024, 12, false);
      const yokeFront = new THREE.Mesh(yokeGeom, metalMat);
      yokeFront.castShadow = true;
      g.add(yokeFront);

      // Back fork arm
      const yokeCurveBack = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xMult * 0.98, 0.18, 0),
        new THREE.Vector3(xMult * 0.96, -0.05, -0.28),
        new THREE.Vector3(xMult * 0.92, -0.16, -0.22),
      ]);
      const yokeGeomBack = new THREE.TubeGeometry(yokeCurveBack, 20, 0.024, 12, false);
      const yokeBack = new THREE.Mesh(yokeGeomBack, metalMat);
      yokeBack.castShadow = true;
      g.add(yokeBack);

      return g;
    };

    this.leftGimbal = createGimbalArm('left');
    this.rightGimbal = createGimbalArm('right');
    this.group.add(this.leftGimbal);
    this.group.add(this.rightGimbal);

    // -----------------------------------------------------------------
    // 5. Acoustic Earcup Assemblies (Left & Right)
    // -----------------------------------------------------------------
    const createCupAssembly = (side: 'left' | 'right') => {
      const cupGroup = new THREE.Group();
      const xMult = side === 'left' ? -1 : 1;

      // Base position at ear level
      cupGroup.position.set(xMult * 0.92, -0.16, 0);

      // 5A. Outer Ergonomic Shell (Aerodynamic sculpt)
      const shellGeom = new THREE.CylinderGeometry(0.38, 0.36, 0.16, 48);
      shellGeom.scale(1.15, 1, 1.4); // Oval ergonomic ear geometry
      const shell = new THREE.Mesh(shellGeom, bodyMat);
      shell.rotation.z = Math.PI / 2;
      shell.castShadow = true;
      shell.receiveShadow = true;
      cupGroup.add(shell);

      // Chamfered metal bezel accent ring
      const bezelGeom = new THREE.TorusGeometry(0.375, 0.018, 16, 48);
      bezelGeom.scale(1.15, 1.4, 1);
      const bezel = new THREE.Mesh(bezelGeom, metalMat);
      bezel.rotation.y = Math.PI / 2;
      bezel.position.set(xMult * 0.08, 0, 0);
      cupGroup.add(bezel);

      // 5B. Laser-Perforated Acoustic Grille Disc
      const grilleGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.015, 48);
      grilleGeom.scale(1.12, 1, 1.35);
      const grilleMat = new THREE.MeshStandardMaterial({
        map: this.grilleTexture,
        metalness: 0.92,
        roughness: 0.28,
      });
      const grille = new THREE.Mesh(grilleGeom, grilleMat);
      grille.rotation.z = Math.PI / 2;
      grille.position.set(xMult * 0.09, 0, 0);
      grille.castShadow = true;
      cupGroup.add(grille);

      // 5C. Internal Planar Magnetic Driver Assembly
      const driverGroup = new THREE.Group();
      driverGroup.name = `${side}DriverGroup`;

      // Driver chassis ring
      const chassisGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 36);
      chassisGeom.scale(1.0, 1, 1.25);
      const chassis = new THREE.Mesh(chassisGeom, chassisMat);
      chassis.rotation.z = Math.PI / 2;
      driverGroup.add(chassis);

      // Planar magnetic diaphragm disc (semi-translucent ultra-thin golden amber film)
      const diaphragmGeom = new THREE.CircleGeometry(0.25, 32);
      diaphragmGeom.scale(1.0, 1.25, 1);
      const diaphragmMat = new THREE.MeshStandardMaterial({
        color: 0xd9a74a,
        metalness: 0.85,
        roughness: 0.12,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
      });
      const diaphragm = new THREE.Mesh(diaphragmGeom, diaphragmMat);
      diaphragm.rotation.y = Math.PI / 2;
      driverGroup.add(diaphragm);

      // Concentric copper voice coil traces on diaphragm
      for (let r = 0.06; r <= 0.22; r += 0.04) {
        const coilGeom = new THREE.TorusGeometry(r, 0.004, 8, 32);
        coilGeom.scale(1.0, 1.22, 1);
        const coil = new THREE.Mesh(coilGeom, copperMat);
        coil.rotation.y = Math.PI / 2;
        coil.position.x = xMult * 0.002;
        driverGroup.add(coil);
      }

      // Neodymium bar magnets (6 precision micro-bars)
      for (let m = -2; m <= 2; m++) {
        const magGeom = new THREE.BoxGeometry(0.012, 0.02, 0.36);
        const mag = new THREE.Mesh(magGeom, metalMat);
        mag.position.set(xMult * -0.015, m * 0.07, 0);
        driverGroup.add(mag);
      }

      cupGroup.add(driverGroup);

      // 5D. Visco-Elastic Memory Foam Ear Cushion
      const cushionGeom = new THREE.TorusGeometry(0.36, 0.12, 24, 48);
      cushionGeom.scale(1.15, 1.4, 1.3);
      const cushion = new THREE.Mesh(cushionGeom, cushionMat);
      cushion.rotation.y = Math.PI / 2;
      cushion.position.set(xMult * -0.14, 0, 0);
      cushion.castShadow = true;
      cupGroup.add(cushion);

      // 5E. Tactile Crown Dials & Controls (on right cup especially)
      const crownGroup = new THREE.Group();
      if (side === 'right') {
        // Multi-function digital crown dial with diamond knurling
        const crownGeom = new THREE.CylinderGeometry(0.075, 0.075, 0.06, 32);
        const crownMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(initialColorway.metalColor),
          metalness: 0.96,
          roughness: 0.22,
          bumpMap: this.knurledTexture,
          bumpScale: 0.04,
        });
        const crownMesh = new THREE.Mesh(crownGeom, crownMat);
        crownMesh.position.set(0.02, 0.34, 0.18);
        crownMesh.rotation.z = Math.PI / 4;
        crownGroup.add(crownMesh);

        // Tactile action push-button
        const btnGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 24);
        const btn = new THREE.Mesh(btnGeom, metalMat);
        btn.position.set(0.02, -0.32, 0.2);
        btn.rotation.z = Math.PI / 4;
        crownGroup.add(btn);
      }
      cupGroup.add(crownGroup);

      // 5F. Ambient LED Status Ring
      const ledRingGeom = new THREE.TorusGeometry(0.12, 0.008, 12, 32);
      const ledRing = new THREE.Mesh(ledRingGeom, accentMat);
      ledRing.position.set(xMult * 0.09, 0, 0);
      ledRing.rotation.y = Math.PI / 2;
      cupGroup.add(ledRing);

      return {
        assembly: cupGroup,
        shell,
        driver: driverGroup,
        grille,
        cushion,
        crown: crownGroup,
      };
    };

    const leftData = createCupAssembly('left');
    this.leftCupAssembly = leftData.assembly;
    this.leftShell = leftData.shell;
    this.leftDriver = leftData.driver;
    this.leftGrille = leftData.grille;
    this.leftCushion = leftData.cushion;
    this.group.add(this.leftCupAssembly);

    const rightData = createCupAssembly('right');
    this.rightCupAssembly = rightData.assembly;
    this.rightShell = rightData.shell;
    this.rightDriver = rightData.driver;
    this.rightGrille = rightData.grille;
    this.rightCushion = rightData.cushion;
    this.rightCrownDial = rightData.crown;
    this.group.add(this.rightCupAssembly);

    // -----------------------------------------------------------------
    // 6. Grounding Contact Shadow Plane
    // -----------------------------------------------------------------
    const shadowGeom = new THREE.PlaneGeometry(3.6, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeom, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.92;
    this.group.add(shadowPlane);

    // -----------------------------------------------------------------
    // 7. Spatial Acoustic Wave Rings (Radiant soundfield visualizer)
    // -----------------------------------------------------------------
    this.spatialWavesGroup = new THREE.Group();
    this.spatialWavesGroup.name = 'SpatialSoundfield';

    const waveCount = 5;
    for (let i = 0; i < waveCount; i++) {
      const radius = 0.5 + i * 0.28;
      const waveGeom = new THREE.TorusGeometry(radius, 0.006, 8, 48);
      const waveMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(initialColorway.accentColor),
        transparent: true,
        opacity: 0.0,
      });
      this.spatialWaveMaterials.push(waveMat);

      const waveLeft = new THREE.Mesh(waveGeom, waveMat);
      waveLeft.position.set(-0.95, -0.16, 0);
      waveLeft.rotation.y = Math.PI / 2;
      this.spatialWavesGroup.add(waveLeft);

      const waveRight = new THREE.Mesh(waveGeom, waveMat);
      waveRight.position.set(0.95, -0.16, 0);
      waveRight.rotation.y = Math.PI / 2;
      this.spatialWavesGroup.add(waveRight);
    }
    this.group.add(this.spatialWavesGroup);

    // Initial positioning
    this.group.position.y = 0.15;
  }

  /**
   * Smoothly applies exploded view displacement offsets along local cup axes.
   */
  public updateExplodedView(progress: number) {
    const offsets = computeExplodedOffsets(progress);

    // Left Cup exploded displacements (outward along -X)
    this.leftShell.position.x = -offsets.earcupOuter;
    this.leftGrille.position.x = -offsets.acousticGrille;
    this.leftDriver.position.x = -offsets.driverDiaphragm;
    this.leftCushion.position.x = -offsets.earCushion; // moves opposite (inward)
    this.leftGimbal.position.x = -offsets.gimbalFork;

    // Right Cup exploded displacements (outward along +X)
    this.rightShell.position.x = offsets.earcupOuter;
    this.rightGrille.position.x = offsets.acousticGrille;
    this.rightDriver.position.x = offsets.driverDiaphragm;
    this.rightCushion.position.x = offsets.earCushion;
    this.rightCrownDial.position.x = offsets.crownDial;
    this.rightGimbal.position.x = offsets.gimbalFork;

    // Slight headband lift on full explosion
    this.headbandGroup.position.y = offsets.headbandLift;
  }

  /**
   * Updates colorway and PBR material finishes smoothly.
   */
  public setColorway(colorway: Colorway) {
    const bodyCol = new THREE.Color(colorway.bodyColor);
    const metalCol = new THREE.Color(colorway.metalColor);
    const cushionCol = new THREE.Color(colorway.cushionColor);
    const accentCol = new THREE.Color(colorway.accentColor);

    this.bodyMaterials.forEach(m => {
      m.color.copy(bodyCol);
      m.metalness = colorway.metalness;
      m.roughness = colorway.roughness;
    });

    this.metalMaterials.forEach(m => {
      m.color.copy(metalCol);
    });

    this.cushionMaterials.forEach(m => {
      m.color.copy(cushionCol);
    });

    this.accentMaterials.forEach(m => {
      m.color.copy(accentCol);
      m.emissive.copy(accentCol);
    });

    this.spatialWaveMaterials.forEach(m => {
      m.color.copy(accentCol);
    });
  }

  /**
   * Updates laser-engraved badge text.
   */
  public updateEngraving(text: string) {
    const oldTexture = this.currentEngravingTexture;
    this.currentEngravingTexture = createEngravingTexture(text);
    (this.badgeMesh.material as THREE.MeshStandardMaterial).map = this.currentEngravingTexture;
    (this.badgeMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
    oldTexture.dispose();
  }

  /**
   * Animates spatial acoustic wave rings during sound demonstration.
   */
  public updateSpatialWaves(time: number, isSoundPlaying: boolean, pan: number) {
    const baseWaveOpacity = isSoundPlaying ? 0.65 : 0.08;
    this.spatialWaveMaterials.forEach((mat, idx) => {
      const phase = (time * 2.2 + idx * 0.7) % (Math.PI * 2);
      const pulse = Math.sin(phase) * 0.5 + 0.5;
      
      // Pan bias affects left vs right balance
      mat.opacity = baseWaveOpacity * (0.3 + 0.7 * pulse);
    });

    if (isSoundPlaying) {
      // Gentle subtle breathing motion
      const waveScale = 1.0 + Math.sin(time * 3.5) * 0.05;
      this.spatialWavesGroup.scale.set(waveScale, waveScale, waveScale);
    }
  }

  public dispose() {
    this.knurledTexture.dispose();
    this.grilleTexture.dispose();
    this.leatherTexture.dispose();
    this.currentEngravingTexture.dispose();
    this.group.traverse(obj => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
  }
}
