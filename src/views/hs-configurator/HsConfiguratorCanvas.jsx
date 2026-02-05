import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  Center,
  ContactShadows,
  Environment,
  OrbitControls,
  useAnimations,
  useGLTF,
  useTexture,
} from '@react-three/drei';

import {
  ACESFilmicToneMapping,
  Box3,
  LinearFilter,
  LinearMipMapLinearFilter,
  LoopOnce,
  RepeatWrapping,
  Sphere,
  SRGBColorSpace,
  Vector3,
} from 'three';

// Bazowe wymiary okna
const BASE_WIDTH = 2320; // mm
const BASE_HEIGHT = 2040; // mm

// Funkcja do aktualizacji wymiarów elementów
function updateDimensions(scene, width, height) {
  const widthDiff = width - BASE_WIDTH;
  const heightDiff = height - BASE_HEIGHT;
  const halfWidthDiff = widthDiff / 2;

  scene.traverse((obj) => {
    if (!obj.isMesh) return;

    const name = obj.name.toLowerCase();

    // Zapisz oryginalne wartości przy pierwszym wywołaniu
    if (!obj.userData.originalPosition) {
      obj.userData.originalPosition = obj.position.clone();
      obj.userData.originalScale = obj.scale.clone();
      obj.userData.originalSize = new Vector3();
      obj.geometry.computeBoundingBox();
      obj.geometry.boundingBox.getSize(obj.userData.originalSize);
    }

    const origPos = obj.userData.originalPosition;
    const origScale = obj.userData.originalScale;
    const origSize = obj.userData.originalSize;

    // LEWE SKRZYDŁO (sash-front)
    if (name.includes('sash-front')) {
      if (name.includes('frame-bottom') || name.includes('frame-top')) {
        const originalWidth = origSize.x * origScale.x;
        const newWidth = originalWidth + halfWidthDiff;
        const newScale = newWidth / originalWidth;
        obj.scale.x = origScale.x * newScale;
        obj.position.x = origPos.x - halfWidthDiff / 2;
      } else if (name.includes('frame-left')) {
        obj.position.x = origPos.x - halfWidthDiff;
      } else if (name.includes('frame-right')) {
        obj.position.x = origPos.x;
      } else if (name.includes('glass')) {
        const originalWidth = origSize.x * origScale.x;
        const newWidth = originalWidth + halfWidthDiff;
        const newScale = newWidth / originalWidth;
        obj.scale.x = origScale.x * newScale;
        obj.position.x = origPos.x - halfWidthDiff / 2;
      }
    }

    // PRAWE SKRZYDŁO (sash-back)
    else if (name.includes('sash-back')) {
      if (name.includes('frame-bottom') || name.includes('frame-top')) {
        const originalWidth = origSize.x * origScale.x;
        const newWidth = originalWidth + halfWidthDiff;
        const newScale = newWidth / originalWidth;
        obj.scale.x = origScale.x * newScale;
        obj.position.x = origPos.x + halfWidthDiff / 2;
      } else if (name.includes('frame-left')) {
        obj.position.x = origPos.x;
      } else if (name.includes('frame-right')) {
        obj.position.x = origPos.x + halfWidthDiff;
      } else if (name.includes('glass')) {
        const originalWidth = origSize.x * origScale.x;
        const newWidth = originalWidth + halfWidthDiff;
        const newScale = newWidth / originalWidth;
        obj.scale.x = origScale.x * newScale;
        obj.position.x = origPos.x + halfWidthDiff / 2;
      }
    }

    // KLAMKI
    else if (name.includes('handle')) {
      obj.position.x = origPos.x - halfWidthDiff;
    }

    // ZEWNĘTRZNA RAMA
    else if ((name.includes('frame') || name.includes('threshold')) && !name.includes('sash')) {
      if (name.includes('left')) {
        obj.position.x = origPos.x - halfWidthDiff;
      } else if (name.includes('right')) {
        obj.position.x = origPos.x + halfWidthDiff;
      } else if (name.includes('top') || name.includes('bottom') || name.includes('threshold')) {
        const originalWidth = origSize.x * origScale.x;
        const newWidth = originalWidth + widthDiff;
        const newScale = newWidth / originalWidth;
        obj.scale.x = origScale.x * newScale;
        obj.position.x = origPos.x;
      }
    }

    // WYSOKOŚĆ
    if (name.includes('glass')) {
      const originalHeight = origSize.y * origScale.y;
      const newHeight = originalHeight + heightDiff;
      const newScale = newHeight / originalHeight;
      obj.scale.y = origScale.y * newScale;
      obj.position.y = origPos.y + heightDiff / 2;
    } else if (name.includes('frame')) {
      if (name.includes('bottom')) {
        obj.position.y = origPos.y;
      } else if (name.includes('top')) {
        obj.position.y = origPos.y + heightDiff;
      } else if (name.includes('left') || name.includes('right')) {
        const originalHeight = origSize.y * origScale.y;
        const newHeight = originalHeight + heightDiff;
        const newScale = newHeight / originalHeight;
        obj.scale.y = origScale.y * newScale;
        obj.position.y = origPos.y + heightDiff / 2;
      }
    }
  });
}

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

