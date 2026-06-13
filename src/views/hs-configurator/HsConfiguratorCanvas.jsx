import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Center,
  ContactShadows,
  Environment,
  OrbitControls,
  useTexture,
} from '@react-three/drei';

import {
  Box3,
  ExtrudeGeometry,
  LinearFilter,
  LinearMipMapLinearFilter,
  Matrix4,
  NeutralToneMapping,
  NoColorSpace,
  RepeatWrapping,
  Shape,
  Sphere,
  SRGBColorSpace,
  Vector3,
} from 'three';

import { ALU_COLORS, DEFAULT_ALU_COLOR } from './hsOptions.js';

// Awaryjna mapa słojów (gdy resolver nie dostarczy ścieżek) — sosna
const FALLBACK_GRAIN = '/models/lazur/grain-pine.jpg';

// Wymiary profili systemu HS wg przekroju producenta (w metrach)
const PROFILE = {
  frame: 0.056, // ościeżnica 56 x 208 mm
  frameDepth: 0.208,
  sash: 0.09, // skrzydło (przesuwne i stałe) 90 x 92 mm
  sashDepth: 0.092,
  fixed: 0.09,
  fixedDepth: 0.092,
  filler: { height: 0.019, depth: 0.115 }, // listwa maskująca 19 x 115 mm nad polem stałym
  bead: 0.022, // listwa przyszybowa
  gasket: 0.012, // uszczelka wokół szyby
  threshold: 0.05, // wysokość niskiego progu
  trackInnerZ: 0.055, // tor wewnętrzny (skrzydła przesuwne)
  trackOuterZ: -0.055, // tor zewnętrzny (pola stałe)
  overlap: 0.045, // zakład skrzydła przesuwnego na pole stałe
};

// Niski próg wg przekroju producenta: wyższy blok komorowy od strony
// wewnętrznej z szyną jezdną (płaskownik + wałek), stopień w dół pod polem
// stałym i niski nos okapowy wystający przed lico ościeżnicy od zewnątrz.
// Zakresy z opisują strefy wzdłuż głębokości profilu (wnętrze = +z)
const THRESHOLD = {
  inner: { height: PROFILE.threshold, zFrom: 0.008, zTo: 0.104 },
  platform: { height: 0.034, zFrom: -0.104, zTo: 0.008 },
  nose: { height: 0.02, zFrom: -0.132, zTo: -0.104 },
  rail: { radius: 0.004, width: 0.012 },
  plate: 0.003, // nakładki maskujące na górze bloku wewnętrznego
};

// Wariant drewno-aluminium: płaskie nakładki maskujące (system typu Aluron
// Gemini Quadrat) doklejane do lic zewnętrznych ościeżnicy, skrzydeł i listew —
// drewno zostaje widoczne od wewnątrz. `depth` to grubość nakładki, `side` to
// grubość plakiet owijających boki profili (nakładka wraca po bokach skrzydła
// do ok. połowy głębokości profilu, przez co środkowe słupki w strefie zakładu
// czytają się od zewnątrz jako pełne aluminium). Kolory (hex lakieru
// proszkowego RAL) pochodzą z palety ALU_COLORS w hsOptions
const ALU = { depth: 0.016, side: 0.003 };
const ALU_HEX = Object.fromEntries(ALU_COLORS.map((color) => [color.value, color.hex]));

const OV = PROFILE.overlap;
// Słupek statyczny i szklenie stałe (G2/G3) wypełniają głębokość ościeżnicy
// aż pod płaszczyznę skrzydła przesuwnego (tył skrzydła = +0.009), żeby z boku
// nie było widać szczeliny między polem stałym a skrzydłem
const MULLION = { width: 0.09, depth: 0.096, z: -0.041 };
const MULLION_TUCK = MULLION.width / 2 - 0.003; // krawędź pola schowana 3 mm pod słupkiem
const GLAZING = { profile: 0.045, depth: 0.09, z: -0.04 };

// Panele wg schematów: skrzydła przesuwne jeżdżą po torze wewnętrznym lub
// zewnętrznym i zachodzą na sąsiadów (zakład `extend`); typy pól:
// sliding = skrzydło przesuwne, fixed = skrzydło stałe ramowe,
// glazing = szklenie stałe bezpośrednio w ościeżnicy (bez ramy skrzydła).
// span = udział w szerokości światła ościeżnicy.
const SCHEME_DEFINITIONS = {
  a: {
    panels: [
      { type: 'sliding', span: [0, 0.5], track: 'inner', handle: 'left', extend: [0, OV] },
      { type: 'fixed', span: [0.5, 1], track: 'outer', extend: [-OV, 0] },
    ],
  },
  a3: {
    panels: [
      { type: 'fixed', span: [0, 0.5], track: 'outer', extend: [0, OV] },
      { type: 'sliding', span: [0.5, 1], track: 'inner', handle: 'right', extend: [-OV, 0] },
    ],
  },
  c: {
    panels: [
      { type: 'fixed', span: [0, 0.25], track: 'outer', extend: [0, OV] },
      { type: 'sliding', span: [0.25, 0.5], track: 'inner', handle: 'right', extend: [-OV, 0] },
      { type: 'sliding', span: [0.5, 0.75], track: 'inner', handle: 'left', extend: [0, OV] },
      { type: 'fixed', span: [0.75, 1], track: 'outer', extend: [-OV, 0] },
    ],
  },
  d: {
    panels: [
      { type: 'sliding', span: [0, 0.5], track: 'inner', handle: 'left', extend: [0, OV] },
      { type: 'sliding', span: [0.5, 1], track: 'outer', handle: 'right', extend: [-OV, 0] },
    ],
  },
  e: {
    panels: [
      { type: 'sliding', span: [0, 1 / 3], track: 'outer', handle: 'left', extend: [0, OV] },
      { type: 'sliding', span: [1 / 3, 2 / 3], track: 'inner', handle: 'left', extend: [-OV, OV] },
      { type: 'fixed', span: [2 / 3, 1], track: 'outer', extend: [-OV, 0] },
    ],
  },
  f: {
    panels: [
      { type: 'sliding', span: [0, 0.25], track: 'outer', handle: 'left', extend: [0, OV] },
      { type: 'sliding', span: [0.25, 0.5], track: 'inner', handle: 'right', extend: [-OV, 0] },
      { type: 'sliding', span: [0.5, 0.75], track: 'inner', handle: 'left', extend: [0, OV] },
      { type: 'sliding', span: [0.75, 1], track: 'outer', handle: 'right', extend: [-OV, 0] },
    ],
  },
  g2: {
    panels: [
      { type: 'glazing', span: [0, 1 / 3], track: 'outer', extend: [0, -MULLION_TUCK] },
      { type: 'sliding', span: [1 / 3, 2 / 3], track: 'inner', handle: 'left', extend: [MULLION_TUCK, -MULLION_TUCK] },
      { type: 'glazing', span: [2 / 3, 1], track: 'outer', extend: [MULLION_TUCK, 0] },
    ],
    mullions: [1 / 3, 2 / 3],
  },
  g3: {
    panels: [
      { type: 'glazing', span: [0, 1 / 3], track: 'outer', extend: [0, OV] },
      { type: 'sliding', span: [1 / 3, 2 / 3], track: 'inner', handle: 'left', extend: [-OV, OV] },
      { type: 'glazing', span: [2 / 3, 1], track: 'outer', extend: [-OV, 0] },
    ],
  },
  h: {
    panels: [
      { type: 'sliding', span: [0, 1 / 3], track: 'outer', handle: 'left', extend: [0, OV] },
      { type: 'sliding', span: [1 / 3, 2 / 3], track: 'inner', handle: 'left', extend: [-OV, OV] },
      { type: 'sliding', span: [2 / 3, 1], track: 'outer', handle: 'right', extend: [-OV, 0] },
    ],
  },
  k: {
    panels: [
      { type: 'sliding', span: [0, 0.25], track: 'inner', handle: 'left', extend: [0, OV] },
      { type: 'fixed', span: [0.25, 0.75], track: 'outer', extend: [-OV, OV] },
      { type: 'sliding', span: [0.75, 1], track: 'inner', handle: 'right', extend: [-OV, 0] },
    ],
  },
};

