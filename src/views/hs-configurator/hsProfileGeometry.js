import { BoxGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getWoodAppearance, getWoodGrainDrift } from './hsWoodAppearance.js';

export const WOOD_GRAIN_SCALE = getWoodAppearance('pine').grainScale;

export function createProfileGeometry(width, height, depth, radius = 0, grainAxis = null, grainScale = WOOD_GRAIN_SCALE, grainSeed = 0.5) {
  // Jeden segment łuku wystarcza na milimetrowe krawędzie profili; bez
  // dodatkowych przebiegów renderowania i gęstej siatki na telefonach.
  const geometry = radius > 0
    ? new RoundedBoxGeometry(width, height, depth, 1, Math.min(radius, Math.min(width, height, depth) / 4))
    : new BoxGeometry(width, height, depth);

  if (!grainAxis) return geometry;

  const uv = geometry.attributes.uv;
  const positions = geometry.attributes.position;
  const vertical = grainAxis === 'y';
  const length = vertical ? height : width;
  const breadth = vertical ? width : height;
  const drift = getWoodGrainDrift(grainScale, grainSeed);
  const verticesPerFace = uv.count / 6;
  for (let i = 0; i < uv.count; i += 1) {
    const face = Math.floor(i / verticesPerFace);
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const along = vertical ? y : x;
    const across = vertical ? x : y;
    const endFace = vertical ? face === 2 || face === 3 : face === 0 || face === 1;
    // Czoła profilu próbkują krótki wycinek, bez rozciągnięcia na długość belki.
    if (endFace) {
      uv.setXY(i, (z + depth / 2) / grainScale.across, across / grainScale.across);
      continue;
    }
    // Rozwinięcie obwodu: słoje przechodzą z lica na sąsiednie boki,
    // zawsze wzdłuż belki. Jedyny szew wypada przy tylnej krawędzi.
    const positiveSide = vertical ? face === 0 : face === 2;
    const negativeSide = vertical ? face === 1 : face === 3;
    const perimeter = positiveSide ? breadth / 2 + depth / 2 - z
      : negativeSide ? -breadth / 2 - depth / 2 + z
        : face === 5 ? breadth + depth - across : across;
    const grainU = (along + length / 2) / grainScale.along;
    uv.setXY(i, grainU, perimeter / grainScale.across + grainU * drift);
  }
  return geometry;
}
