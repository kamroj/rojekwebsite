import React, { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Canvas, useThree } from '@react-three/fiber';
import { Center, Environment, OrbitControls, useGLTF, useTexture, ContactShadows } from '@react-three/drei';
import { RepeatWrapping, SRGBColorSpace, Box3, Vector3, Sphere } from 'three';
import Page from '../components/common/Page';

const ConfiguratorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const ControlPanel = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-width: 400px;
`;

const ControlGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #999;
  }

  &:focus {
    outline: none;
    border-color: #666;
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
`;

const RangeValue = styled.span`
  min-width: 60px;
  text-align: right;
  font-size: 14px;
  color: #666;
`;

const ViewerWrap = styled.div`
  width: 100%;
  height: 90vh;
  background: #fffefe;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TEXTURES = [
  { value: '/models/remmers-natur.jpg', label: 'Natur' },
  { value: '/models/remmers-miodowa-sosna.jpg', label: 'Miodowa Sosna' },
];

// Bazowe wymiary okna
const BASE_WIDTH = 2320; // mm
const BASE_HEIGHT = 2040; // mm

// Funkcja do aktualizacji wymiarów elementów
function updateDimensions(scene, width, height) {
  const widthDiff = width - BASE_WIDTH; // różnica w mm
  const heightDiff = height - BASE_HEIGHT;
  
  // Model jest w skali 1:1 (1 jednostka = 1mm)
  const halfWidthDiff = widthDiff / 2; // każde skrzydło zmienia się o połowę
  
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
    
    // === SZEROKOŚĆ ===
    
    // LEWE SKRZYDŁO (sash-front)
    if (name.includes('sash-front')) {
      if (name.includes('frame-bottom') || name.includes('frame-top')) {
        // Elementy poziome - zwiększamy szerokość i przesuwamy
        // Nowa szerokość = oryginalna szerokość + połowa różnicy
        const originalWidth = origSize.x * origScale.x;
        const newWidth = originalWidth + halfWidthDiff;
        const newScale = newWidth / originalWidth;
        obj.scale.x = origScale.x * newScale;
        
        // Przesuń element tak, aby rozszerzał się tylko w lewo
        // Pivot jest zazwyczaj na środku, więc przesuwamy o połowę zmiany
        obj.position.x = origPos.x - halfWidthDiff / 2;
      } else if (name.includes('frame-left')) {
        // Lewa krawędź - przesuwa się w lewo/prawo o pełną wartość
        obj.position.x = origPos.x - halfWidthDiff;
      } else if (name.includes('frame-right')) {
        // Prawa krawędź (środek okna) - pozostaje na miejscu
        obj.position.x = origPos.x;
      }
    }
    
    // PRAWE SKRZYDŁO (sash-back)
    else if (name.includes('sash-back')) {
      if (name.includes('frame-bottom') || name.includes('frame-top')) {
        // Elementy poziome - zwiększamy szerokość i przesuwamy
        const originalWidth = origSize.x * origScale.x;
        const newWidth = originalWidth + halfWidthDiff;
        const newScale = newWidth / originalWidth;
        obj.scale.x = origScale.x * newScale;
        
        // Przesuń element tak, aby rozszerzał się tylko w prawo
        obj.position.x = origPos.x + halfWidthDiff / 2;
      } else if (name.includes('frame-left')) {
        // Lewa krawędź (środek okna) - pozostaje na miejscu
        obj.position.x = origPos.x;
      } else if (name.includes('frame-right')) {
        // Prawa krawędź - przesuwa się w prawo/lewo o pełną wartość
        obj.position.x = origPos.x + halfWidthDiff;
      }
    }
    
    // KLAMKI (na lewym skrzydle)
    else if (name.includes('cube')) {
      // Klamka przesuwa się razem z lewym skrzydłem
      obj.position.x = origPos.x - halfWidthDiff;
    }
    
    // ZEWNĘTRZNA RAMA
    else if (name.includes('frame') && !name.includes('sash')) {
      if (name.includes('left')) {
        // Lewa rama - przesuwa się w lewo/prawo
        obj.position.x = origPos.x - halfWidthDiff;
      } else if (name.includes('right')) {
        // Prawa rama - przesuwa się w prawo/lewo
        obj.position.x = origPos.x + halfWidthDiff;
      } else if (name.includes('top') || name.includes('bottom')) {
        // Górna i dolna rama - skalują się symetrycznie
        const originalWidth = origSize.x * origScale.x;
        const newWidth = originalWidth + widthDiff;
        const newScale = newWidth / originalWidth;
        obj.scale.x = origScale.x * newScale;
        // Pozostają na środku
        obj.position.x = origPos.x;
      }
    }
    
    // === WYSOKOŚĆ ===
    
    if (name.includes('frame')) {
      // Elementy dolne (bottom) - pozostają na miejscu
      if (name.includes('bottom')) {
        obj.position.y = origPos.y;
      }
      // Elementy górne (top) - przesuwają się o pełną wartość
      else if (name.includes('top')) {
        obj.position.y = origPos.y + heightDiff;
      }
      // Elementy pionowe (left/right) - skalują się i przesuwają
      else if (name.includes('left') || name.includes('right')) {
        const originalHeight = origSize.y * origScale.y;
        const newHeight = originalHeight + heightDiff;
        const newScale = newHeight / originalHeight;
        obj.scale.y = origScale.y * newScale;
        // Przesuwają się o pełną wartość (rozciąganie do góry)
        obj.position.y = origPos.y + heightDiff / 2;
      }
    }
  });
}

function HsModel({ texturePath, width, height, onReady, ...props }) {
  const { scene } = useGLTF('/models/example.glb');
  const texture = useTexture(texturePath);

  const textures = useMemo(() => {
    const base = texture;
    base.wrapS = RepeatWrapping;
    base.wrapT = RepeatWrapping;
    base.colorSpace = SRGBColorSpace;
    base.anisotropy = 8;

    const textureV = base.clone();
    textureV.repeat.set(3, 6);

    const textureH = base.clone();
    textureH.center.set(0.5, 0.5);
    textureH.rotation = Math.PI / 2;
    textureH.repeat.set(6, 3);

    return { textureV, textureH };
  }, [texture]);

  const processed = useMemo(() => {
    const root = scene.clone(true);
    
    // Aplikuj tekstury
    root.traverse((obj) => {
      if (obj.isMesh) {
        const n = (obj.name || '').toLowerCase();
        if (n.includes('frame')) {
          obj.material = obj.material.clone();
          const isVertical = n.includes('left') || n.includes('right');
          const isHorizontal = n.includes('top') || n.includes('bottom');
          const map = isVertical ? textures.textureV : (isHorizontal ? textures.textureH : textures.textureV);
          obj.material.map = map;
          obj.material.color?.set?.('#ffffff');
          obj.material.roughness = obj.material.roughness ?? 0.7;
          obj.material.metalness = obj.material.metalness ?? 0.05;
          obj.material.needsUpdate = true;

          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      }
    });
    
    // Aplikuj wymiary
    updateDimensions(root, width, height);
    
    return root;
  }, [scene, textures, width, height]);

  useEffect(() => {
    onReady?.();
  }, [processed, onReady]);

  return <primitive object={processed} {...props} />;
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

useGLTF.preload('/models/example.glb');
TEXTURES.forEach(tex => useTexture.preload(tex.value));

const HsConfiguratorPage = () => {
  const { t } = useTranslation();
  const modelRef = useRef();
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0].value);
  const [width, setWidth] = useState(BASE_WIDTH);
  const [height, setHeight] = useState(BASE_HEIGHT);

  return (
    <Page
      imageSrc="/images/company/company-top.jpg"
      title={t('hsConfigurator.title', 'Konfigurator HS')}
    >
      <ConfiguratorContainer>
        <ControlPanel>
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
        </ControlPanel>

        <ViewerWrap>
          <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
            <Suspense fallback={null}>
              <color attach="background" args={['#fffefe']} />
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 8]} intensity={1} />
              <Environment preset="city" />
              <OrbitControls makeDefault enablePan enableZoom enableRotate />
              <Center>
                <group ref={modelRef}>
                  <HsModel 
                    texturePath={selectedTexture} 
                    width={width}
                    height={height}
                    onReady={() => {}} 
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