const TRACK_Z = {
  inner: PROFILE.trackInnerZ,
  outer: PROFILE.trackOuterZ,
};

// Klamka skrzydła na torze zewnętrznym wystaje do przodu, w płaszczyznę toru
// wewnętrznego. Skrzydła muszą się zatrzymywać, zanim klamka (własna lub
// sąsiada) uderzy w drugie skrzydło: pół płytki klamki + odsadzenie od
// krawędzi skrzydła + luz
const HANDLE_CLEARANCE = 0.085;

// Animacja otwierania: kierunek i dystans przesuwu każdego skrzydła aktywnego
// (indeks = pozycja w panels schematu). Dystanse wyliczone tak, by skrzydło
// kończyło w licu sąsiedniego pola i nie wjeżdżało w ościeżnicę, pola stałe na
// tym samym torze ani w klamki sąsiadów. `conflicts` to pary skrzydeł, które
// otwarte naraz musiałyby się przeniknąć — drugie można otworzyć dopiero po
// zamknięciu pierwszego.
const SCHEME_ANIMATIONS = {
  a: { panels: { 0: { dir: 1, distance: (w) => w / 2 - OV } } },
  a3: { panels: { 1: { dir: -1, distance: (w) => w / 2 - OV } } },
  c: {
    panels: {
      1: { dir: -1, distance: (w) => w / 4 - OV },
      2: { dir: 1, distance: (w) => w / 4 - OV },
    },
  },
  d: {
    // Skrzydła mijają się torami, ale klamka tylnego (zewnętrznego) wystaje w
    // tor przedniego — każde dojeżdża tylko do klamki/krawędzi sąsiada i naraz
    // otwarte może być jedno z nich
    panels: {
      0: { dir: 1, distance: (w) => w / 2 - OV - HANDLE_CLEARANCE },
      1: { dir: -1, distance: (w) => w / 2 - OV - HANDLE_CLEARANCE },
    },
    conflicts: [[0, 1]],
  },
  e: {
    panels: {
      // Lewe (zewnętrzne) zatrzymuje klamkę przed środkowym skrzydłem
      0: { dir: 1, distance: (w) => w / 3 - OV - HANDLE_CLEARANCE },
      1: { dir: 1, distance: (w) => w / 3 - OV },
    },
  },
  f: {
    // Środkowa para rozjeżdża się na boki, skrajne dojeżdżają do środka;
    // wszystkie dystanse skrócone o strefę klamek skrzydeł zewnętrznych,
    // a skrzydła mijające się w parze nie mogą być otwarte naraz
    panels: {
      0: { dir: 1, distance: (w) => w / 4 - OV - HANDLE_CLEARANCE },
      1: { dir: -1, distance: (w) => w / 4 - OV - HANDLE_CLEARANCE },
      2: { dir: 1, distance: (w) => w / 4 - OV - HANDLE_CLEARANCE },
      3: { dir: -1, distance: (w) => w / 4 - OV - HANDLE_CLEARANCE },
    },
    conflicts: [
      [0, 1],
      [2, 3],
    ],
  },
  g2: { panels: { 1: { dir: 1, distance: (w) => w / 3 } } },
  g3: { panels: { 1: { dir: 1, distance: (w) => w / 3 - OV } } },
  h: {
    panels: {
      0: { dir: 1, distance: (w) => w / 3 - OV - HANDLE_CLEARANCE },
      1: { dir: 1, distance: (w) => w / 3 - OV - HANDLE_CLEARANCE },
      2: { dir: -1, distance: (w) => w / 3 - OV - HANDLE_CLEARANCE },
    },
    // Skrajne skrzydła celują w to samo środkowe pole na wspólnym torze, a
    // środkowe przy przesuwie w prawo zmiotłoby klamkę otwartego prawego
    conflicts: [
      [0, 2],
      [1, 2],
    ],
  },
  k: {
    panels: {
      0: { dir: 1, distance: (w) => w / 4 - OV },
      2: { dir: -1, distance: (w) => w / 4 - OV },
    },
  },
};

// Wykończenia klamki: szczotkowane aluminium srebrne / złote F4 — anizotropia
// daje podłużne odbicia szczotkowanego metalu; niepełny metalness, by profil
// nie gasł na tle ciemnych partii otoczenia HDRI
const HANDLE_FINISHES = {
  silver: { color: '#dadde0', roughness: 0.35, metalness: 0.95, anisotropy: 0.65 },
  gold: { color: '#d8b06a', roughness: 0.32, metalness: 0.95, anisotropy: 0.65 },
};

