// Geometria klamki HS odwzorowana z rysunku technicznego G-U:
// - szyld 33,5 x 152 x 14 mm; mocowania co 80 mm, trzpień 40 mm pod górnym,
// - czubek dźwigni 240 mm powyżej osi trzpienia,
// - wysięg 56 mm od nasady dźwigni na licu szyldu (70 mm od skrzydła).
// Promienie, szerokość chwytu i odsunięcie osi od góry szyldu nie są
// zwymiarowane: odtworzone z proporcji konturu załączonego rysunku.
// Układ współrzędnych: początek = oś obrotu trzpienia (powyżej środka szyldu),
// +z od lica skrzydła w głąb pomieszczenia, wymiary w metrach.

import { ExtrudeGeometry, Shape } from 'three';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const MM = 0.001;

export const HANDLE = {
  plate: { width: 33.5 * MM, height: 152 * MM, depth: 14 * MM, radius: 5 * MM, axisFromTop: 52 * MM },
  lever: { width: 25 * MM, height: 240 * MM, projection: 56 * MM, bottom: -13 * MM, gripDepth: 16 * MM, edge: 2 * MM },
};

function roundedRectShape(width, height, radius) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  shape.closePath();
  return shape;
}

// Bevel z bevelOffset = -bevelSize trzyma ściany dokładnie na obrysie profilu
// (zaokrąglenie „wchodzi" w bryłę zamiast ją poszerzać), więc wymiary z rysunku
// pozostają nominalne. toCreasedNormals wygładza łuki, zostawiając ostre
// krawędzie ścięć i lic (granica ~28°).
function extrudeOnContour(shape, { thickness, edge, curveSegments }) {
  const geometry = new ExtrudeGeometry(shape, {
    depth: thickness - edge * 2,
    steps: 1,
    curveSegments,
    bevelEnabled: true,
    bevelThickness: edge,
    bevelSize: edge,
    bevelOffset: -edge,
    bevelSegments: 4,
  });
  geometry.translate(0, 0, -(thickness - edge * 2) / 2);
  return toCreasedNormals(geometry, 0.5);
}

export function createHandlePlateGeometry() {
  const { width, height, depth, radius, axisFromTop } = HANDLE.plate;
  const geometry = extrudeOnContour(roundedRectShape(width, height, radius), {
    thickness: depth,
    edge: 1 * MM,
    curveSegments: 8,
  });
  // Tył płytki na licu skrzydła (z=0), front na z = depth
  geometry.translate(0, axisFromTop - height / 2, depth / 2);
  return geometry;
}

// Profil boczny dźwigni w płaszczyźnie (z, y): z = odległość od lica skrzydła,
// y względem osi trzpienia. Szyjka schowana 1 mm w szyldzie, żeby obrót nie
// odsłaniał szczeliny. Dolna szyjka jest krótka, a chwyt niemal prosty;
// zaokrąglony górny koniec zawija się w stronę skrzydła.
export function createHandleLeverGeometry() {
  const face = HANDLE.plate.depth;
  const outer = face + HANDLE.lever.projection;
  const inner = outer - HANDLE.lever.gripDepth;
  const top = HANDLE.lever.height;
  const p = new Shape();
  p.moveTo(face - MM, 12 * MM);
  p.lineTo(face + 28 * MM, 15 * MM);
  p.quadraticCurveTo(inner, 16 * MM, inner, 28 * MM);
  p.lineTo(inner, top - 25 * MM);
  p.quadraticCurveTo(inner, top - 18 * MM, inner - 7 * MM, top - 16 * MM);
  p.lineTo(face + 23 * MM, top - 13 * MM);
  p.quadraticCurveTo(face + 21 * MM, top - 13 * MM, face + 22 * MM, top - 10 * MM);
  p.lineTo(face + 25 * MM, top);
  p.lineTo(outer - 7 * MM, top - 6 * MM);
  p.quadraticCurveTo(outer, top - 8 * MM, outer, top - 15 * MM);
  p.lineTo(outer, 3 * MM);
  p.quadraticCurveTo(outer, -8 * MM, outer - 12 * MM, -10 * MM);
  p.lineTo(face - MM, HANDLE.lever.bottom);
  p.closePath();

  const geometry = extrudeOnContour(p, {
    thickness: HANDLE.lever.width,
    edge: HANDLE.lever.edge,
    curveSegments: 16,
  });
  // Profil leży w (x=z, y) — obrót mapuje wyciągnięcie na szerokość (oś x),
  // a płaszczyznę profilu na (z, y) świata
  geometry.rotateY(-Math.PI / 2);
  return geometry;
}
