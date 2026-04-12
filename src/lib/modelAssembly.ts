import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

type Offset = [number, number, number];

type AssembleOptions = {
  birdUrl: string;
  buildingUrl: string;
  buildingOffset?: Offset | null;
  cacheKey: string;
};

type AssembleWearableOptions = {
  birdUrl: string;
  wearableUrl: string;
  wearableOffset?: Offset | null;
  wearableRotation?: Offset | null;
  wearableScale?: Offset | null;
  cacheKey: string;
};

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
const exporter = new GLTFExporter();
const assembledModelCache = new Map<string, Promise<string>>();

// Respect Vite base path so decoder files resolve in dev and production.
const decoderBasePath = `${import.meta.env.BASE_URL}draco/`;
dracoLoader.setDecoderPath(decoderBasePath);
dracoLoader.setDecoderConfig({ type: 'wasm' });
loader.setDRACOLoader(dracoLoader);

const normalizeOffset = (offset?: Offset | null): Offset =>
  offset && offset.length === 3 ? offset : [0, 0, 0];

const normalizeScale = (scale?: Offset | null): Offset => {
  if (scale && scale.length === 3) return scale;
  return [1, 1, 1];
};

const loadScene = (url: string) =>
  new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      url,
      (gltf: GLTF) => resolve(gltf.scene),
      undefined,
      (error: unknown) => reject(error)
    );
  });

const exportSceneToUrl = (scene: THREE.Object3D) =>
  new Promise<string>((resolve, reject) => {
    exporter.parse(
      scene,
      (result: ArrayBuffer | object) => {
        try {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: 'model/gltf-binary' });
            resolve(URL.createObjectURL(blob));
            return;
          }
          const blob = new Blob([JSON.stringify(result)], { type: 'model/gltf+json' });
          resolve(URL.createObjectURL(blob));
        } catch (error) {
          reject(error);
        }
      },
      (error: ErrorEvent) => reject(error),
      { binary: true, embedImages: true }
    );
  });

export const getAssembledModelUrl = ({
  birdUrl,
  buildingUrl,
  buildingOffset,
  cacheKey,
}: AssembleOptions) => {
  const offset = normalizeOffset(buildingOffset);
  const key = `${cacheKey}|${birdUrl}|${buildingUrl}|${offset.join(',')}`;
  const cached = assembledModelCache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    const [birdScene, buildingScene] = await Promise.all([
      loadScene(birdUrl),
      loadScene(buildingUrl),
    ]);

    const root = new THREE.Group();
    birdScene.position.set(0, 0, 0);
    buildingScene.position.set(offset[0], offset[1], offset[2]);

    root.add(buildingScene);
    root.add(birdScene);

    return exportSceneToUrl(root);
  })();

  assembledModelCache.set(key, promise);
  return promise;
};

export const getAssembledWearableModelUrl = ({
  birdUrl,
  wearableUrl,
  wearableOffset,
  wearableRotation,
  wearableScale,
  cacheKey,
}: AssembleWearableOptions) => {
  const offset = normalizeOffset(wearableOffset);
  const rotation = normalizeOffset(wearableRotation);
  const scale = normalizeScale(wearableScale);
  const key = `${cacheKey}|${birdUrl}|${wearableUrl}|${offset.join(',')}|${rotation.join(',')}|${scale.join(',')}`;
  const cached = assembledModelCache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    const [birdScene, wearableScene] = await Promise.all([
      loadScene(birdUrl),
      loadScene(wearableUrl),
    ]);

    const root = new THREE.Group();

    // Bird stays at origin. Wearable is placed relative to it.
    birdScene.position.set(0, 0, 0);
    wearableScene.position.set(offset[0], offset[1], offset[2]);
    wearableScene.rotation.set(rotation[0], rotation[1], rotation[2]);
    wearableScene.scale.set(scale[0], scale[1], scale[2]);

    root.add(wearableScene);
    root.add(birdScene);

    return exportSceneToUrl(root);
  })();

  assembledModelCache.set(key, promise);
  return promise;
};
