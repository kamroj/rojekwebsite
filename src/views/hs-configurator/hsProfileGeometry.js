import { BoxGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Jeden wycinek drewna odpowiada 1,6 m wzdłuż włókien i 12 cm w poprzek.
// Zmiana wymiarów okna odsłania kolejny fragment zamiast rozciągać słoje.
export const WOOD_GRAIN_SCALE = { along: 1.6, across: 0.12 };

export function createProfileGeometry(width, height, depth, radius = 0, grainAxis = null) {
  // Jeden segment łuku wystarcza na milimetrowe krawędzie profili; bez
  // dodatkowych przebiegów renderowania i gęstej siatki na telefonach.
  const geometry = radius > 0
    ? new RoundedBoxGeometry(width, height, depth, 1, Math.min(radius, Math.min(width, height, depth) / 4))
    : new BoxGeometry(width, height, depth);

  if (!grainAxis) return geometry;

  const uv = geometry.attributes.uv;
  const faceSizes = [[depth, height], [depth, height], [width, depth], [width, depth], [width, height], [width, height]];
  const scaleU = grainAxis === 'y' ? WOOD_GRAIN_SCALE.across : WOOD_GRAIN_SCALE.along;
  const scaleV = grainAxis === 'y' ? WOOD_GRAIN_SCALE.along : WOOD_GRAIN_SCALE.across;
  const verticesPerFace = uv.count / 6;
  for (let i = 0; i < uv.count; i += 1) {
    const [faceWidth, faceHeight] = faceSizes[Math.floor(i / verticesPerFace)];
    uv.setXY(i, uv.getX(i) * faceWidth / scaleU, uv.getY(i) * faceHeight / scaleV);
  }
  return geometry;
}