function HsModel({
  texturePath,
  handleTexturePath,
  thresholdType,
  width,
  height,
  onReady,
  animationState,
  onAnimationComplete,
  forceCloseAnimation,
  ...props
}) {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/example3.glb');
  const texture = useTexture(texturePath);
  const handleTexture = useTexture(handleTexturePath);
  const { actions, mixer } = useAnimations(animations, group);

  const [lastAnimationState, setLastAnimationState] = useState(null);
  const [_animationFinishedCount, setAnimationFinishedCount] = useState(0);

  // Konfiguracja tekstur
  const textures = useMemo(() => {
    const wood = texture;
    wood.wrapS = RepeatWrapping;
    wood.wrapT = RepeatWrapping;
    wood.colorSpace = SRGBColorSpace;
    wood.anisotropy = 16;
    wood.minFilter = LinearMipMapLinearFilter;
    wood.magFilter = LinearFilter;
    wood.repeat.set(0.2, 0.2);

    const handleTex = handleTexture;
    handleTex.wrapS = RepeatWrapping;
    handleTex.wrapT = RepeatWrapping;
    handleTex.colorSpace = SRGBColorSpace;
    handleTex.anisotropy = 16;
    handleTex.repeat.set(1, 1);

    return {
      wood,
      handleTex,
    };
  }, [texture, handleTexture]);

  const processed = useMemo(() => {
    const root = scene.clone(true);

    root.traverse((obj) => {
      if (!obj.isMesh) return;

      const n = (obj.name || '').toLowerCase();

      // szyba
      if (n.includes('glass')) {
        obj.material = obj.material.clone();
        obj.material.transparent = true;
        obj.material.opacity = 0.3;
        obj.material.color?.set?.('#e8f4f8');
        obj.material.roughness = 0.1;
        obj.material.metalness = 0.9;
        obj.material.envMapIntensity = 1.5;
        obj.material.needsUpdate = true;
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
      // klamka
      else if (n.includes('handle')) {
        obj.material = obj.material.clone();
        obj.material.map = textures.handleTex;
        obj.material.color?.set?.('#ffffff');
        obj.material.roughness = 0.4;
        obj.material.metalness = 0.5;
        obj.material.needsUpdate = true;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
      // próg - osobny materiał metalowy
      else if (n.includes('threshold')) {
        obj.material = obj.material.clone();
        const thresholdMat = getThresholdMaterial(thresholdType);

        obj.material.map = null;
        obj.material.bumpMap = null;
        obj.material.displacementMap = null;

        obj.material.color?.set?.(thresholdMat.color);
        obj.material.roughness = thresholdMat.roughness;
        obj.material.metalness = thresholdMat.metalness;
        obj.material.envMapIntensity = 1.2;

        obj.material.needsUpdate = true;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
      // drewno – rama, skrzydła (bez progu)
      else if (n.includes('frame')) {
        obj.material = obj.material.clone();

        const woodTexture = textures.wood.clone();

        if (n.includes('left') || n.includes('right')) {
          woodTexture.rotation = Math.PI / 2;
          woodTexture.repeat.set(1, 1);
          woodTexture.center.set(0.5, 0.5);
        } else if (n.includes('top') || n.includes('bottom')) {
          woodTexture.rotation = Math.PI / 2;
          woodTexture.repeat.set(1, 1);
        }

        obj.material.map = woodTexture;
        obj.material.color?.set?.('#ffffff');
        obj.material.metalness = 0.0;

        obj.material.bumpMap = woodTexture;
        obj.material.bumpScale = 0.0;

        obj.material.displacementMap = woodTexture;
        obj.material.displacementScale = 0.01;

        obj.material.needsUpdate = true;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    // wymiary
    updateDimensions(root, width, height);

    return root;
  }, [scene, textures, thresholdType, width, height]);

  // Efekt do zamykania animacji gdy wymiary się zmieniają
  useEffect(() => {
    if (forceCloseAnimation && actions) {
      const actionEntries = Object.entries(actions);

      // Zatrzymaj wszystkie animacje i zresetuj do pozycji zamkniętej
      actionEntries.forEach(([_, action]) => {
        action.stop();
        action.reset();
      });

      setLastAnimationState(null);
      setAnimationFinishedCount(0);
    }
  }, [forceCloseAnimation, actions]);

  // Obsługa animacji - tylko gdy wymiary są domyślne
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    if (width !== BASE_WIDTH || height !== BASE_HEIGHT) return; // Blokuj animacje przy zmienionych wymiarach

    const actionEntries = Object.entries(actions);
    const totalAnimations = actionEntries.length;

    let maxDuration = 0;
    actionEntries.forEach(([_, action]) => {
      const duration = action.getClip().duration;
      if (duration > maxDuration) maxDuration = duration;
    });

    if (animationState === 'opening' && lastAnimationState !== 'opening') {
      setAnimationFinishedCount(0);

      actionEntries.forEach(([_, action]) => {
        action.clampWhenFinished = true;
        action.loop = LoopOnce;
        action.reset();
        action.timeScale = 1;
        action.play();
      });

      setLastAnimationState('opening');
    } else if (animationState === 'closing' && lastAnimationState !== 'closing') {
      setAnimationFinishedCount(0);

      actionEntries.forEach(([name, action]) => {
        action.clampWhenFinished = true;
        action.loop = LoopOnce;
        action.reset();

        const clipDuration = action.getClip().duration;

        if (name.toLowerCase().includes('handle') || name.toLowerCase().includes('klamka')) {
          action.time = clipDuration;
          action.timeScale = -1;
          action.paused = false;

          const delay = maxDuration - clipDuration;
          if (delay > 0) {
            action.paused = true;
            setTimeout(() => {
              action.paused = false;
              action.play();
            }, delay * 1000);
          } else {
            action.play();
          }
        } else {
          action.time = clipDuration;
          action.timeScale = -1;
          action.play();
        }
      });

      setLastAnimationState('closing');
    }

    const handleFinished = () => {
      setAnimationFinishedCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= totalAnimations) {
          onAnimationComplete();
          return 0;
        }
        return newCount;
      });
    };

    mixer.addEventListener('finished', handleFinished);

    return () => {
      mixer.removeEventListener('finished', handleFinished);
    };
  }, [animationState, actions, mixer, onAnimationComplete, lastAnimationState, width, height]);

  useEffect(() => {
    onReady?.();
  }, [processed, onReady]);

  return (
    <group ref={group}>
      <primitive object={processed} {...props} />
    </group>
  );
}

function FrontFit({ modelRef }) {
  const controls = useThree((state) => state.controls);
  const { camera, size } = useThree();
  const [fitted, setFitted] = useState(false);

  useEffect(() => {
    if (fitted || !modelRef?.current) return;

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

    setFitted(true);
  }, [modelRef, camera, controls, size, fitted]);

  return null;
}

// Preload (helps avoid hitches on first interaction)
useGLTF.preload('/models/example3.glb');

export default function HsConfiguratorCanvas({
  selectedTexture,
  selectedHandleTexture,
  selectedThreshold,
  width,
  height,
  animationState,
  onAnimationComplete,
  forceCloseAnimation,
  modelResetKey,
}) {
  const modelRef = useRef();

  return (
    <Canvas
      camera={{ position: [3, 2, 4], fov: 45 }}
      gl={{
        logarithmicDepthBuffer: true,
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#fffefe']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 8]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 3, -8]} intensity={0.5} />
        <Environment preset="city" />
        <OrbitControls makeDefault enablePan enableZoom enableRotate />
        <Center>
          <group ref={modelRef}>
            <HsModel
              key={modelResetKey}
              texturePath={selectedTexture}
              handleTexturePath={selectedHandleTexture}
              thresholdType={selectedThreshold}
              width={width}
              height={height}
              animationState={animationState}
              onAnimationComplete={onAnimationComplete}
              forceCloseAnimation={forceCloseAnimation}
              onReady={() => {}}
            />
          </group>
        </Center>
        <FrontFit modelRef={modelRef} />
        <ContactShadows opacity={0.35} blur={2.5} far={10} resolution={256} color="#000000" />
      </Suspense>
    </Canvas>
  );
}
