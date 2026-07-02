// Geometria klamki HS odwzorowana z rysunku technicznego G-U:
// - płytka montażowa 46 x 143,5 x 19 mm o zaokrąglonych narożach,
// - dźwignia-płaskownik 27 x 15 mm zbudowana z profilu bocznego wyciągniętego
//   na szerokość: u dołu łukiem przechodzi w poziomą szyjkę na osi trzpienia,
//   u góry kończy się „dziobkiem" ściętym ku szybie (najwyższy punkt od strony
//   okna). Lico wewnętrzne dźwigni 61 mm od skrzydła, zewnętrzne 76 mm,
//   całkowita wysokość 311,7 mm od dołu płytki do czubka.
// Układ współrzędnych: początek = środek płytki = oś obrotu trzpienia,
// +z od lica skrzydła w głąb pomieszczenia, wymiary w metrach.

import { ExtrudeGeometry, Shape } from 'three';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const MM = 0.001;

export const HANDLE = {
  plate: { width: 46 * MM, height: 143.5 * MM, depth: 19 * MM, radius: 10 * MM },
  lever: { width: 27 * MM, edge: 4 * MM }, // edge = promień zaokrąglenia krawędzi bocznych
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
  const { width, height, depth, radius } = HANDLE.plate;
  const geometry = extrudeOnContour(roundedRectShape(width, height, radius), {
    thickness: depth,
    edge: 1 * MM,
    curveSegments: 8,
  });
  // Tył płytki na licu skrzydła (z=0), front na z = depth
  geometry.translate(0, 0, depth / 2);
  return geometry;
}

// Profil boczny dźwigni w płaszczyźnie (z, y): z = odległość od lica skrzydła,
// y względem osi trzpienia. Szyjka schowana 3 mm w płytce (z=16 < 19), żeby
// przy obrocie dźwigni nie odsłaniała się szczelina.
export function createHandleLeverGeometry() {
  const p = new Shape();
  p.moveTo(16 * MM, 13 * MM); // górna krawędź szyjki przy płytce
  p.lineTo(30 * MM, 13 * MM);
  p.quadraticCurveTo(61 * MM, 13 * MM, 61 * MM, 58 * MM); // łuk wewnętrzny szyjka → dźwignia
  p.lineTo(61 * MM, 225 * MM); // lico wewnętrzne (61 mm od skrzydła)
  p.lineTo(47 * MM, 240 * MM); // „dziobek" — czubek pochylony ku szybie
  p.lineTo(76 * MM, 236 * MM); // ścięcie górne do lica zewnętrznego
  p.lineTo(76 * MM, -4 * MM); // lico zewnętrzne (76 mm od skrzydła)
  p.quadraticCurveTo(76 * MM, -16 * MM, 62 * MM, -16 * MM); // łuk zewnętrzny dołu
  p.lineTo(40 * MM, -16 * MM);
  p.quadraticCurveTo(28 * MM, -16 * MM, 16 * MM, -13 * MM); // spód szyjki wznosi się ku płytce
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