// Funkcja do tworzenia materiału progu
function getThresholdMaterial(thresholdType) {
  let material = {
    roughness: 0.3,
    metalness: 0.8,
    color: '#8c8c8c',
  };

  switch (thresholdType) {
    case 'silver':
      material.color = '#c0c0c0';
      material.roughness = 0.25;
      material.metalness = 0.9;
      break;
    case 'black':
      material.color = '#2a2a2a';
      material.roughness = 0.4;
      material.metalness = 0.7;
      break;
    case 'gold':
      material.color = '#d4af37';
      material.roughness = 0.3;
      material.metalness = 0.85;
      break;
    default:
      break;
  }

  return material;
}

function BoxPart({ position, size, material, castShadow = true, receiveShadow = true }) {
  return (
    <mesh position={position} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={size} />
      {material}
    </mesh>
  );
}

// Szyna jezdna: płaskownik zakończony wałkiem, po którym toczą się wózki.
// Korona wałka wypada dokładnie pod spodem skrzydła przesuwnego (próg + 12 mm),
// niezależnie od wysokości strefy progu, z której szyna wyrasta
function ThresholdRail({ z, width, sectionTop, material }) {
  const crownY = PROFILE.threshold + 0.012 - THRESHOLD.rail.radius;
  return (
    <group>
      <BoxPart
        position={[0, (sectionTop + crownY) / 2, z]}
        size={[width, crownY - sectionTop, THRESHOLD.rail.width]}
        material={material}
      />
      <mesh position={[0, crownY, z]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[THRESHOLD.rail.radius, THRESHOLD.rail.radius, width, 16]} />
        {material}
      </mesh>
    </group>
  );
}

// Niski próg: schodkowy przekrój wg rysunku producenta. Korpus (blok, stopień,
// nos) biegnie przez całą szerokość ościeżnicy — stojaki stoją na nim jak w
// realnym montażu. Elementy funkcyjne (szyny, nakładki) tylko w świetle
// otworu, między stojakami. Szyna toru zewnętrznego pojawia się wyłącznie w
// schematach, w których jeździ po nim skrzydło — przy polach stałych
// zewnętrzna strefa to płaski stopień
function LowThreshold({ bodyWidth, openingWidth, material, outerRail }) {
  const { inner, platform, nose, plate, rail } = THRESHOLD;
  const plateGap = rail.width / 2 + 0.005; // odstęp nakładek od osi szyny
  return (
    <group>
      <BoxPart
        position={[0, inner.height / 2, (inner.zFrom + inner.zTo) / 2]}
        size={[bodyWidth, inner.height, inner.zTo - inner.zFrom]}
        material={material}
      />
      {/* Nakładki maskujące po obu stronach szyny — segmentowana góra profilu */}
      <BoxPart
        position={[0, inner.height + plate / 2, (PROFILE.trackInnerZ + plateGap + inner.zTo) / 2]}
        size={[openingWidth, plate, inner.zTo - PROFILE.trackInnerZ - plateGap]}
        material={material}
      />
      <BoxPart
        position={[0, inner.height + plate / 2, (inner.zFrom + PROFILE.trackInnerZ - plateGap) / 2]}
        size={[openingWidth, plate, PROFILE.trackInnerZ - plateGap - inner.zFrom]}
        material={material}
      />
      <ThresholdRail
        z={PROFILE.trackInnerZ}
        width={openingWidth}
        sectionTop={inner.height}
        material={material}
      />
      {/* Stopień pod pole stałe / tor zewnętrzny */}
      <BoxPart
        position={[0, platform.height / 2, (platform.zFrom + platform.zTo) / 2]}
        size={[bodyWidth, platform.height, platform.zTo - platform.zFrom]}
        material={material}
      />
      {outerRail && (
        <ThresholdRail
          z={PROFILE.trackOuterZ}
          width={openingWidth}
          sectionTop={platform.height}
          material={material}
        />
      )}
      {/* Nos okapowy przed licem ościeżnicy */}
      <BoxPart
        position={[0, nose.height / 2, (nose.zFrom + nose.zTo) / 2]}
        size={[bodyWidth, nose.height, nose.zTo - nose.zFrom]}
        material={material}
      />
    </group>
  );
}

// Owinięcie boków profilu plakietami na obwodzie ramy, przez całą głębokość
// (1 mm przed licem wewnętrznym, żeby uniknąć z-fightingu z drewnem). Boki
// skrzydeł widać z OBU stron przez szczelinę zakładu, więc owinięcie jest
// dwusegmentowe: od lica zewnętrznego do połowy profilu w kolorze nakładki
// alu, dalej w ciemnym kolorze uszczelki (w realnym okuciu w tej strefie
// siedzą uszczelki szczotkowe) — od zewnątrz nie świeci drewno, a od wewnątrz
// nie razi kolor aluminium
function AluSideWrap({ xLeft, xRight, bottom, top, z, depth, material, innerMaterial }) {
  const outerDepth = depth / 2 + ALU.depth;
  const innerDepth = depth / 2 - 0.001;
  const cx = (xLeft + xRight) / 2;
  const cy = (bottom + top) / 2;
  const width = xRight - xLeft;
  const height = top - bottom;
  const segments = [
    { key: 'outer', zPos: z - depth / 2 - ALU.depth + outerDepth / 2, zDepth: outerDepth, mat: material },
    { key: 'inner', zPos: z + innerDepth / 2, zDepth: innerDepth, mat: innerMaterial ?? material },
  ];
  return (
    <group>
      {segments.map(({ key, zPos, zDepth, mat }) => (
        <group key={key}>
          <BoxPart position={[xLeft - ALU.side / 2, cy, zPos]} size={[ALU.side, height, zDepth]} material={mat} />
          <BoxPart position={[xRight + ALU.side / 2, cy, zPos]} size={[ALU.side, height, zDepth]} material={mat} />
          <BoxPart
            position={[cx, top + ALU.side / 2, zPos]}
            size={[width + ALU.side * 2, ALU.side, zDepth]}
            material={mat}
          />
          <BoxPart
            position={[cx, bottom - ALU.side / 2, zPos]}
            size={[width + ALU.side * 2, ALU.side, zDepth]}
            material={mat}
          />
        </group>
      ))}
    </group>
  );
}

// Listwa przyszybowa wg przekroju producenta: zaokrąglony profil (ćwierćwałek
// z krótkimi przylgami) docięty na końcach pod 45°, by w narożach schodził się
// na ucios jak w stolarce
const BEAD = { width: PROFILE.bead, depth: 0.022, land: 0.005 };

