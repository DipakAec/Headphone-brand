import test from 'node:test';
import assert from 'node:assert/strict';
import {
  lerp,
  clamp,
  smoothstep,
  interpolateScrollState,
  computeExplodedOffsets,
  formatFrequency,
  KEYFRAME_STAGES,
  COLORWAYS,
} from './productMath.ts';

test('lerp correctly blends values', () => {
  assert.equal(lerp(10, 20, 0), 10);
  assert.equal(lerp(10, 20, 1), 20);
  assert.equal(lerp(10, 20, 0.5), 15);
});

test('clamp restricts bounds', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-3, 0, 10), 0);
  assert.equal(clamp(15, 0, 10), 10);
});

test('smoothstep eases correctly', () => {
  assert.equal(smoothstep(0, 1, 0), 0);
  assert.equal(smoothstep(0, 1, 1), 1);
  assert.equal(smoothstep(0, 1, 0.5), 0.5);
  // Boundary checks
  assert.equal(smoothstep(0, 1, -0.5), 0);
  assert.equal(smoothstep(0, 1, 1.5), 1);
});

test('interpolateScrollState returns valid camera and exploded state at start, mid and end', () => {
  const start = interpolateScrollState(0);
  assert.equal(start.activeStageIndex, 0);
  assert.equal(start.activeStage.id, 'overview');
  assert.equal(start.explodedProgress, 0);
  assert.equal(start.cameraPosition.length, 3);

  const driverMid = interpolateScrollState(0.3);
  assert.equal(driverMid.activeStageIndex, 1);
  assert.equal(driverMid.activeStage.id, 'driver');
  assert.ok(driverMid.explodedProgress > 0.5);

  const end = interpolateScrollState(1.0);
  assert.equal(end.activeStageIndex, KEYFRAME_STAGES.length - 1);
  assert.equal(end.activeStage.id, 'studio');
});

test('computeExplodedOffsets scales smoothly with progress', () => {
  const zero = computeExplodedOffsets(0);
  assert.equal(zero.earcupOuter, 0);
  assert.equal(zero.driverDiaphragm, 0);
  assert.equal(zero.earCushion, 0);

  const full = computeExplodedOffsets(1);
  assert.ok(full.earcupOuter > 0.2);
  assert.ok(full.driverDiaphragm > 0.1);
  assert.ok(full.acousticGrille > 0.3);
  assert.ok(full.earCushion < 0); // moves opposite (inward)
});

test('formatFrequency formats Hz and kHz correctly', () => {
  assert.equal(formatFrequency(80), '80 Hz');
  assert.equal(formatFrequency(1000), '1.0 kHz');
  assert.equal(formatFrequency(24000), '24.0 kHz');
});

test('COLORWAYS has required 5 luxury finishes with valid properties', () => {
  assert.equal(COLORWAYS.length, 5);
  COLORWAYS.forEach(c => {
    assert.ok(c.id);
    assert.ok(c.name);
    assert.ok(c.bodyColor.startsWith('#'));
    assert.ok(c.metalness >= 0 && c.metalness <= 1);
    assert.ok(c.roughness >= 0 && c.roughness <= 1);
  });
});
