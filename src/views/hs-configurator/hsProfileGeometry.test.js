import assert from 'node:assert/strict';
import test from 'node:test';
import { createProfileGeometry } from './hsProfileGeometry.js';
import { getWoodAppearance } from './hsWoodAppearance.js';

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-5, `${actual} ≠ ${expected}`);

for (const species of ['pine', 'meranti', 'oak']) {
  for (const axis of ['x', 'y']) {
    test(`${species}, ${axis}: grain follows the member and joins the front to its side`, () => {
      const scale = getWoodAppearance(species).grainScale;
      const geometry = createProfileGeometry(0.09, 2, 0.092, 0, axis, scale);
      const { position, uv } = geometry.attributes;
      const sideStart = axis === 'y' ? 0 : 8;
      let sharedCorners = 0;
      for (let front = 16; front < 20; front += 1) {
        for (let side = sideStart; side < sideStart + 4; side += 1) {
          if ([0, 1, 2].every((c) => position.array[front * 3 + c] === position.array[side * 3 + c])) {
            near(uv.getX(front), uv.getX(side));
            near(uv.getY(front), uv.getY(side));
            sharedCorners += 1;
          }
        }
      }
      assert.equal(sharedCorners, 2);
      // Longitudinal UV distance must reflect metres, on both visible faces.
      for (const start of [16, sideStart]) {
        const values = Array.from({ length: 4 }, (_, i) => uv.getX(start + i));
        near(Math.max(...values) - Math.min(...values), (axis === 'y' ? 2 : 0.09) / scale.along);
      }
      geometry.dispose();
    });
  }
}

test('rounded members retain their dimensions and finite UVs when resized', () => {
  for (const length of [0.09, 2, 5]) {
    const geometry = createProfileGeometry(length, 0.09, 0.092, 0.0015, 'x', getWoodAppearance('oak').grainScale);
    geometry.computeBoundingBox();
    const { min, max } = geometry.boundingBox;
    near(max.x - min.x, length);
    near(max.y - min.y, 0.09);
    near(max.z - min.z, 0.092);
    for (const attribute of Object.values(geometry.attributes)) {
      assert.ok(Array.from(attribute.array).every(Number.isFinite));
    }
    const uv = geometry.attributes.uv;
    const count = uv.count / 6;
    const front = Array.from({ length: count }, (_, i) => uv.getX(4 * count + i));
    const frontX = Array.from({ length: count }, (_, i) => geometry.attributes.position.getX(4 * count + i));
    near(Math.max(...front) - Math.min(...front), (Math.max(...frontX) - Math.min(...frontX)) / getWoodAppearance('oak').grainScale.along);
    geometry.dispose();
  }
});

test('oak samples a different band after a mirrored tile cycle, deterministically per member', () => {
  const scale = getWoodAppearance('oak').grainScale;
  const create = (seed) => createProfileGeometry(0.09, scale.along * 2, 0.092, 0, 'y', scale, seed);
  const first = create(0.2);
  const repeat = create(0.2);
  const other = create(0.8);
  assert.deepEqual(first.attributes.uv.array, repeat.attributes.uv.array);
  assert.notDeepEqual(first.attributes.uv.array, other.attributes.uv.array);
  // Front left upper/lower corners share the same transverse position.
  // U differs by one full mirror cycle, but V must select another grain band.
  near(Math.abs(first.attributes.uv.getX(16) - first.attributes.uv.getX(18)), 2);
  assert.ok(Math.abs(first.attributes.uv.getY(16) - first.attributes.uv.getY(18)) > 0.2);
  for (const geometry of [first, repeat, other]) geometry.dispose();
});