function createBeadGeometry(length) {
  const { width: B, depth: D, land } = BEAD;

  // Przekrój w (u, v): u=0 przy ramie skrzydła, u=B przy szybie; v wzdłuż osi Z
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(B, 0);
  shape.lineTo(B, land);
  shape.quadraticCurveTo(B, D, land, D);
  shape.lineTo(0, D);
  shape.closePath();

  const geo = new ExtrudeGeometry(shape, {
    depth: length,
    steps: 1,
    bevelEnabled: false,
    curveSegments: 10,
  });

  // Ucios 45°: krawędź zewnętrzna (u=0) zachowuje pełną długość, krawędź przy
  // szybie jest krótsza o szerokość listwy z każdej strony. Przy steps=1
  // wszystkie wierzchołki leżą na końcach, więc wystarczy je ściąć w płaszczyźnie
  // szyby. Słoje (UV) biegną wzdłuż listwy.
  const pos = geo.attributes.position;
  const uvAttr = geo.attributes.uv;
  for (let i = 0; i < pos.count; i += 1) {
    const u = pos.getX(i);
    const z = pos.getZ(i) < length / 2 ? u : length - u;
    pos.setZ(i, z);
    uvAttr.setXY(i, z / length, u / B);
  }
  geo.computeVertexNormals();
  geo.translate(0, -D / 2, -length / 2);
  return geo;
}

// Orientacje czterech listew ringu: oś u (głębokość profilu) zawsze do środka
// otworu, oś v (zaokrąglenie) na +Z, długość wzdłuż boku
const BEAD_ORIENTATIONS = {
  bottom: new Matrix4().makeBasis(new Vector3(0, 1, 0), new Vector3(0, 0, 1), new Vector3(1, 0, 0)),
  top: new Matrix4().makeBasis(new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(-1, 0, 0)),
  left: new Matrix4().makeBasis(new Vector3(1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, -1, 0)),
  right: new Matrix4().makeBasis(new Vector3(-1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 1, 0)),
};

function MiteredBeadRing({ cx, cy, z, width, height, material, flip = false }) {
  const geometries = useMemo(
    () => ({
      bottom: createBeadGeometry(width).applyMatrix4(BEAD_ORIENTATIONS.bottom),
      top: createBeadGeometry(width).applyMatrix4(BEAD_ORIENTATIONS.top),
      left: createBeadGeometry(height).applyMatrix4(BEAD_ORIENTATIONS.left),
      right: createBeadGeometry(height).applyMatrix4(BEAD_ORIENTATIONS.right),
    }),
    [width, height]
  );

  useEffect(
    () => () => {
      Object.values(geometries).forEach((geometry) => geometry.dispose());
    },
    [geometries]
  );

  return (
    <group position={[cx, cy, z]} rotation={flip ? [0, Math.PI, 0] : [0, 0, 0]}>
      <mesh geometry={geometries.bottom} position={[0, -height / 2, 0]} castShadow receiveShadow>
        {material}
      </mesh>
      <mesh geometry={geometries.top} position={[0, height / 2, 0]} castShadow receiveShadow>
        {material}
      </mesh>
      <mesh geometry={geometries.left} position={[-width / 2, 0, 0]} castShadow receiveShadow>
        {material}
      </mesh>
      <mesh geometry={geometries.right} position={[width / 2, 0, 0]} castShadow receiveShadow>
        {material}
      </mesh>
    </group>
  );
}

// Prostokątna rama z czterech belek (pionowe słoje na stojakach, poziome na ryglach)
function FrameRing({ cx, cy, z, width, height, profile, depth, materialV, materialH }) {
  const railWidth = Math.max(width - profile * 2, 0.01);

  return (
    <group>
      <BoxPart
        position={[cx - width / 2 + profile / 2, cy, z]}
        size={[profile, height, depth]}
        material={materialV}
      />
      <BoxPart
        position={[cx + width / 2 - profile / 2, cy, z]}
        size={[profile, height, depth]}
        material={materialV}
      />
      <BoxPart
        position={[cx, cy + height / 2 - profile / 2, z]}
        size={[railWidth, profile, depth]}
        material={materialH}
      />
      <BoxPart
        position={[cx, cy - height / 2 + profile / 2, z]}
        size={[railWidth, profile, depth]}
        material={materialH}
      />
    </group>
  );
}

// Klamka HS wg rysunku: płytka 57 x 143,5, dźwignia ~312 mm w górę,
// odsadzenie uchwytu 61 mm od powierzchni skrzydła. Szyjka i dźwignia siedzą
// w grupie obracanej wokół osi trzpienia (animacja otwierania)
function PullHandle({ position, material, leverRef }) {
  return (
    <group position={position}>
      {/* płytka montażowa */}
      <BoxPart position={[0, 0, 0.006]} size={[0.057, 0.1435, 0.012]} material={material} />
      {/* trzpień obrotowy */}
      <BoxPart position={[0, -0.03, 0.025]} size={[0.034, 0.036, 0.026]} material={material} />
      {/* userData pozwala eksportowi AR znaleźć i wyzerować obrót dźwigni na klonie */}
      <group ref={leverRef} position={[0, -0.03, 0]} userData={{ hsLever: true }}>
        {/* szyjka łącząca trzpień z dźwignią */}
        <BoxPart position={[0, 0, 0.05]} size={[0.028, 0.045, 0.024]} material={material} />
        {/* dźwignia pionowa (płaskownik) */}
        <BoxPart position={[0, 0.128, 0.061]} size={[0.025, 0.3, 0.019]} material={material} />
      </group>
    </group>
  );
}

// Animacja unoszono-przesuwna (Hebe-Schiebe): obrót klamki 180° napędza
// mechanizm unoszący, więc skrzydło podnosi się W TRAKCIE obrotu klamki
// (unoszenie startuje ułamek później — początek ruchu klamki kasuje luz
// okucia), a dopiero po pełnym obrocie jedzie w bok. Zamykanie to ta sama oś
// czasu odtwarzana wstecz — skrzydło dosuwa się, po czym opada na uszczelki
// równolegle z powrotem klamki
const SASH_ANIMATION = { duration: 2.6, lift: 0.006, phases: { handle: [0, 0.3], lift: [0.06, 0.3], slide: [0.35, 1] } };

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const phaseProgress = (p, [start, end]) => Math.min(Math.max((p - start) / (end - start), 0), 1);

