import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  Center,
  ContactShadows,
  Environment,
  OrbitControls,
  useTexture,
} from '@react-three/drei';

import {
  Box3,
  LinearFilter,
  LinearMipMapLinearFilter,
  NeutralToneMapping,
  RepeatWrapping,
  Sphere,
  SRGBColorSpace,
  Vector3,
} from 'three';

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
// odsadzenie uchwytu 61 mm od powierzchni skrzydła
function PullHandle({ position, material }) {
  return (
    <group position={position}>
      {/* płytka montażowa */}
      <BoxPart position={[0, 0, 0.006]} size={[0.057, 0.1435, 0.012]} material={material} />
      {/* trzpień obrotowy */}
      <BoxPart position={[0, -0.03, 0.025]} size={[0.034, 0.036, 0.026]} material={material} />
      {/* szyjka łącząca trzpień z dźwignią */}
      <BoxPart position={[0, -0.03, 0.05]} size={[0.028, 0.045, 0.024]} material={material} />
      {/* dźwignia pionowa (płaskownik) */}
      <BoxPart position={[0, 0.098, 0.061]} size={[0.025, 0.3, 0.019]} material={material} />
    </group>
  );
}

function GlazedPanel({ panel, openingWidth, openingBottom, openingTop, materials }) {
  const isSliding = panel.type === 'sliding';
  const isGlazing = panel.type === 'glazing';
  const profile = isGlazing ? GLAZING.profile : isSliding ? PROFILE.sash : PROFILE.fixed;
  const depth = isGlazing ? GLAZING.depth : isSliding ? PROFILE.sashDepth : PROFILE.fixedDepth;
  const z = isGlazing ? GLAZING.z : TRACK_Z[panel.track] ?? PROFILE.trackOuterZ;

  const xLeft = -openingWidth / 2 + panel.span[0] * openingWidth + panel.extend[0];
  const xRight = -openingWidth / 2 + panel.span[1] * openingWidth + panel.extend[1];
  const cx = (xLeft + xRight) / 2;
  const panelWidth = xRight - xLeft;

  // Skrzydło przesuwne jedzie po prowadnicy progu, skrzydło stałe siedzi na progu,
  // a od góry skrzydło stałe domyka listwa maskująca 19 x 115
  const bottom = openingBottom + (isSliding ? 0.012 : 0);
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

  return (
    <group>
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
      {/* Listwy przyszybowe po obu stronach pakietu (przy szkleniu w ościeżnicy
          rolę listew pełni główna rama panelu) */}
      {!isGlazing && (
        <>
          <FrameRing
            cx={cx}
            cy={cy}
            z={z + depth / 2 - 0.011}
            width={openW + 0.008}
            height={openH + 0.008}
            profile={PROFILE.bead}
            depth={0.022}
            materialV={materials.woodV}
            materialH={materials.woodH}
          />
          <FrameRing
            cx={cx}
            cy={cy}
            z={z - depth / 2 + 0.011}
            width={openW + 0.008}
            height={openH + 0.008}
            profile={PROFILE.bead}
            depth={0.022}
            materialV={materials.woodV}
            materialH={materials.woodH}
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
      {!isSliding && !isGlazing && (
        <BoxPart
          position={[cx, top + PROFILE.filler.height / 2, z]}
          size={[panelWidth, PROFILE.filler.height, PROFILE.filler.depth]}
          material={materials.woodH}
        />
      )}
      {isSliding && (
        <PullHandle position={[handleX, handleY, z + depth / 2]} material={materials.handle} />
      )}
    </group>
  );
}

function ProceduralHsModel({
  scheme,
  texturePath,
  handleFinish,
  thresholdType,
  width,
  height,
  onReady,
  ...props
}) {
  const texture = useTexture(texturePath);
  const schemeDef = SCHEME_DEFINITIONS[scheme] ?? SCHEME_DEFINITIONS.a;
  const panels = schemeDef.panels;
  const mullions = schemeDef.mullions ?? [];

  const modelWidth = width / 1000;
  const modelHeight = height / 1000;
  const openingWidth = modelWidth - PROFILE.frame * 2;
  const openingBottom = PROFILE.threshold;
  const openingTop = modelHeight - PROFILE.frame;

  // Konfiguracja tekstur — słoje drewna wzdłuż elementu (pion/poziom)
  const textures = useMemo(() => {
    const setupWood = (rotate) => {
      const tex = texture.clone();
      tex.wrapS = RepeatWrapping;
      tex.wrapT = RepeatWrapping;
      tex.colorSpace = SRGBColorSpace;
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
      woodV: setupWood(true),
      woodH: setupWood(false),
    };
  }, [texture]);

  const materials = useMemo(() => {
    const thresholdMat = getThresholdMaterial(thresholdType);
    const handleMat = HANDLE_FINISHES[handleFinish] ?? HANDLE_FINISHES.silver;

    return {
      woodV: (
        <meshStandardMaterial map={textures.woodV} color="#ffffff" roughness={0.48} metalness={0.02} />
      ),
      woodH: (
        <meshStandardMaterial map={textures.woodH} color="#ffffff" roughness={0.48} metalness={0.02} />
      ),
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
    };
  }, [textures, thresholdType, handleFinish]);

  useEffect(() => {
    onReady?.();
  }, [handleFinish, height, onReady, scheme, thresholdType, textures, width]);

  return (
    <group {...props} position={[0, -modelHeight / 2, 0]}>
      {/* Ościeżnica: stojaki i nadproże */}
      <BoxPart
        position={[
          -modelWidth / 2 + PROFILE.frame / 2,
          PROFILE.threshold + (modelHeight - PROFILE.threshold) / 2,
          0,
        ]}
        size={[PROFILE.frame, modelHeight - PROFILE.threshold, PROFILE.frameDepth]}
        material={materials.woodV}
      />
      <BoxPart
        position={[
          modelWidth / 2 - PROFILE.frame / 2,
          PROFILE.threshold + (modelHeight - PROFILE.threshold) / 2,
          0,
        ]}
        size={[PROFILE.frame, modelHeight - PROFILE.threshold, PROFILE.frameDepth]}
        material={materials.woodV}
      />
      <BoxPart
        position={[0, modelHeight - PROFILE.frame / 2, 0]}
        size={[openingWidth, PROFILE.frame, PROFILE.frameDepth]}
        material={materials.woodH}
      />

      {/* Niski próg aluminiowy z dwiema prowadnicami */}
      <BoxPart
        position={[0, PROFILE.threshold / 2, 0]}
        size={[modelWidth, PROFILE.threshold, PROFILE.frameDepth + 0.03]}
        material={materials.threshold}
      />
      <BoxPart
        position={[0, PROFILE.threshold + 0.006, PROFILE.trackInnerZ]}
        size={[openingWidth, 0.012, 0.014]}
        material={materials.threshold}
      />
      <BoxPart
        position={[0, PROFILE.threshold + 0.006, PROFILE.trackOuterZ]}
        size={[openingWidth, 0.012, 0.014]}
        material={materials.threshold}
      />

      {/* Słupki statyczne (np. schemat G2) */}
      {mullions.map((fraction, index) => (
        <BoxPart
          key={`mullion-${scheme}-${index}`}
          position={[
            -openingWidth / 2 + fraction * openingWidth,
            openingBottom + (openingTop - openingBottom) / 2,
            MULLION.z,
          ]}
          size={[MULLION.width, openingTop - openingBottom, MULLION.depth]}
          material={materials.woodV}
        />
      ))}

      {panels.map((panel, index) => (
        <GlazedPanel
          key={`${scheme}-${index}-${panel.type}`}
          panel={panel}
          openingWidth={openingWidth}
          openingBottom={openingBottom}
          openingTop={openingTop}
          materials={materials}
        />
      ))}
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
  selectedTexture,
  selectedHandleFinish,
  selectedThreshold,
  width,
  height,
  onReady,
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
              texturePath={selectedTexture}
              handleFinish={selectedHandleFinish}
              thresholdType={selectedThreshold}
              width={width}
              height={height}
              onReady={onReady}
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
