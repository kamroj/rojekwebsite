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
  CanvasTexture,
  ExtrudeGeometry,
  LinearFilter,
  LinearMipMapLinearFilter,
  LinearToneMapping,
  Matrix4,
  MirroredRepeatWrapping,
  NoColorSpace,
  Shape,
  Sphere,
  SRGBColorSpace,
  Vector3,
} from 'three';

import { ALU_COLORS, DEFAULT_ALU_COLOR, PLINTH_RANGE } from './hsOptions.js';
import { createHandleLeverGeometry, createHandlePlateGeometry } from './hsHandleGeometry.js';

// Awaryjna mapa słojów (gdy resolver nie dostarczy ścieżek) — sosna
const FALLBACK_GRAIN = '/models/lazur/grain-pine.jpg';

// Telefony/tablety: mapy słojów lądują na GPU w 4 kopiach (kolor/relief ×
// pion/poziom) — przy plikach 1254²+ to było ~32 MB tekstur i, co gorsze,
// wymiary NIEbędące potęgą dwójki, dla których mobilne sterowniki generują
// mipmapy awaryjną, wolną ścieżką (pojedyncze wywołanie GL na sekundy →
// watchdog Androida ubija kontekst WebGL). iPadOS udaje desktopowego Safari,
// stąd oprócz user agenta warunek coarse pointer + dotyk
const detectLowPowerDevice = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) return true;
  const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  return coarsePointer && (navigator.maxTouchPoints ?? 0) > 1;
};

// Rozmiar map słojów na mobile: 512 = potęga dwójki (szybka ścieżka mipmap),
// a na ekranie telefonu belka profilu ma kilkadziesiąt px — różnicy nie widać
const MOBILE_GRAIN_SIZE = 512;

const downscaleToSquarePot = (image, size) => {
  if (!image || (image.width <= size && image.height <= size)) return image;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  canvas.getContext('2d').drawImage(image, 0, 0, size, size);
  return canvas;
};