function GlazedPanel({
  panel,
  panelIndex,
  openingWidth,
  openingBottom,
  openingTop,
  materials,
  aluMaterial = null,
  animatable = false,
  slideDirection = 1,
  slideDistance = 0,
  open = false,
  onToggle,
}) {
  const isSliding = panel.type === 'sliding';
  const isGlazing = panel.type === 'glazing';
  const profile = isGlazing ? GLAZING.profile : isSliding ? PROFILE.sash : PROFILE.fixed;
  const depth = isGlazing ? GLAZING.depth : isSliding ? PROFILE.sashDepth : PROFILE.fixedDepth;
  const z = isGlazing ? GLAZING.z : TRACK_Z[panel.track] ?? PROFILE.trackOuterZ;

  const xLeft = -openingWidth / 2 + panel.span[0] * openingWidth + panel.extend[0];
  const xRight = -openingWidth / 2 + panel.span[1] * openingWidth + panel.extend[1];
  const cx = (xLeft + xRight) / 2;
  const panelWidth = xRight - xLeft;

  // Skrzydło przesuwne jedzie po szynie progu, pole stałe schodzi niżej — na
  // zewnętrzny stopień progu; od góry pole stałe domyka listwa maskująca 19 x 115
  const bottom = isSliding ? openingBottom + 0.012 : THRESHOLD.platform.height;
  const top = openingTop - (isSliding ? 0.004 : isGlazing ? 0 : PROFILE.filler.height);
  const cy = (bottom + top) / 2;
  const panelHeight = top - bottom;

  const openW = Math.max(panelWidth - profile * 2, 0.05);
  const openH = Math.max(panelHeight - profile * 2, 0.05);
  const glassInset = isGlazing ? 0 : PROFILE.bead;
  const glassW = Math.max(openW - glassInset * 2 + 0.01, 0.04);
  const glassH = Math.max(openH - glassInset * 2 + 0.01, 0.04);

  const handleX = panel.handle === 'left' ? xLeft + profile / 2 : xRight - profile / 2;
  const handleY = Math.min(bottom + 1.0, cy);

  // Animacja otwierania (tylko skrzydła oznaczone jako animatable)
  const sashRef = useRef();
  const leverRef = useRef();
  const progressRef = useRef(0);
  const { gl } = useThree();

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      // Obrót modelu (OrbitControls) kończy się pointerupem nad skrzydłem —
      // odróżniamy go od kliknięcia po dystansie kursora między down a up
      if (event.delta > 4) return;
      onToggle?.(panelIndex);
    },
    [onToggle, panelIndex]
  );
  const handlePointerOver = useCallback(
    (event) => {
      event.stopPropagation();
      gl.domElement.style.cursor = 'pointer';
    },
    [gl]
  );
  const handlePointerOut = useCallback(() => {
    gl.domElement.style.cursor = '';
  }, [gl]);

  useFrame((_, delta) => {
    if (!animatable || !sashRef.current) return;
    const target = open ? 1 : 0;
    const previous = progressRef.current;
    if (previous === target) return;

    const step = delta / SASH_ANIMATION.duration;
    const p = previous < target ? Math.min(previous + step, target) : Math.max(previous - step, target);
    progressRef.current = p;

    if (leverRef.current) {
      // Dźwignia przechodzi przez stronę zgodną z kierunkiem otwierania skrzydła
      leverRef.current.rotation.z =
        -slideDirection * Math.PI * easeInOut(phaseProgress(p, SASH_ANIMATION.phases.handle));
    }
    sashRef.current.position.y = SASH_ANIMATION.lift * easeInOut(phaseProgress(p, SASH_ANIMATION.phases.lift));
    sashRef.current.position.x =
      slideDirection * slideDistance * easeInOut(phaseProgress(p, SASH_ANIMATION.phases.slide));
  });

  const groupProps = animatable
    ? {
        ref: sashRef,
        onClick: handleClick,
        onPointerOver: handlePointerOver,
        onPointerOut: handlePointerOut,
        // Tag dla eksportu AR — pozwala wyzerować przesuw/uniesienie skrzydła na klonie
        userData: { hsSash: true },
      }
    : {};

  return (
    <group {...groupProps}>
      <FrameRing
        cx={cx}
        cy={cy}
        z={z}
        width={panelWidth}
        height={panelHeight}
        profile={profile}
        depth={depth}
        materialV={materials.woodV}
        materialH={materials.woodH}
      />
      {/* Nakładka aluminiowa na licu zewnętrznym ramy (wariant drewno-alu) —
          renderowana w grupie skrzydła, więc jeździ razem z nim; plakiety
          owijają boki profilu, żeby środkowe słupki w strefie zakładu nie
          świeciły drewnem od zewnątrz */}
      {aluMaterial && (
        <>
          <FrameRing
            cx={cx}
            cy={cy}
            z={z - depth / 2 - ALU.depth / 2}
            width={panelWidth}
            height={panelHeight}
            profile={profile}
            depth={ALU.depth}
            materialV={aluMaterial}
            materialH={aluMaterial}
          />
          <AluSideWrap
            xLeft={xLeft}
            xRight={xRight}
            bottom={bottom}
            top={top}
            z={z}
            depth={depth}
            material={aluMaterial}
            innerMaterial={materials.gasket}
          />
        </>
      )}
      {/* Listwy przyszybowe po obu stronach pakietu (przy szkleniu w ościeżnicy
          rolę listew pełni główna rama panelu). UV listew biegnie wzdłuż sztuki,
          więc wszystkie używają nieobróconej tekstury drewna; w wariancie
          drewno-alu listwa zewnętrzna jest aluminiowa */}
      {!isGlazing && (
        <>
          <MiteredBeadRing
            cx={cx}
            cy={cy}
            z={z + depth / 2 - 0.011}
            width={openW + 0.008}
            height={openH + 0.008}
            material={materials.woodH}
          />
          <MiteredBeadRing
            cx={cx}
            cy={cy}
            z={z - depth / 2 + 0.011}
            width={openW + 0.008}
            height={openH + 0.008}
            material={aluMaterial ?? materials.woodH}
            flip
          />
        </>
      )}
      {/* Uszczelka wokół szyby */}
      <FrameRing
        cx={cx}
        cy={cy}
        z={z}
        width={glassW + PROFILE.gasket * 2 - 0.002}
        height={glassH + PROFILE.gasket * 2 - 0.002}
        profile={PROFILE.gasket}
        depth={0.042}
        materialV={materials.gasket}
        materialH={materials.gasket}
      />
      {/* Pakiet szybowy */}
      <BoxPart
        position={[cx, cy, z]}
        size={[glassW, glassH, 0.036]}
        material={materials.glass}
        castShadow={false}
        receiveShadow={false}
      />
      {/* Listwa maskująca nad polem stałym — renderowana w licu skrzydła
          (pełna głębokość 115 mm wystawałaby poza profil i psuła bryłę) */}
      {!isSliding && !isGlazing && (
        <>
          <BoxPart
            position={[cx, top + PROFILE.filler.height / 2, z]}
            size={[panelWidth, PROFILE.filler.height, depth]}
            material={materials.woodH}
          />
          {aluMaterial && (
            <>
              <BoxPart
                position={[cx, top + PROFILE.filler.height / 2, z - depth / 2 - ALU.depth / 2]}
                size={[panelWidth, PROFILE.filler.height, ALU.depth]}
                material={aluMaterial}
              />
              {/* Zaślepki czołowe listwy maskującej — końce w strefie zakładu
                  widać od zewnątrz (segment alu) i przez szczelinę od wewnątrz
                  (segment w kolorze uszczelki, jak owinięcia boków skrzydeł) */}
              {[-1, 1].map((side) => (
                <group key={`filler-end-${side}`}>
                  <BoxPart
                    position={[
                      cx + side * (panelWidth / 2 + ALU.side / 2),
                      top + PROFILE.filler.height / 2,
                      z - depth / 2 - ALU.depth + (depth / 2 + ALU.depth) / 2,
                    ]}
                    size={[ALU.side, PROFILE.filler.height, depth / 2 + ALU.depth]}
                    material={aluMaterial}
                  />
                  <BoxPart
                    position={[
                      cx + side * (panelWidth / 2 + ALU.side / 2),
                      top + PROFILE.filler.height / 2,
                      z + (depth / 2 - 0.001) / 2,
                    ]}
                    size={[ALU.side, PROFILE.filler.height, depth / 2 - 0.001]}
                    material={materials.gasket}
                  />
                </group>
              ))}
            </>
          )}
        </>
      )}
      {isSliding && (
        <PullHandle
          position={[handleX, handleY, z + depth / 2]}
          material={materials.handle}
          leverRef={animatable ? leverRef : undefined}
        />
      )}
    </group>
  );
}

