import React, { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Canvas, useThree } from '@react-three/fiber';
import { Center, Environment, OrbitControls, useGLTF, useTexture, ContactShadows, useAnimations } from '@react-three/drei';
import { RepeatWrapping, SRGBColorSpace, Box3, Vector3, Sphere, LoopOnce } from 'three';
import * as THREE from 'three';
import Page from '../components/ui/Page';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomeView';

const ConfiguratorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ControlPanel = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  gap: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const ControlSection = styled.div`
  flex: 1;
  padding: 24px;
  
  &:first-child {
    border-right: 1px solid #e0e0e0;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      border-right: none;
      border-bottom: 1px solid #e0e0e0;
    }
  }
`;

const SectionHeader = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #0041074e;
  letter-spacing: 0.5px;
`;

const ControlGroup = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #015508;
    background: #fafafa;
  }

  &:focus {
    outline: none;
    border-color: #015508;
    box-shadow: 0 0 0 3px rgba(1, 85, 8, 0.1);
  }
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RangeInput = styled.input`
  flex: 1;
  cursor: pointer;
  height: 6px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    border: none;
  }
  
  &::-moz-range-track {
    width: 100%;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    border: none;
  }
  
  &::-ms-track {
    width: 100%;
    height: 4px;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  
  &::-ms-fill-lower {
    background: #e0e0e0;
    border-radius: 2px;
  }
  
  &::-ms-fill-upper {
    background: #e0e0e0;
    border-radius: 2px;
  }
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #013a06;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    margin-top: -8px;
    transition: all 0.15s ease-in-out;
    
    &:hover {
      transform: scale(1.1);
      background: #015508;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  &::-moz-range-thumb {
    -moz-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #013a06;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    
    &:hover {
      transform: scale(1.1);
      background: #015508;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  &::-ms-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #013a06;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    margin-top: 0;
    transition: all 0.15s ease-in-out;
    
    &:hover {
      transform: scale(1.1);
      background: #015508;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  &:focus::-webkit-slider-runnable-track {
    background: #e0e0e0;
  }
  
  @supports not ((-webkit-appearance: none) or (-moz-appearance: none)) {
    height: 20px;
    background: #e0e0e0;
    border-radius: 10px;
  }
`;

const RangeValue = styled.span`
  min-width: 60px;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
`;

const ViewerWrap = styled.div`
  position: relative;
  width: 100%;
  height: 90vh;
  background: #fffefe;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  margin-bottom: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 60vh; 
  }
`;

const PreviewLabel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: ${({ contentColor }) => contentColor || '#f8f9fa'};
  background-color: ${({ contentBg }) => contentBg || '#66590f5e'};
  border: 1px solid #e6c7197d;
  padding: 6px 12px;
  border-radius: 4px;
  backdrop-filter: blur(3px);
  pointer-events: none;
  user-select: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 12px;
    padding: 4px 10px;
    top: 15px;
    left: 15px;
  }
`;

export const AnimationButton = styled.button`
  position: absolute;
  line-height: 1.6;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  padding: 6px 12px;
  background: ${({ disabled, isReset }) =>
    disabled ? '#ccccccab' :
      isReset ? '#362f9ebb' :
        '#013a06bd'
  };
  color: ${({ disabled }) => (disabled ? '#000000a8' : '#f8f9fa')};
  border: 1px solid ${({ disabled, isReset }) =>
    disabled ? '#909090' :
      isReset ? '#0c065cba' :
        '#01790bb2'
  };  
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(3px);
  transition: all 0.3s ease;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ disabled, isReset }) =>
    disabled ? '#ccccccab' :
      isReset ? '#d47300' :
        '#013a06'
  };
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ isReset }) => isReset ? '#ff8c00' : '#01790b'};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    bottom: 15px;
    right: 15px;
    padding: 4px 10px;
    font-size: 12px;
  }
`;

const DimensionWarning = styled.div`
  position: absolute;
  right: 20px;
  bottom: 64px; /* nad przyciskiem (który ma bottom: 20px) */
  z-index: 10;
  font-size: 11px;
  color: #666;
  font-style: italic;
  pointer-events: none;
  user-select: none;
  max-width: 320px;
  text-align: right;
  line-height: 1.3;

  &:before {
    content: '*';
    color: #0c065cba;
    font-weight: bold;
    margin-right: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    right: 15px;
    bottom: 52px; /* nad przyciskiem, który w mobile ma bottom: 15px */
    font-size: 10px;
    max-width: 200px;
  }
`;

const TEXTURES = [
  { value: '/models/remmers-natur.jpg', label: 'Natur' },
  { value: '/models/remmers-miodowa-sosna.jpg', label: 'Miodowa Sosna' },
];

const HANDLE_TEXTURES = [
  { value: '/models/textures/handle/hang-silver.jpg', label: 'Srebrna' },
  { value: '/models/textures/handle/hang-gold.jpg', label: 'Złota' },
];

const TYPES = [
  { value: 'a', label: 'A' },
];

const THRESHOLDS = [
  { value: 'silver', label: 'Srebrny' },
  { value: 'black', label: 'Czarny' },
  { value: 'gold', label: 'Złoty' },
];

// Bazowe wymiary okna
const BASE_WIDTH = 2320; // mm
const BASE_HEIGHT = 2040; // mm;

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
    }
    else if (name.includes('frame')) {
      if (name.includes('bottom')) {
        obj.position.y = origPos.y;
      }
      else if (name.includes('top')) {
        obj.position.y = origPos.y + heightDiff;
      }
      else if (name.includes('left') || name.includes('right')) {
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
    color: '#8c8c8c'
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
  const [animationFinishedCount, setAnimationFinishedCount] = useState(0);

  // Konfiguracja tekstur
  const textures = useMemo(() => {
    const wood = texture;
    wood.wrapS = RepeatWrapping;
    wood.wrapT = RepeatWrapping;
    wood.colorSpace = SRGBColorSpace;
    wood.anisotropy = 16;
    wood.minFilter = THREE.LinearMipMapLinearFilter;
    wood.magFilter = THREE.LinearFilter;
    wood.repeat.set(0.2, 0.2);

    const handleTex = handleTexture;
    handleTex.wrapS = RepeatWrapping;
    handleTex.wrapT = RepeatWrapping;
    handleTex.colorSpace = SRGBColorSpace;
    handleTex.anisotropy = 16;
    handleTex.repeat.set(1, 1);

    return {
      wood,
      handleTex
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
      setAnimationFinishedCount(prev => {
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
    let radius = Number.isFinite(sphere.radius) && sphere.radius > 0 ? sphere.radius : Math.max(boxSize.x, boxSize.y, boxSize.z) / 2 || 1;

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

// Preload
useGLTF.preload('/models/example3.glb');
TEXTURES.forEach(tex => useTexture.preload(tex.value));
HANDLE_TEXTURES.forEach(tex => useTexture.preload(tex.value));

const HsConfiguratorPage = () => {
  const { t } = useTranslation();
  const modelRef = useRef();
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0].value);
  const [selectedHandleTexture, setSelectedHandleTexture] = useState(HANDLE_TEXTURES[0].value);
  const [selectedType, setSelectedType] = useState(TYPES[0].value);
  const [selectedThreshold, setSelectedThreshold] = useState(THRESHOLDS[0].value);
  const [width, setWidth] = useState(BASE_WIDTH);
  const [height, setHeight] = useState(BASE_HEIGHT);

  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationState, setAnimationState] = useState(null);
  const [forceCloseAnimation, setForceCloseAnimation] = useState(false);

  const [modelResetKey, setModelResetKey] = useState(0); // NEW – klucz do remountu HsModel

  // Sprawdź czy wymiary są domyślne
  const hasDefaultDimensions = width === BASE_WIDTH && height === BASE_HEIGHT;

  const handleAnimationToggle = () => {
    // Jeśli wymiary nie są domyślne – reset do bazowych i pełny reset modelu
    if (!hasDefaultDimensions) {
      setWidth(BASE_WIDTH);
      setHeight(BASE_HEIGHT);

      // pełny reset stanu animacji po stronie konfiguratora
      setIsOpen(false);
      setIsAnimating(false);
      setAnimationState(null);
      setForceCloseAnimation(false);

      // wymuś pełny remount HsModel, żeby wyczyścić lastAnimationState / mixer itd.
      setModelResetKey((k) => k + 1); // NEW

      return;
    }

    // Normalna obsługa animacji tylko przy domyślnych wymiarach
    if (isAnimating) return;
    setIsAnimating(true);
    if (!isOpen) setAnimationState('opening');
    else setAnimationState('closing');
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setIsOpen(!isOpen);
    setAnimationState(null);
  };

  // Obsługa zmiany wymiarów – gdy w trakcie animacji zmienisz wymiary, wymuś zamknięcie
  useEffect(() => {
    if (!hasDefaultDimensions) {
      if (isOpen || isAnimating) {
        setForceCloseAnimation(true);
        setIsOpen(false);
        setIsAnimating(false);
        setAnimationState(null);

        setTimeout(() => setForceCloseAnimation(false), 100);
      }
    }
  }, [width, height, hasDefaultDimensions, isOpen, isAnimating]);

  return (
    <Page
      imageSrc="/images/hs/top.jpg"
      title={t('hsConfigurator.title', 'Konfigurator HS')}
    >
      <HeaderWrap>
        <ProductHeader>
          {t('hsConfigurator.header', 'Konfigurator HS')}
        </ProductHeader>
        <ProductHeaderSubtitle>
          {t('hsConfigurator.subtitle', 'Stwórz swoje wymarzone okno przesuwne')}
        </ProductHeaderSubtitle>
      </HeaderWrap>
      <ConfiguratorContainer>
        <ControlPanel>
          <ControlSection>
            <SectionHeader>Elementy</SectionHeader>
            <ControlGroup>
              <Label>Materiał ramy:</Label>
              <Select
                value={selectedTexture}
                onChange={(e) => setSelectedTexture(e.target.value)}
              >
                {TEXTURES.map((tex) => (
                  <option key={tex.value} value={tex.value}>
                    {tex.label}
                  </option>
                ))}
              </Select>
            </ControlGroup>

            <ControlGroup>
              <Label>Kolor klamki:</Label>
              <Select
                value={selectedHandleTexture}
                onChange={(e) => setSelectedHandleTexture(e.target.value)}
              >
                {HANDLE_TEXTURES.map((tex) => (
                  <option key={tex.value} value={tex.value}>
                    {tex.label}
                  </option>
                ))}
              </Select>
            </ControlGroup>

            <ControlGroup>
              <Label>Typ:</Label>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </ControlGroup>

            <ControlGroup>
              <Label>Kolor progu:</Label>
              <Select
                value={selectedThreshold}
                onChange={(e) => setSelectedThreshold(e.target.value)}
              >
                {THRESHOLDS.map((threshold) => (
                  <option key={threshold.value} value={threshold.value}>
                    {threshold.label}
                  </option>
                ))}
              </Select>
            </ControlGroup>
          </ControlSection>

          <ControlSection>
            <SectionHeader>Wymiary</SectionHeader>
            <ControlGroup>
              <Label>Szerokość okna:</Label>
              <RangeContainer>
                <RangeInput
                  type="range"
                  min="2000"
                  max="4000"
                  step="10"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
                <RangeValue>{width} mm</RangeValue>
              </RangeContainer>
            </ControlGroup>

            <ControlGroup>
              <Label>Wysokość okna:</Label>
              <RangeContainer>
                <RangeInput
                  type="range"
                  min="2000"
                  max="3000"
                  step="10"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
                <RangeValue>{height} mm</RangeValue>
              </RangeContainer>
            </ControlGroup>
          </ControlSection>
        </ControlPanel>

        <ViewerWrap>
          <PreviewLabel>PODGLĄD</PreviewLabel>
          {!hasDefaultDimensions && (
            <DimensionWarning>
              Animacja dostępna tylko przy domyślnych wymiarach
            </DimensionWarning>
          )}
          <AnimationButton
            onClick={handleAnimationToggle}
            disabled={isAnimating}
            isReset={!hasDefaultDimensions}
          >
            {!hasDefaultDimensions ? 'RESETUJ WYMIARY' : (isOpen ? 'ZAMKNIJ' : 'OTWÓRZ')}
          </AnimationButton>
          <Canvas
            camera={{ position: [3, 2, 4], fov: 45 }}
            gl={{
              logarithmicDepthBuffer: true,
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2
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
                    key={modelResetKey} // NEW – wymusza remount po resecie wymiarów
                    texturePath={selectedTexture}
                    handleTexturePath={selectedHandleTexture}
                    thresholdType={selectedThreshold}
                    width={width}
                    height={height}
                    animationState={animationState}
                    onAnimationComplete={handleAnimationComplete}
                    forceCloseAnimation={forceCloseAnimation}
                    onReady={() => { }}
                  />
                </group>
              </Center>
              <FrontFit modelRef={modelRef} />
              <ContactShadows opacity={0.35} blur={2.5} far={10} resolution={256} color="#000000" />
            </Suspense>
          </Canvas>
        </ViewerWrap>
      </ConfiguratorContainer>
    </Page>
  );
};

export default HsConfiguratorPage;