// Diagnostyka na urządzeniu (adres z ?debug3d=1): overlay wypisuje wykryty
// profil, GPU i zdarzenia kontekstu/błędy wprost na ekranie — jedyny sposób,
// by zobaczyć co dzieje się na telefonie bez podpinania go do inspektora
const isDebug3dEnabled = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug3d');

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
// `extraDepth` (schemat E) pogłębia ościeżnicę i próg o dodatkowy tor —
// E wg rysunku producenta jest trzytorowe: skrzydła kaskadowo od wnętrza,
// pole stałe na najbardziej zewnętrznej płaszczyźnie (tor `outerFar`).
const SCHEME_DEFINITIONS = {
  a: {
    panels: [
      { type: 'sliding', span: [0, 0.5], track: 'inner', handle: 'left', extend: [0, OV] },
      { type: 'fixed', span: [0.5, 1], track: 'outer', extend: [-OV, 0] },
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
    // Układ trzytorowy wg rysunku: lewe skrzydło najbliżej wnętrza (klamka przy
    // futrynie), środkowe na środkowym torze z klamką na prawym słupku, pole
    // stałe najdalej od wnętrza; oba skrzydła przesuwają się w prawo
    panels: [
      { type: 'sliding', span: [0, 1 / 3], track: 'inner', handle: 'left', extend: [0, OV] },
      { type: 'sliding', span: [1 / 3, 2 / 3], track: 'outer', handle: 'right', extend: [-OV, OV] },
      { type: 'fixed', span: [2 / 3, 1], track: 'outerFar', extend: [-OV, 0] },
    ],
    extraDepth: 0.11,
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

// `outerFar` to trzecia płaszczyzna schematu E (pogłębiona ościeżnica) —
// o pełny rozstaw toru (0.11) za torem zewnętrznym
const TRACK_Z = {
  inner: PROFILE.trackInnerZ,
  outer: PROFILE.trackOuterZ,
  outerFar: PROFILE.trackOuterZ - 0.11,
};

// Odbicie lustrzane schematu liczone w danych, nie przez scale(-1) na grupie
// (ujemna skala odwraca winding i psuje cieniowanie brył). Panele zostają na
// swoich indeksach (animacje i oznaczenie aktywnego skrzydła nie wymagają
// przemapowania) — odbijamy span/zakłady/stronę klamki, słupki i kierunki jazdy.
const mirrorSchemeDefinition = (definition) => ({
  ...definition,
  panels: definition.panels.map((panel) => ({
    ...panel,
    span: [1 - panel.span[1], 1 - panel.span[0]],
    extend: [-panel.extend[1], -panel.extend[0]],
    handle: panel.handle === 'left' ? 'right' : panel.handle === 'right' ? 'left' : panel.handle,
  })),
  mullions: definition.mullions?.map((fraction) => 1 - fraction),
});

const mirrorAnimationSpec = (spec) => ({
  ...spec,
  panels: Object.fromEntries(
    Object.entries(spec.panels ?? {}).map(([index, sash]) => [index, { ...sash, dir: -sash.dir }])
  ),
});

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
      // Lewe (wewnętrzne) zatrzymuje się przed klamką na prawym słupku
      // środkowego skrzydła; środkowe zajeżdża przed pole stałe
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

// Wykończenia klamki wg realnych okuć G-U: F1 srebrny = satynowane (anodowane)
// aluminium — neutralna jasna szarość, delikatne szczotkowanie; F4 „stare
// złoto" — przygaszony oliwkowo-brązowy mat okuciowy, bez jubilerskiej żółci
// i połysku. Wyższy roughness i niepełny metalness dają satynę zamiast lustra;
// anizotropia zostawia podłużne ślady szczotkowania. Biały/czarny/antracyt to
// lakier proszkowy — niski metalness, bez szczotkowania; inox = szczotkowana
// stal nierdzewna, chłodniejsza i bardziej lustrzana niż anodowane F1
const HANDLE_FINISHES = {
  silver: { color: '#cfd1d2', roughness: 0.42, metalness: 0.9, anisotropy: 0.5 },
  gold: { color: '#9b8153', roughness: 0.52, metalness: 0.7, anisotropy: 0.35 },
  white: { color: '#f1f1ee', roughness: 0.55, metalness: 0.15, anisotropy: 0 },
  black: { color: '#1f2022', roughness: 0.5, metalness: 0.25, anisotropy: 0 },
  anthracite: { color: '#3a3f43', roughness: 0.52, metalness: 0.3, anisotropy: 0 },
  inox: { color: '#c2c4c3', roughness: 0.32, metalness: 1, anisotropy: 0.6 },
};

// Funkcja do tworzenia materiału progu
function getThresholdMaterial(thresholdType) {
  let material = {
    roughness: 0.3,
    metalness: 0.8,
    color: '#8c8c8c',
  };

  // Odcienie jak w realnych profilach progów (anodowane aluminium): satyna
  // zamiast połysku
  switch (thresholdType) {
    case 'silver':
      // Niższy metalness niż w klamce: pionowe lica progu odbijają ciemny
      // horyzont HDRI i przy pełnym metalu „silver" czytał się jak grafit
      material.color = '#bcbec0';
      material.roughness = 0.45;
      material.metalness = 0.7;
      break;
    case 'black':
      material.color = '#2b2b2b';
      material.roughness = 0.45;
      material.metalness = 0.6;
      break;
    default:
      break;
  }

  return material;
}

// Skrzydło aktywne (otwierane jako pierwsze) — oznaczenie TYLKO dla schematów
// z wyborem (C/F, środkowa para); w pozostałych układ jest jednoznaczny i
// plakietka byłaby szumem. Indeksy w `panels` nie zmieniają się przy lustrze.
const ACTIVE_PANEL_INDEX = {
  c: { left: 1, right: 2 },
  f: { left: 1, right: 2 },
};

const resolveActivePanelIndex = (scheme, activeSash) => {
  const entry = ACTIVE_PANEL_INDEX[scheme];
  if (!entry) return null;
  return entry[activeSash] ?? entry.left;
};

// Plakietki informacyjne na szybie (prawy dolny róg): „A" = aktywne skrzydło,
// tarcza = szyba hartowana. Obie mają identyczny wymiar i przezroczyste tło;
// eksport AR je usuwa (userData.hsGlassBadge w prepareModelForExport)
const GLASS_BADGE_SIZE = 0.09; // bok plakietki w metrach
const GLASS_BADGE_INSET = 0.035; // odstęp plakietki od krawędzi szyby
const GLASS_BADGE_GAP = 0.02; // odstęp między plakietkami
const BADGE_COLOR = '#0f3d2a';
const TEMPERED_ICON_PATH = '/images/hs/hart-glass.png';

// Badge „A": okrąg + litera rysowane na CanvasTexture (bez zewnętrznych
// fontów), tło w pełni przezroczyste. Kreska celowo cienka i lekko
// przepuszczalna — znak ma wagę wizualną ikony szyby hartowanej (delikatna
// adnotacja na szkle), nie przycisku UI
const createActiveMarkerTexture = () => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 12, 0, Math.PI * 2);
  ctx.lineWidth = 7;
  ctx.strokeStyle = BADGE_COLOR;
  ctx.stroke();
  ctx.fillStyle = BADGE_COLOR;
  ctx.font = '500 130px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('A', size / 2, size / 2 + 6);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

function GlassBadge({ position, texture }) {
  return (
    <mesh position={position} userData={{ hsGlassBadge: true }} renderOrder={2}>
      <planeGeometry args={[GLASS_BADGE_SIZE, GLASS_BADGE_SIZE]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

// Ikona szyby hartowanej — osobny komponent, żeby useTexture (Suspense)
// ładował plik tylko wtedy, gdy dodatek jest zaznaczony
function TemperedGlassBadge({ position }) {
  const texture = useTexture(TEMPERED_ICON_PATH, (tex) => {
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
  });
  return <GlassBadge position={position} texture={texture} />;
}

// Deterministyczny pseudo-losowy hash z wymiarów elementu — stały między
// renderami (bez migotania), inny dla każdej belki
const uvHash = (a, b, c, d) => {
  const s = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719 + d * 4.581) * 43758.5453;
  return s - Math.floor(s);
};

// Każda belka to w realnym oknie OSOBNY kawałek drewna — identyczny rysunek
// słojów na każdym elemencie czyta się jak tapeta. Przesuwamy więc UV każdego
// boxa o losowy (deterministyczny) offset, żeby próbkował inny wycinek mapy;
// MirroredRepeatWrapping na teksturach domyka próbkowanie poza [0,1] bez szwu
const applyUvOffset = (geometry, offsetU, offsetV) => {
  if (geometry.userData.uvOffsetApplied) return;
  geometry.userData.uvOffsetApplied = true;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i += 1) {
    uv.setXY(i, uv.getX(i) + offsetU, uv.getY(i) + offsetV);
  }
  uv.needsUpdate = true;
};

function BoxPart({ position, size, material, castShadow = true, receiveShadow = true }) {
  const offsetU = uvHash(position[0], position[1], size[0], size[1]);
  const offsetV = uvHash(position[1], position[2] + 1.73, size[2], size[0]);
  return (
    <mesh position={position} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={size} onUpdate={(geometry) => applyUvOffset(geometry, offsetU, offsetV)} />
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
// zewnętrzna strefa to płaski stopień. `extraDepth` (schemat E, trzeci tor)
// wydłuża stopień i wysuwa nos okapowy o rozstaw dodatkowej płaszczyzny
function LowThreshold({ bodyWidth, openingWidth, material, outerRail, extraDepth = 0 }) {
  const { inner, platform, nose, plate, rail } = THRESHOLD;
  const plateGap = rail.width / 2 + 0.005; // odstęp nakładek od osi szyny
  const platformZFrom = platform.zFrom - extraDepth;
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
        position={[0, platform.height / 2, (platformZFrom + platform.zTo) / 2]}
        size={[bodyWidth, platform.height, platform.zTo - platformZFrom]}
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
      {/* Spadek odwadniający: cienka nakładka pochylona ku zewnętrzu,
          zawiasowo od wewnętrznej krawędzi stopnia (pola stałe stoją płasko
          na stopniu, nakładka zaczyna się 1,5 mm niżej) */}
      <group position={[0, platform.height, platform.zTo]} rotation={[-0.04, 0, 0]}>
        <BoxPart
          position={[0, -0.0015, -(platform.zTo - platformZFrom) / 2]}
          size={[bodyWidth, 0.003, platform.zTo - platformZFrom]}
          material={material}
        />
      </group>
      {/* Nos okapowy przed licem ościeżnicy */}
      <BoxPart
        position={[0, nose.height / 2, (nose.zFrom + nose.zTo) / 2 - extraDepth]}
        size={[bodyWidth, nose.height, nose.zTo - nose.zFrom]}
        material={material}
      />
      {/* Wystający okapnik na krawędzi noska (jak na renderach progów) */}
      <BoxPart
        position={[0, nose.height - 0.0015, nose.zFrom - extraDepth - 0.005]}
        size={[bodyWidth, 0.003, 0.02]}
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
// nie razi kolor aluminium.
// Plakieta pionowa pojawia się tylko na boku z zakładem (`wrapLeft`/`wrapRight`).
// Bok domykający do futryny (albo czołowo do drugiego skrzydła) nie ma szczeliny,
// przez którą widać profil, a po otwarciu skrzydła aluminium na tej krawędzi
// świeciło w świetle otworu — dlatego ten bok zostaje bez plakiety (drewno).
function AluSideWrap({
  xLeft,
  xRight,
  bottom,
  top,
  z,
  depth,
  material,
  innerMaterial,
  wrapLeft = true,
  wrapRight = true,
}) {
  const outerDepth = depth / 2 + ALU.depth;
  const innerDepth = depth / 2 - 0.001;
  const cy = (bottom + top) / 2;
  const height = top - bottom;
  // Poziome plakiety (góra/dół) domykają narożniki tylko od strony, gdzie stoi
  // plakieta pionowa — przy boku bez owinięcia nie wystają w pustkę
  const hLeft = xLeft - (wrapLeft ? ALU.side : 0);
  const hRight = xRight + (wrapRight ? ALU.side : 0);
  const hcx = (hLeft + hRight) / 2;
  const hWidth = hRight - hLeft;
  const segments = [
    { key: 'outer', zPos: z - depth / 2 - ALU.depth + outerDepth / 2, zDepth: outerDepth, mat: material },
    { key: 'inner', zPos: z + innerDepth / 2, zDepth: innerDepth, mat: innerMaterial ?? material },
  ];
  return (
    <group>
      {segments.map(({ key, zPos, zDepth, mat }) => (
        <group key={key}>
          {wrapLeft && (
            <BoxPart position={[xLeft - ALU.side / 2, cy, zPos]} size={[ALU.side, height, zDepth]} material={mat} />
          )}
          {wrapRight && (
            <BoxPart position={[xRight + ALU.side / 2, cy, zPos]} size={[ALU.side, height, zDepth]} material={mat} />
          )}
          <BoxPart position={[hcx, top + ALU.side / 2, zPos]} size={[hWidth, ALU.side, zDepth]} material={mat} />
          <BoxPart position={[hcx, bottom - ALU.side / 2, zPos]} size={[hWidth, ALU.side, zDepth]} material={mat} />
        </group>
      ))}
    </group>
  );
}

// Listwa przyszybowa wg przekroju producenta: zaokrąglony profil (ćwierćwałek
// z krótkimi przylgami) docięty na końcach pod 45°, by w narożach schodził się
// na ucios jak w stolarce
const BEAD = { width: PROFILE.bead, depth: 0.022, land: 0.005 };

function createBeadGeometry(length, uvSeed = 0) {
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
    // uvSeed przesuwa próbkowanie wzdłuż mapy — każda listwa pokazuje inny
    // wycinek słojów (jak BoxPart z applyUvOffset)
    uvAttr.setXY(i, z / length + uvSeed, u / B);
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
      bottom: createBeadGeometry(width, uvHash(cx, cy, width, 1.1)).applyMatrix4(BEAD_ORIENTATIONS.bottom),
      top: createBeadGeometry(width, uvHash(cx, cy, width, 2.3)).applyMatrix4(BEAD_ORIENTATIONS.top),
      left: createBeadGeometry(height, uvHash(cx, cy, height, 3.7)).applyMatrix4(BEAD_ORIENTATIONS.left),
      right: createBeadGeometry(height, uvHash(cx, cy, height, 4.9)).applyMatrix4(BEAD_ORIENTATIONS.right),
    }),
    [cx, cy, width, height]
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

// Pakiet 3-szybowy wg przekroju HS-90: 3 tafle 4 mm + 2 komory 12 mm (razem
// 36 mm — jak dotychczasowa pojedyncza bryła). Tafle wchodzą pod listwy
// przyszybowe (underlap), a ramki dystansowe kończą się 2 mm ZA krawędzią
// widocznego otworu — jak w realnej stolarce ramka jest schowana pod listwą
// i widać ją tylko krawędziowo pod ostrym kątem, nie jako czarną obwódkę
const IGU = { pane: 0.004, gap: 0.012, spacerProfile: 0.012, underlap: 0.015 };

function GlazingUnit({ cx, cy, z, width, height, materials, lite = false }) {
  const pitch = IGU.pane + IGU.gap; // rozstaw osi sąsiednich tafli
  const paneW = width + IGU.underlap * 2;
  const paneH = height + IGU.underlap * 2;
  // Mobile: pakiet jako jedna bryła 36 mm (geometria sprzed „Adjust wood
  // view") — trzy nałożone tafle to 3x przebieg shadera szkła na piksel,
  // a na ekranie telefonu różnicy między pakietem a bryłą nie widać
  if (lite) {
    return (
      <BoxPart
        position={[cx, cy, z]}
        size={[paneW, paneH, 0.036]}
        material={materials.glass}
        castShadow={false}
        receiveShadow={false}
      />
    );
  }
  return (
    <group>
      {[-pitch, 0, pitch].map((offset) => (
        <BoxPart
          key={`pane-${offset}`}
          position={[cx, cy, z + offset]}
          size={[paneW, paneH, IGU.pane]}
          material={materials.glass}
          castShadow={false}
          receiveShadow={false}
        />
      ))}
      {[-1, 1].map((side) => (
        <FrameRing
          key={`spacer-${side}`}
          cx={cx}
          cy={cy}
          z={z + (side * pitch) / 2}
          width={paneW - 0.002}
          height={paneH - 0.002}
          profile={IGU.spacerProfile}
          depth={IGU.gap}
          materialV={materials.spacer}
          materialH={materials.spacer}
        />
      ))}
    </group>
  );
}

// Prowadnica górna wg przekroju producenta: aluminiowa szyna T pod nadprożem
// nad każdym torem skrzydeł przesuwnych — półka przy nadprożu + żebro
// schodzące w kanał wyfrezowany w górnym ryglu skrzydła
const TOP_GUIDE = { flangeH: 0.004, flangeD: 0.03, webH: 0.012, webD: 0.004 };

function TopGuide({ z, width, openingTop, material }) {
  return (
    <group>
      <BoxPart
        position={[0, openingTop - TOP_GUIDE.flangeH / 2, z]}
        size={[width, TOP_GUIDE.flangeH, TOP_GUIDE.flangeD]}
        material={material}
      />
      <BoxPart
        position={[0, openingTop - TOP_GUIDE.flangeH - TOP_GUIDE.webH / 2, z]}
        size={[width, TOP_GUIDE.webH, TOP_GUIDE.webD]}
        material={material}
      />
    </group>
  );
}

// Klamka HS wg rysunku technicznego G-U: płytka 46 x 143,5 x 19 mm, dźwignia
// 27 x 15 mm łukiem przez szyjkę do trzpienia w środku płytki (= kotwica
// grupy), czubek ścięty „dziobkiem" ku szybie; całość 311,7 mm. Bryły z
// profili w hsHandleGeometry.js — dźwignia siedzi w grupie obracanej wokół
// osi trzpienia (animacja otwierania)
function PullHandle({ position, material, leverRef }) {
  const geometries = useMemo(
    () => ({ plate: createHandlePlateGeometry(), lever: createHandleLeverGeometry() }),
    []
  );

  useEffect(
    () => () => {
      Object.values(geometries).forEach((geometry) => geometry.dispose());
    },
    [geometries]
  );

  return (
    <group position={position}>
      <mesh geometry={geometries.plate} castShadow receiveShadow>
        {material}
      </mesh>
      {/* userData pozwala eksportowi AR znaleźć i wyzerować obrót dźwigni na klonie */}
      <group ref={leverRef} userData={{ hsLever: true }}>
        <mesh geometry={geometries.lever} castShadow receiveShadow>
          {material}
        </mesh>
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
  activeMarker = false,
  markerTexture = null,
  temperedGlass = false,
  lapSeals = [],
  liteGlazing = false,
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

  // Skrzydło przesuwne na torze WEWNĘTRZNYM jest najbliżej wnętrza — jego boki
  // widać od środka (gdzie wariant drewno-alu ma zostać drewnem), a w strefie
  // zakładu od zewnątrz zasłania je sąsiednie pole. Dlatego nie dostaje żadnej
  // plakiety alu na obwodzie (lico zewnętrzne ramy zostaje aluminiowe).
  // Pozostałe pola owijamy tylko od strony zakładu (extend ≠ 0); bok domykający
  // do futryny lub czołowo do drugiego skrzydła (extend === 0) zostaje drewniany,
  // bo po otwarciu wjeżdża w światło otworu i aluminium na nim świeciło
  const isInnerSliding = isSliding && panel.track === 'inner';
  const lapsLeft = panel.extend[0] !== 0;
  const lapsRight = panel.extend[1] !== 0;

  // Skrzydło przesuwne jedzie po szynie progu, pole stałe schodzi niżej — na
  // zewnętrzny stopień progu; od góry pole stałe domyka listwa maskująca 19 x 115.
  // Szczelina górna skrzydła przesuwnego 14 mm — mieści żebro prowadnicy
  // górnej (TopGuide) wchodzące w kanał rygla
  const bottom = isSliding ? openingBottom + 0.012 : THRESHOLD.platform.height;
  const top = openingTop - (isSliding ? 0.014 : isGlazing ? 0 : PROFILE.filler.height);
  const cy = (bottom + top) / 2;
  const panelHeight = top - bottom;

  const openW = Math.max(panelWidth - profile * 2, 0.05);
  const openH = Math.max(panelHeight - profile * 2, 0.05);
  const glassInset = isGlazing ? 0 : PROFILE.bead;
  const glassW = Math.max(openW - glassInset * 2 + 0.01, 0.04);
  const glassH = Math.max(openH - glassInset * 2 + 0.01, 0.04);

  const handleX = panel.handle === 'left' ? xLeft + profile / 2 : xRight - profile / 2;
  const handleY = Math.min(bottom + 1.0, cy);
  // Lico zewnętrzne panelu (przy drewno-alu za nakładką) — kotwica dla
  // okapnika, pochwytu zewnętrznego i rozety wkładki
  const exteriorZ = z - depth / 2 - (aluMaterial ? ALU.depth : 0);

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
          renderowana w grupie skrzydła, więc jeździ razem z nim. Plakiety na
          bokach (AluSideWrap) tylko tam, gdzie bok widać od zewnątrz przez
          zakład; skrzydło przesuwne na torze wewnętrznym ich nie dostaje (boki
          widoczne od środka zostają drewniane) */}
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
          {!isInnerSliding && (
            <AluSideWrap
              xLeft={xLeft}
              xRight={xRight}
              bottom={bottom}
              top={top}
              z={z}
              depth={depth}
              material={aluMaterial}
              innerMaterial={materials.gasket}
              wrapLeft={lapsLeft}
              wrapRight={lapsRight}
            />
          )}
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
      {/* Pakiet szybowy: 3 tafle + ramki dystansowe (przekrój HS-90) */}
      <GlazingUnit cx={cx} cy={cy} z={z} width={glassW} height={glassH} materials={materials} lite={liteGlazing} />
      {/* Uszczelki szczotkowe zakładów — na licu zwróconym ku sąsiedniemu polu
          (kierunek dz policzony w modelu, bo panel nie zna sąsiadów) */}
      {lapSeals.map(({ side, dz }) => (
        <BoxPart
          key={`lap-seal-${side}`}
          position={[side === 'left' ? xLeft + 0.005 : xRight - 0.005, cy, z + dz * (depth / 2 + 0.007)]}
          size={[0.007, panelHeight - 0.02, 0.014]}
          material={materials.gasket}
        />
      ))}
      {/* Uszczelka progowa — styk pola stałego / szklenia ze stopniem progu */}
      {!isSliding && (
        <BoxPart position={[cx, bottom, z]} size={[panelWidth - 0.01, 0.006, depth * 0.6]} material={materials.gasket} />
      )}
      {/* Szczotki kanału prowadnicy górnej na górnym ryglu skrzydła */}
      {isSliding &&
        [-1, 1].map((side) => (
          <BoxPart
            key={`top-brush-${side}`}
            position={[cx, top + 0.005, z + side * 0.012]}
            size={[panelWidth, 0.01, 0.004]}
            material={materials.gasket}
          />
        ))}
      {/* Osłona wózków: dolny rygiel schodzi osłoną prawie do progu (w realnym
          skrzydle wózki są niemal całkiem zakryte) — zostaje 4 mm szczeliny nad
          nakładkami progu, a rolki widać dopiero po uniesieniu skrzydła */}
      {isSliding && (
        <BoxPart
          position={[cx, bottom - 0.004, z]}
          size={[panelWidth - 0.004, 0.008, 0.055]}
          material={materials.gasket}
        />
      )}
      {/* Okapnik aluminiowy na dolnym ryglu od zewnątrz */}
      {!isGlazing && (
        <BoxPart
          position={[cx, bottom + 0.008, exteriorZ - 0.003]}
          size={[panelWidth, 0.02, 0.006]}
          material={materials.threshold}
        />
      )}
      {/* Plakietki w prawym dolnym rogu szyby (wewnętrzne lico): „A" dla
          aktywnego skrzydła (C/F), tarcza dla szyby hartowanej — hartowana
          na KAŻDEJ szybie, a gdy obie plakietki są obecne, tarcza staje obok
          „A". Siedzą w grupie skrzydła, więc jeżdżą razem z nim i same
          zmieniają stronę przy odbiciu lustrzanym schematu */}
      {(() => {
        const showActive = activeMarker && markerTexture;
        if (!showActive && !temperedGlass) return null;
        const badgeZ = z + 0.021;
        const badgeY = cy - glassH / 2 + GLASS_BADGE_INSET + GLASS_BADGE_SIZE / 2;
        const cornerX = cx + glassW / 2 - GLASS_BADGE_INSET - GLASS_BADGE_SIZE / 2;
        const temperedX = showActive ? cornerX - GLASS_BADGE_SIZE - GLASS_BADGE_GAP : cornerX;
        return (
          <group>
            {showActive && <GlassBadge position={[cornerX, badgeY, badgeZ]} texture={markerTexture} />}
            {temperedGlass && <TemperedGlassBadge position={[temperedX, badgeY, badgeZ]} />}
          </group>
        );
      })()}
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
  mirrored = false,
  activeSash = 'left',
  temperedGlass = false,
  woodFinish,
  handleFinish,
  thresholdType,
  materialType,
  aluColor,
  width,
  height,
  plinthHeight = PLINTH_RANGE.default,
  lowPower = false,
  onReady,
  exportRef,
  ...props
}) {
  const isWoodAlu = materialType === 'woodAlu';
  const isRalWood = woodFinish?.type === 'ral';
  const grainPath = woodFinish?.grainPath ?? FALLBACK_GRAIN;
  const grainTexture = useTexture(grainPath);
  // Wariant lustrzany liczony z definicji bazowej — panele zostają na swoich
  // indeksach, więc animacje i aktywne skrzydło nie wymagają przemapowania
  const { schemeDef, animationSpec } = useMemo(() => {
    const baseDef = SCHEME_DEFINITIONS[scheme] ?? SCHEME_DEFINITIONS.a;
    const baseAnim = SCHEME_ANIMATIONS[scheme] ?? SCHEME_ANIMATIONS.a;
    if (!mirrored) return { schemeDef: baseDef, animationSpec: baseAnim };
    return { schemeDef: mirrorSchemeDefinition(baseDef), animationSpec: mirrorAnimationSpec(baseAnim) };
  }, [scheme, mirrored]);
  const panels = schemeDef.panels;
  const mullions = schemeDef.mullions ?? [];
  // Dodatkowa głębokość ościeżnicy/progu (schemat E — trzeci tor)
  const extraDepth = schemeDef.extraDepth ?? 0;
  const frameDepth = PROFILE.frameDepth + extraDepth;
  const frameZ = -extraDepth / 2; // rama pogłębia się w stronę zewnętrzną (-z)
  // Tylne skrzydła przesuwne (schematy D/E/F/H) potrzebują szyny na torze
  // zewnętrznym; przy polach stałych zewnętrzna strefa progu zostaje płaska
  const hasOuterSliding = panels.some((panel) => panel.type === 'sliding' && panel.track === 'outer');

  const activePanelIndex = resolveActivePanelIndex(scheme, activeSash);
  // Tekstura badge'a „A" tworzona raz na życie modelu (client-only render)
  const markerTexture = useMemo(() => createActiveMarkerTexture(), []);
  useEffect(() => () => markerTexture.dispose(), [markerTexture]);

  // Kierunki szczotek na zakładach: szczotka siedzi na licu zwróconym ku
  // płaszczyźnie sąsiedniego pola — znak różnicy torów; panel sam nie zna
  // sąsiadów, więc liczone na poziomie modelu
  const lapSealsByPanel = useMemo(
    () =>
      panels.map((panel, index) => {
        if (panel.type !== 'sliding') return [];
        const panelZ = TRACK_Z[panel.track] ?? PROFILE.trackOuterZ;
        const seals = [];
        const edges = [
          ['left', panel.span[0], panel.extend[0]],
          ['right', panel.span[1], panel.extend[1]],
        ];
        for (const [side, edge, extend] of edges) {
          if (extend === 0) continue;
          const neighbor = panels.find(
            (other, j) =>
              j !== index && Math.abs((side === 'left' ? other.span[1] : other.span[0]) - edge) < 1e-6
          );
          if (!neighbor) continue;
          const neighborZ = neighbor.type === 'glazing' ? GLAZING.z : TRACK_Z[neighbor.track] ?? PROFILE.trackOuterZ;
          const dz = Math.sign(neighborZ - panelZ);
          if (dz) seals.push({ side, dz });
        }
        return seals;
      }),
    [panels]
  );

  // Stan otwarcia skrzydeł trzymany na poziomie modelu, bo skrzydła z par
  // kolizyjnych muszą znać stan sąsiada
  const [openPanels, setOpenPanels] = useState({});

  useEffect(() => {
    setOpenPanels({});
  }, [scheme, mirrored, activeSash, width, height]);

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
          // C/F: skrzydło bierne środkowej pary jest fizycznie ryglowane przez
          // aktywne (zamek na styku pary) — otworzy się dopiero po otwarciu
          // aktywnego. Nie dotyczy skrzydeł tylnych (F) — te odblokowuje sam
          // ich tor, pilnują ich tylko pary kolizyjne wyżej.
          const middlePair = ACTIVE_PANEL_INDEX[scheme];
          if (middlePair) {
            const activeIndex = middlePair[activeSash] ?? middlePair.left;
            const passiveIndex = activeIndex === middlePair.left ? middlePair.right : middlePair.left;
            if (index === passiveIndex && !prev[activeIndex]) return prev;
          }
        }
        return { ...prev, [index]: willOpen };
      });
    },
    [animationSpec, scheme, activeSash]
  );

  const modelWidth = width / 1000;
  const modelHeight = height / 1000;
  const plinthM = plinthHeight / 1000;
  const openingWidth = modelWidth - PROFILE.frame * 2;
  const openingBottom = PROFILE.threshold;
  const openingTop = modelHeight - PROFILE.frame;

  // Konfiguracja tekstur — słoje drewna wzdłuż elementu (pion/poziom).
  // Ta sama mapa słojów gatunku służy jako mapa koloru (sRGB, tintowana
  // material.color) i jako mapa reliefu (liniowa)
  const textures = useMemo(() => {
    // Mobile: wspólny, pomniejszony obraz POT dla wszystkich 4 klonów —
    // z ~32 MB tekstur GPU robi się ~5,5 MB i znika wolna ścieżka mipmap
    // dla wymiarów niebędących potęgą dwójki. Desktop bez zmian
    const image = lowPower
      ? downscaleToSquarePot(grainTexture.image, MOBILE_GRAIN_SIZE)
      : grainTexture.image;
    const setup = (rotate, colorSpace) => {
      const tex = grainTexture.clone();
      tex.image = image;
      // Lustrzane zawijanie: elementy próbkują mapę z losowym offsetem UV
      // (osobny kawałek drewna per belka), więc wychodzą poza [0,1] — mirror
      // domyka to bez widocznego szwu
      tex.wrapS = MirroredRepeatWrapping;
      tex.wrapT = MirroredRepeatWrapping;
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
  }, [grainTexture, lowPower]);

  // Klony żyją poza cachem useTexture — bez sprzątania każda zmiana gatunku
  // drewna zostawiała na GPU 4 martwe tekstury (kolejne ~32 MB na mobile)
  useEffect(
    () => () => {
      Object.values(textures).forEach((tex) => tex.dispose());
    },
    [textures]
  );

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
    // Mobile: drewno jak w wersji sprzed lazurów — meshStandardMaterial z samą
    // mapą koloru (tint hex zostaje). bumpMapa na drewnie to największa
    // pojedyncza pozycja kosztu piksela w scenie (drewno pokrywa większość
    // ekranu), a meshPhysical dokłada drugą — zmierzono +~30% czasu klatki.
    // Kolor lazuru = map × color, identycznie jak na desktopie; znika tylko
    // mikro-relief, niewidoczny na ekranie telefonu
    const makeWood = (tex, grain) =>
      lowPower ? (
        <meshStandardMaterial
          map={isRalWood ? null : tex}
          color={woodFinish?.hex ?? '#ffffff'}
          roughness={0.5}
          metalness={0.02}
        />
      ) : isRalWood ? (
        // RAL = lakier kryjący: jednolity kolor; sosna/dąb gładko, meranti ma
        // otwarte pory → delikatny relief przez lakier
        <meshPhysicalMaterial
          color={woodFinish.hex}
          bumpMap={isMeranti ? grain : null}
          bumpScale={isMeranti ? 0.5 : 0}
          roughness={0.55}
          metalness={0.02}
          specularIntensity={0.12}
          envMapIntensity={0.35}
        />
      ) : (
        // meshPhysicalMaterial zamiast standard wyłącznie dla specularIntensity:
        // szeroki spekular dielektryka (F0 4%) od świateł dokładał na drewnie
        // biały sheen ~0.03-0.05 liniowo, który rozjaśniał kanał B lazurów
        // o kilkanaście % i odbarwiał je względem wzornika (roughness NIE tłumi
        // tego lobe'a przy geometrii frontu). specularIntensity 0.25 + kalibracja
        // świateł (patrz komentarz przy toneMapping) dają front 1:1 ze swatchem.
        <meshPhysicalMaterial
          map={tex}
          bumpMap={grain}
          bumpScale={lazurBump}
          color={woodFinish?.hex ?? '#ffffff'}
          roughness={0.5}
          metalness={0.02}
          specularIntensity={0.12}
          envMapIntensity={0.35}
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
      // Ramka dystansowa pakietu szybowego (ciepła ramka): ciemny grafit,
      // widoczny przez szkło przy krawędzi pakietu
      spacer: <meshStandardMaterial color="#2f3236" roughness={0.6} metalness={0.3} />,
      // Podwalina (belka montażowa pod progiem, np. purenit): matowa szara
      // bryła bez metaliczności — ma się czytać jako materiał budowlany,
      // nie jako element okucia
      plinth: <meshStandardMaterial color="#8e9093" roughness={0.8} metalness={0.04} />,
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
  }, [textures, thresholdType, handleFinish, aluColor, isRalWood, woodFinish, lowPower]);

  const aluMaterial = isWoodAlu ? materials.alu : null;

  // Zewnętrzne lico ościeżnicy (przy pogłębionej ramie schematu E przesuwa
  // się o extraDepth w stronę zewnętrzną)
  const frameOuterZ = -PROFILE.frameDepth / 2 - extraDepth;

  useEffect(() => {
    onReady?.();
  }, [activeSash, aluColor, handleFinish, height, materialType, mirrored, onReady, plinthHeight, scheme, temperedGlass, thresholdType, textures, width, woodFinish]);

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
              frameZ,
            ]}
            size={[PROFILE.frame, modelHeight - PROFILE.threshold, frameDepth]}
            material={materials.woodV}
          />
          <BoxPart
            position={[
              side * (modelWidth / 2 - PROFILE.frame / 2),
              (THRESHOLD.platform.height + PROFILE.threshold) / 2,
              (THRESHOLD.platform.zFrom - extraDepth + THRESHOLD.platform.zTo) / 2,
            ]}
            size={[
              PROFILE.frame,
              PROFILE.threshold - THRESHOLD.platform.height,
              THRESHOLD.platform.zTo - THRESHOLD.platform.zFrom + extraDepth,
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
                  frameOuterZ - ALU.depth / 2,
                ]}
                size={[PROFILE.frame, modelHeight - THRESHOLD.platform.height, ALU.depth]}
                material={aluMaterial}
              />
              <BoxPart
                position={[
                  side * (modelWidth / 2 - PROFILE.frame) - side * (ALU.side / 2),
                  PROFILE.threshold + (openingTop - PROFILE.threshold) / 2,
                  (frameOuterZ - ALU.depth) / 2,
                ]}
                size={[ALU.side, openingTop - PROFILE.threshold, -frameOuterZ + ALU.depth]}
                material={aluMaterial}
              />
            </>
          )}
        </group>
      ))}
      <BoxPart
        position={[0, modelHeight - PROFILE.frame / 2, frameZ]}
        size={[openingWidth, PROFILE.frame, frameDepth]}
        material={materials.woodH}
      />
      {aluMaterial && (
        <>
          <BoxPart
            position={[0, modelHeight - PROFILE.frame / 2, frameOuterZ - ALU.depth / 2]}
            size={[openingWidth, PROFILE.frame, ALU.depth]}
            material={aluMaterial}
          />
          {/* Plakieta na wnęce nadproża — analogicznie do wnęk stojaków */}
          <BoxPart
            position={[0, openingTop - ALU.side / 2, (frameOuterZ - ALU.depth) / 2]}
            size={[openingWidth, ALU.side, -frameOuterZ + ALU.depth]}
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
        extraDepth={extraDepth}
      />

      {/* Podwalina — szara belka montażowa pod całym progiem, na pełną
          szerokość ościeżnicy i głębokość ramy; nos okapowy progu wystaje
          przed jej lico (jak w realnym montażu, gdzie okapnik przykrywa
          styk progu z podwaliną) */}
      <BoxPart
        position={[0, -plinthM / 2, frameZ]}
        size={[modelWidth, plinthM, frameDepth]}
        material={materials.plinth}
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

      {/* Prowadnice górne — szyna T pod nadprożem nad każdym torem, po którym
          jeździ skrzydło (pola stałe prowadnicy nie potrzebują) */}
      {[...new Set(panels.filter((panel) => panel.type === 'sliding').map((panel) => panel.track))].map(
        (track) => (
          <TopGuide
            key={`top-guide-${track}`}
            z={TRACK_Z[track]}
            width={openingWidth}
            openingTop={openingTop}
            material={materials.threshold}
          />
        )
      )}

      {panels.map((panel, index) => {
        const panelAnimation = panel.type === 'sliding' ? animationSpec.panels?.[index] : undefined;
        return (
          <GlazedPanel
            // Wymiary i lustro w kluczu resetują transformacje przy zmianie schematu/rozmiaru
            key={`${scheme}-${mirrored ? 'm' : 'b'}-${width}-${height}-${index}-${panel.type}`}
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
            activeMarker={activePanelIndex !== null && index === activePanelIndex}
            markerTexture={markerTexture}
            temperedGlass={temperedGlass}
            lapSeals={lapSealsByPanel[index]}
            liteGlazing={lowPower}
          />
        );
      })}
    </group>
  );
}