function ProceduralHsModel({
  scheme,
  woodFinish,
  handleFinish,
  thresholdType,
  materialType,
  aluColor,
  width,
  height,
  onReady,
  exportRef,
  ...props
}) {
  const isWoodAlu = materialType === 'woodAlu';
  const isRalWood = woodFinish?.type === 'ral';
  const grainPath = woodFinish?.grainPath ?? FALLBACK_GRAIN;
  const grainTexture = useTexture(grainPath);
  const schemeDef = SCHEME_DEFINITIONS[scheme] ?? SCHEME_DEFINITIONS.a;
  const panels = schemeDef.panels;
  const mullions = schemeDef.mullions ?? [];
  const animationSpec = SCHEME_ANIMATIONS[scheme] ?? SCHEME_ANIMATIONS.a;
  // Tylne skrzydła przesuwne (schematy D/E/F/H) potrzebują szyny na torze
  // zewnętrznym; przy polach stałych zewnętrzna strefa progu zostaje płaska
  const hasOuterSliding = panels.some((panel) => panel.type === 'sliding' && panel.track === 'outer');

  // Stan otwarcia skrzydeł trzymany na poziomie modelu, bo skrzydła z par
  // kolizyjnych muszą znać stan sąsiada
  const [openPanels, setOpenPanels] = useState({});

  useEffect(() => {
    setOpenPanels({});
  }, [scheme, width, height]);

  const togglePanel = useCallback(
    (index) => {
      setOpenPanels((prev) => {
        const willOpen = !prev[index];
        if (willOpen) {
          const blocked = (animationSpec.conflicts ?? []).some(
            (pair) => pair.includes(index) && pair.some((other) => other !== index && prev[other])
          );
          // Skrzydło kolizyjne: najpierw trzeba zamknąć drugie z pary
          if (blocked) return prev;
        }
        return { ...prev, [index]: willOpen };
      });
    },
    [animationSpec]
  );

  const modelWidth = width / 1000;
  const modelHeight = height / 1000;
  const openingWidth = modelWidth - PROFILE.frame * 2;
  const openingBottom = PROFILE.threshold;
  const openingTop = modelHeight - PROFILE.frame;

  // Konfiguracja tekstur — słoje drewna wzdłuż elementu (pion/poziom).
  // Ta sama mapa słojów gatunku służy jako mapa koloru (sRGB, tintowana
  // material.color) i jako mapa reliefu (liniowa)
  const textures = useMemo(() => {
    const setup = (rotate, colorSpace) => {
      const tex = grainTexture.clone();
      tex.wrapS = RepeatWrapping;
      tex.wrapT = RepeatWrapping;
      tex.colorSpace = colorSpace;
      tex.anisotropy = 16;
      tex.minFilter = LinearMipMapLinearFilter;
      tex.magFilter = LinearFilter;
      if (rotate) {
        tex.center.set(0.5, 0.5);
        tex.rotation = Math.PI / 2;
      }
      tex.needsUpdate = true;
      return tex;
    };

    return {
      woodV: setup(true, SRGBColorSpace),
      woodH: setup(false, SRGBColorSpace),
      grainV: setup(true, NoColorSpace),
      grainH: setup(false, NoColorSpace),
    };
  }, [grainTexture]);

  const materials = useMemo(() => {
    const thresholdMat = getThresholdMaterial(thresholdType);
    const handleMat = HANDLE_FINISHES[handleFinish] ?? HANDLE_FINISHES.silver;

    // RAL = lakier KRYJĄCY: jednolity kolor zakrywający słoje. Na sośnie i dębie
    // gładko (bez rysunku); meranti ma otwarte pory, więc przez lakier prześwituje
    // delikatny relief — tylko subtelny bump, bez mapy koloru.
    // Lazur = przezroczysta bejca: słoje widać kolorem (map × color, jak idealne
    // swatche w UI). Relief celowo MINIMALNY — mocny bump robił sztuczne,
    // „wytłaczane" wrażenie; naturalne drewno stolarki jest niemal gładkie.
    // Mapa słojów ma niski kontrast (delikatne, kolorowe linie w albedo).
    // Głębię daje bump — z low-kontrast mapy gradienty są łagodne, więc nawet
    // wyższy bumpScale czyta się jako miękki relief, nie „wytłaczanie".
    // Meranti i dąb dostają głębszy relief (otwartoporowe — pod światłem słoje
    // bardziej grają); sosna pozostaje gładsza.
    const isMeranti = woodFinish?.species === 'meranti';
    const lazurBump = isMeranti ? 1.1 : woodFinish?.species === 'oak' ? 0.95 : 0.6;
    const makeWood = (tex, grain) =>
      isRalWood ? (
        // RAL = lakier kryjący: jednolity kolor; sosna/dąb gładko, meranti ma
        // otwarte pory → delikatny relief przez lakier
        <meshStandardMaterial
          color={woodFinish.hex}
          bumpMap={isMeranti ? grain : null}
          bumpScale={isMeranti ? 0.5 : 0}
          roughness={0.55}
          metalness={0.02}
        />
      ) : (
        <meshStandardMaterial
          map={tex}
          bumpMap={grain}
          bumpScale={lazurBump}
          color={woodFinish?.hex ?? '#ffffff'}
          roughness={0.5}
          metalness={0.02}
        />
      );

    return {
      woodV: makeWood(textures.woodV, textures.grainV),
      woodH: makeWood(textures.woodH, textures.grainH),
      glass: (
        <meshPhysicalMaterial
          color="#eef6f4"
          roughness={0.04}
          metalness={0}
          transmission={0.85}
          thickness={0.02}
          ior={1.52}
          envMapIntensity={1.5}
        />
      ),
      handle: (
        <meshPhysicalMaterial
          color={handleMat.color}
          roughness={handleMat.roughness}
          metalness={handleMat.metalness}
          anisotropy={handleMat.anisotropy}
          envMapIntensity={1.3}
        />
      ),
      threshold: (
        <meshPhysicalMaterial
          color={thresholdMat.color}
          roughness={thresholdMat.roughness}
          metalness={thresholdMat.metalness}
          anisotropy={0.5}
          envMapIntensity={1.2}
        />
      ),
      gasket: <meshStandardMaterial color="#1c1e1c" roughness={0.85} metalness={0.05} />,
      // Lakier proszkowy nakładek alu: matowy, lekko metaliczny — bez anizotropii,
      // żeby płaskie lica czytały się jako jednolite płaszczyzny (Gemini Quadrat)
      alu: (
        <meshStandardMaterial
          color={ALU_HEX[aluColor] ?? ALU_HEX[DEFAULT_ALU_COLOR]}
          roughness={0.55}
          metalness={0.3}
          envMapIntensity={1.0}
        />
      ),
    };
  }, [textures, thresholdType, handleFinish, aluColor, isRalWood, woodFinish]);

  const aluMaterial = isWoodAlu ? materials.alu : null;

  useEffect(() => {
    onReady?.();
  }, [aluColor, handleFinish, height, materialType, onReady, scheme, thresholdType, textures, width, woodFinish]);

  return (
    // exportRef wskazuje samą grupę modelu (bez Center/świateł/ContactShadows) —
    // eksport AR klonuje ją bez elementów pomocniczych sceny
    <group ref={exportRef} {...props} position={[0, -modelHeight / 2, 0]}>
      {/* Ościeżnica: stojaki stoją na progu (próg biegnie pod nimi przez całą
          szerokość); od strony zewnętrznej stopka stojaka jest docięta do
          niższego stopnia progu, żeby nie wisiał nad nim w powietrzu */}
      {[-1, 1].map((side) => (
        <group key={`jamb-${side}`}>
          <BoxPart
            position={[
              side * (modelWidth / 2 - PROFILE.frame / 2),
              PROFILE.threshold + (modelHeight - PROFILE.threshold) / 2,
              0,
            ]}
            size={[PROFILE.frame, modelHeight - PROFILE.threshold, PROFILE.frameDepth]}
            material={materials.woodV}
          />
          <BoxPart
            position={[
              side * (modelWidth / 2 - PROFILE.frame / 2),
              (THRESHOLD.platform.height + PROFILE.threshold) / 2,
              (THRESHOLD.platform.zFrom + THRESHOLD.platform.zTo) / 2,
            ]}
            size={[
              PROFILE.frame,
              PROFILE.threshold - THRESHOLD.platform.height,
              THRESHOLD.platform.zTo - THRESHOLD.platform.zFrom,
            ]}
            material={materials.woodV}
          />
          {/* Nakładka alu na licu zewnętrznym stojaka (do stopnia progu, żeby
              stopka nie świeciła drewnem nad nosem okapowym) + plakieta na
              wnęce (reveal) stojaka — od zewnątrz do płaszczyzny skrzydła
              przesuwnego; głębiej wnęka zostaje drewniana, bo widać ją tylko
              od wewnątrz */}
          {aluMaterial && (
            <>
              <BoxPart
                position={[
                  side * (modelWidth / 2 - PROFILE.frame / 2),
                  THRESHOLD.platform.height + (modelHeight - THRESHOLD.platform.height) / 2,
                  -PROFILE.frameDepth / 2 - ALU.depth / 2,
                ]}
                size={[PROFILE.frame, modelHeight - THRESHOLD.platform.height, ALU.depth]}
                material={aluMaterial}
              />
              <BoxPart
                position={[
                  side * (modelWidth / 2 - PROFILE.frame) - side * (ALU.side / 2),
                  PROFILE.threshold + (openingTop - PROFILE.threshold) / 2,
                  (-PROFILE.frameDepth / 2 - ALU.depth) / 2,
                ]}
                size={[ALU.side, openingTop - PROFILE.threshold, PROFILE.frameDepth / 2 + ALU.depth]}
                material={aluMaterial}
              />
            </>
          )}
        </group>
      ))}
      <BoxPart
        position={[0, modelHeight - PROFILE.frame / 2, 0]}
        size={[openingWidth, PROFILE.frame, PROFILE.frameDepth]}
        material={materials.woodH}
      />
      {aluMaterial && (
        <>
          <BoxPart
            position={[0, modelHeight - PROFILE.frame / 2, -PROFILE.frameDepth / 2 - ALU.depth / 2]}
            size={[openingWidth, PROFILE.frame, ALU.depth]}
            material={aluMaterial}
          />
          {/* Plakieta na wnęce nadproża — analogicznie do wnęk stojaków */}
          <BoxPart
            position={[0, openingTop - ALU.side / 2, (-PROFILE.frameDepth / 2 - ALU.depth) / 2]}
            size={[openingWidth, ALU.side, PROFILE.frameDepth / 2 + ALU.depth]}
            material={aluMaterial}
          />
        </>
      )}

      {/* Niski próg aluminiowy o schodkowym przekroju, pod całą ościeżnicą */}
      <LowThreshold
        bodyWidth={modelWidth}
        openingWidth={openingWidth}
        material={materials.threshold}
        outerRail={hasOuterSliding}
      />

      {/* Słupki statyczne (np. schemat G2) — siedzą na zewnętrznym stopniu progu */}
      {mullions.map((fraction, index) => (
        <group key={`mullion-${scheme}-${index}`}>
          <BoxPart
            position={[
              -openingWidth / 2 + fraction * openingWidth,
              THRESHOLD.platform.height + (openingTop - THRESHOLD.platform.height) / 2,
              MULLION.z,
            ]}
            size={[MULLION.width, openingTop - THRESHOLD.platform.height, MULLION.depth]}
            material={materials.woodV}
          />
          {aluMaterial && (
            <>
              <BoxPart
                position={[
                  -openingWidth / 2 + fraction * openingWidth,
                  THRESHOLD.platform.height + (openingTop - THRESHOLD.platform.height) / 2,
                  MULLION.z - MULLION.depth / 2 - ALU.depth / 2,
                ]}
                size={[MULLION.width, openingTop - THRESHOLD.platform.height, ALU.depth]}
                material={aluMaterial}
              />
              <AluSideWrap
                xLeft={-openingWidth / 2 + fraction * openingWidth - MULLION.width / 2}
                xRight={-openingWidth / 2 + fraction * openingWidth + MULLION.width / 2}
                bottom={THRESHOLD.platform.height}
                top={openingTop}
                z={MULLION.z}
                depth={MULLION.depth}
                material={aluMaterial}
                innerMaterial={materials.gasket}
              />
            </>
          )}
        </group>
      ))}

      {panels.map((panel, index) => {
        const panelAnimation = panel.type === 'sliding' ? animationSpec.panels?.[index] : undefined;
        return (
          <GlazedPanel
            // Wymiary w kluczu resetują transformacje przy zmianie schematu/rozmiaru
            key={`${scheme}-${width}-${height}-${index}-${panel.type}`}
            panel={panel}
            panelIndex={index}
            openingWidth={openingWidth}
            openingBottom={openingBottom}
            openingTop={openingTop}
            materials={materials}
            aluMaterial={aluMaterial}
            animatable={Boolean(panelAnimation)}
            slideDirection={panelAnimation?.dir ?? 1}
            slideDistance={panelAnimation ? panelAnimation.distance(openingWidth) : 0}
            open={Boolean(openPanels[index])}
            onToggle={togglePanel}
          />
        );
      })}
    </group>
  );
}

