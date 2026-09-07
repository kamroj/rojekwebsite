import assert from 'node:assert/strict';
import test from 'node:test';
import { createHandleLeverGeometry, createHandlePlateGeometry } from './hsHandleGeometry.js';

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-6, `${actual} ≠ ${expected}`);

test('shared lightweight handle retains the dimensions and spindle position from the drawing', () => {
  const plate = createHandlePlateGeometry();
  const lever = createHandleLeverGeometry();
  for (const geometry of [plate, lever]) {
    geometry.computeBoundingBox();
    assert.ok(geometry.index);
    assert.ok(geometry.attributes.position.count < 1000);
    for (const attribute of Object.values(geometry.attributes)) {
      assert.ok(Array.from(attribute.array).every(Number.isFinite));
    }
  }
  near(plate.boundingBox.max.x - plate.boundingBox.min.x, 0.0335);
  near(plate.boundingBox.max.y - plate.boundingBox.min.y, 0.152);
  near(plate.boundingBox.min.z, 0);
  near(plate.boundingBox.max.z, 0.014);
  near(plate.boundingBox.max.y, 0.052);
  near(lever.boundingBox.max.y, 0.24);
  near(lever.boundingBox.max.z - plate.boundingBox.max.z, 0.056);
  lever.rotateZ(Math.PI);
  lever.computeBoundingBox();
  near(lever.boundingBox.min.y, -0.24);
  plate.dispose();
  lever.dispose();
});