function FrontFit({ modelRef, width, height, scheme, plinth }) {
  const controls = useThree((state) => state.controls);
  const { camera } = useThree();
  const lastFittedDimensions = useRef(null);

  useEffect(() => {
    if (!modelRef?.current) return;

    const dimensionsKey = `${scheme}-${width}x${height}-p${plinth}`;
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
  }, [modelRef, camera, controls, width, height, scheme, plinth]);

  return null;
}

export default function HsConfiguratorCanvas({
  selectedType = 'a',
  mirrored = false,
  activeSash = 'left',
  temperedGlass = false,
  selectedWoodFinish,
  selectedHandleFinish,
  selectedThreshold,
  selectedMaterialType = 'wood',
  selectedAluColor = DEFAULT_ALU_COLOR,
  width,
  height,
  plinthHeight = PLINTH_RANGE.default,
  onReady,
  exportRef,
}) {
  const modelRef = useRef();
  const [lowPower] = useState(detectLowPowerDevice);
  // Overlay ?debug3d=1 — czysta obserwacja (bez ingerencji w scenę): profil,
  // GPU, utraty kontekstu i błędy JS wypisywane na ekranie urządzenia
  const [debugEnabled] = useState(isDebug3dEnabled);
  const [debugLines, setDebugLines] = useState([]);
  const pushDebug = useCallback((line) => {
    const stamp = new Date().toISOString().slice(11, 19);
    setDebugLines((prev) => [...prev.slice(-13), `${stamp} ${line}`]);
  }, []);

  useEffect(() => {
    if (!debugEnabled) return undefined;
    pushDebug(`ua: …${navigator.userAgent.slice(-52)}`);
    pushDebug(
      `lowPower=${lowPower} devicePR=${window.devicePixelRatio} touch=${navigator.maxTouchPoints}`
    );
    const onError = (event) =>
      pushDebug(`ERR: ${event.message ?? event.reason?.message ?? String(event.reason ?? '?')}`);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onError);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onError);
    };
  }, [debugEnabled, lowPower, pushDebug]);

  const handleCreated = useCallback(
    ({ gl }) => {
      if (!debugEnabled) return;
      const ctx = gl.getContext();
      const rendererInfo = ctx.getExtension('WEBGL_debug_renderer_info');
      const gpu = rendererInfo ? ctx.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL) : 'n/a';
      pushDebug(`ctx created, gpu: ${String(gpu).slice(0, 48)}`);
      gl.domElement.addEventListener('webglcontextlost', () => pushDebug('ctx LOST'));
      gl.domElement.addEventListener('webglcontextrestored', () => pushDebug('ctx restored'));
    },
    [debugEnabled, pushDebug]
  );

  return (
    <>
    {debugEnabled && (
      <div
        style={{
          position: 'fixed',
          left: 8,
          bottom: 8,
          zIndex: 99999,
          maxWidth: '92vw',
          padding: '6px 9px',
          borderRadius: 6,
          background: 'rgba(0, 0, 0, 0.78)',
          color: '#8f8',
          font: '11px/1.45 monospace',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          pointerEvents: 'none',
        }}
      >
        {debugLines.join('\n')}
      </div>
    )}
    <Canvas
      shadows
      onCreated={handleCreated}
      camera={{ position: [3, 2, 4], fov: 45 }}
      // Mobile: dpr 1.5 zamiast 2 — przy antyaliasingu różnica ostrości
      // minimalna, a liczba pikseli do cieniowania spada prawie o połowę
      dpr={lowPower ? [1, 1.5] : [1, 2]}
      gl={{
        // Log-depth pisze głębię we fragment shaderze (wyłącza early-Z) — na
        // mobilnych GPU podraża każdy piksel. Near/far ustawia FrontFit, więc
        // standardowy bufor 24-bit wystarcza na 1-milimetrowe odsadzenia sceny
        logarithmicDepthBuffer: !lowPower,
        antialias: true,
        // Liniowy tor koloru: lazur na froncie ma być 1:1 z kolorem zmierzonym
        // z wzornika (hex × mapa słojów — dokładnie jak swatche CSS multiply).
        // NeutralToneMapping odejmuje offset ~0.04 liniowo (przyciemnia i dosyca
        // średnie tony), więc nie umie oddać koloru 1:1. Exposure skalibrowane
        // pomiarowo (headless screenshot → średnia RGB frontu vs wzornik) tak,
        // by efektywna irradiancja frontowych lic ≈ 1.0.
        toneMapping: LinearToneMapping,
        toneMappingExposure: 1.0,
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#fffefe']} />
        {/* Ambient rozjaśnia powierzchnie rozproszone (drewno); metale (metalness
            ~0.95) prawie go nie odbierają, więc nie przepala klamki ani progu */}
        <ambientLight intensity={1.63} />
        <directionalLight
          position={[5, 6, 9]}
          intensity={1.4}
          castShadow
          shadow-mapSize={lowPower ? [1024, 1024] : [2048, 2048]}
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
              mirrored={mirrored}
              activeSash={activeSash}
              temperedGlass={temperedGlass}
              woodFinish={selectedWoodFinish}
              handleFinish={selectedHandleFinish}
              thresholdType={selectedThreshold}
              materialType={selectedMaterialType}
              aluColor={selectedAluColor}
              width={width}
              height={height}
              plinthHeight={plinthHeight}
              lowPower={lowPower}
              onReady={onReady}
              exportRef={exportRef}
            />
          </group>
        </Center>
        <FrontFit modelRef={modelRef} width={width} height={height} scheme={selectedType} plinth={plinthHeight} />
        {/* Cień przyziemny pod modelem — model jest wyśrodkowany, więc podłoga
            leży na -(wysokość okna + podwalina)/2 */}
        <ContactShadows
          position={[0, -(height + plinthHeight) / 2000 - 0.002, 0]}
          opacity={0.35}
          blur={2.5}
          far={10}
          resolution={256}
          color="#000000"
        />
      </Suspense>
    </Canvas>
    </>
  );
}