function FrontFit({ modelRef, width, height, scheme }) {
  const controls = useThree((state) => state.controls);
  const { camera } = useThree();
  const lastFittedDimensions = useRef(null);

  useEffect(() => {
    if (!modelRef?.current) return;

    const dimensionsKey = `${scheme}-${width}x${height}`;
    if (lastFittedDimensions.current === dimensionsKey) return;

    const box = new Box3().setFromObject(modelRef.current);
    const minOk = Number.isFinite(box.min.x) && Number.isFinite(box.min.y) && Number.isFinite(box.min.z);
    const maxOk = Number.isFinite(box.max.x) && Number.isFinite(box.max.y) && Number.isFinite(box.max.z);
    if (!minOk || !maxOk) return;

    const center = box.getCenter(new Vector3());
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);

    const boxSize = new Vector3();
    box.getSize(boxSize);
    let radius =
      Number.isFinite(sphere.radius) && sphere.radius > 0
        ? sphere.radius
        : Math.max(boxSize.x, boxSize.y, boxSize.z) / 2 || 1;

    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const distV = radius / Math.tan(vFov / 2);
    const distH = radius / Math.tan(hFov / 2);
    let dist = Math.max(distV, distH) * 1.05;
    if (!Number.isFinite(dist) || dist <= 0) dist = radius * 3;

    camera.near = Math.min(camera.near || 0.1, Math.max(0.01, dist / 100));
    camera.far = Math.max(camera.far || 1000, dist * 10);
    camera.updateProjectionMatrix();

    camera.position.set(center.x, center.y + radius * 0.1, center.z + dist);

    if (controls) {
      controls.target.set(center.x, center.y, center.z);
      controls.update?.();
    } else {
      camera.lookAt(center);
    }

    lastFittedDimensions.current = dimensionsKey;
  }, [modelRef, camera, controls, width, height, scheme]);

  return null;
}

