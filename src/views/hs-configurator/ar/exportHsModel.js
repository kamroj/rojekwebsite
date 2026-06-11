// Eksport proceduralnego modelu HS z żywej sceny R3F do formatów AR:
// GLB (model-viewer / WebXR na Androidzie) i USDZ (AR Quick Look na iOS).
// Model budowany jest w metrach, więc skala 1:1 w AR wychodzi bez przeliczeń;
// domyślne kotwiczenie USDZExportera to płaszczyzna pozioma (podłoga).
// Moduł ładowany wyłącznie dynamicznym import() z ArLaunchera — statyczne
// importy eksporterów nie trafiają do eagerowego bundla konfiguratora.

import { Box3, Group, MeshStandardMaterial } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter.js';

// Szyba do AR: USDZExporter po cichu gubi `transmission` (szkło stałoby się
// nieprzezroczyste), więc na klonie podmieniamy je na zwykłą przezroczystość
const createArGlassMaterial = () =>
  new MeshStandardMaterial({
    color: '#dfeeec',
    roughness: 0.08,
    metalness: 0,
    transparent: true,
    opacity: 0.35,
  });

// Klon modelu znormalizowany do eksportu: stan zamknięty, spód na y=0,
// wyśrodkowany na x/z. Klon współdzieli geometrie i materiały z żywą sceną —
// wolno tylko podmieniać `mesh.material`, nigdy mutować właściwości materiałów.
export function prepareModelForExport(source) {
  const clone = source.clone(true);

  // Zrzuć offset prezentacyjny grupy ([0, -h/2, 0]) — pozycję ustali Box3 niżej
  clone.position.set(0, 0, 0);
  clone.rotation.set(0, 0, 0);
  clone.scale.set(1, 1, 1);

  clone.traverse((object) => {
    // Domknięcie skrzydeł i klamek niezależnie od stanu animacji w konfiguratorze
    if (object.userData?.hsSash) {
      object.position.x = 0;
      object.position.y = 0;
    }
    if (object.userData?.hsLever) {
      object.rotation.z = 0;
    }

    if (object.isMesh && object.material) {
      if (object.material.transmission > 0) {
        object.material = createArGlassMaterial();
      } else if (object.material.map && !object.material.map.userData.mimeType) {
        // GLTFExporter osadzi oryginalny JPEG zamiast re-enkodować do PNG
        object.material.map.userData.mimeType = 'image/jpeg';
      }
    }
  });

  clone.updateMatrixWorld(true);
  const box = new Box3().setFromObject(clone);
  const root = new Group();
  root.add(clone);
  clone.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
  return root;
}

export async function exportGlb(root) {
  const buffer = await new GLTFExporter().parseAsync(root, { binary: true });
  return new Blob([buffer], { type: 'model/gltf-binary' });
}

export async function exportUsdz(root) {
  const buffer = await new USDZExporter().parseAsync(root, {
    quickLookCompatible: true,
    maxTextureSize: 1024,
  });
  return new Blob([buffer], { type: 'model/vnd.usdz+zip' });
}