export default function HsConfiguratorCanvas({
  selectedType = 'a',
  selectedWoodFinish,
  selectedHandleFinish,
  selectedThreshold,
  selectedMaterialType = 'wood',
  selectedAluColor = DEFAULT_ALU_COLOR,
  width,
  height,
  onReady,
  exportRef,
}) {
  const modelRef = useRef();

  return (
    <Canvas
      shadows
      camera={{ position: [3, 2, 4], fov: 45 }}
      gl={{
        logarithmicDepthBuffer: true,
        antialias: true,
        toneMapping: NeutralToneMapping,
        toneMappingExposure: 1.0,
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#fffefe']} />
        {/* Ambient rozjaśnia powierzchnie rozproszone (drewno); metale (metalness
            ~0.95) prawie go nie odbierają, więc nie przepala klamki ani progu */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[5, 6, 9]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-camera-left={-3.5}
          shadow-camera-right={3.5}
          shadow-camera-top={3.5}
          shadow-camera-bottom={-3.5}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
        />
        <directionalLight position={[-5, 3, -8]} intensity={0.45} />
        <Environment preset="city" />
        <OrbitControls makeDefault enablePan enableZoom enableRotate />
        <Center>
          <group ref={modelRef}>
            <ProceduralHsModel
              scheme={selectedType}
              woodFinish={selectedWoodFinish}
              handleFinish={selectedHandleFinish}
              thresholdType={selectedThreshold}
              materialType={selectedMaterialType}
              aluColor={selectedAluColor}
              width={width}
              height={height}
              onReady={onReady}
              exportRef={exportRef}
            />
          </group>
        </Center>
        <FrontFit modelRef={modelRef} width={width} height={height} scheme={selectedType} />
        {/* Cień przyziemny pod modelem — model jest wyśrodkowany, więc podłoga leży na -h/2 */}
        <ContactShadows
          position={[0, -height / 2000 - 0.002, 0]}
          opacity={0.35}
          blur={2.5}
          far={10}
          resolution={256}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
