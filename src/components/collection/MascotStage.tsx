import { Suspense, useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, OrbitControls, useGLTF } from '@react-three/drei';
import defaultModelUrl from '../../assets/model/default-model.glb?url';

// Dynamically load all .glb models in the assets folder
const glbModels = import.meta.glob('../../assets/model/*.glb', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const birdUrl = glbModels['../../assets/model/bird.glb'] || defaultModelUrl;

const resolveBuildingUrl = (buildingId: string, modelFile?: string | null) => {
  const direct = glbModels[`../../assets/model/${buildingId}.glb`];
  if (direct) return direct;

  if (modelFile) {
    const configured = glbModels[`../../assets/model/${modelFile}`];
    if (configured) return configured;
  }

  const legacy = glbModels[`../../assets/model/${buildingId}-model.glb`];
  return legacy || defaultModelUrl;
};

const MeshModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url) as { scene: any };

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child?.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
};

type MascotStageProps = {
  buildingId: string;
  buildingModelFile?: string | null;
  anchorPoint?: [number, number, number] | null;
  className?: string;
  style?: CSSProperties;
};

export default function MascotStage({
  buildingId,
  buildingModelFile,
  anchorPoint,
  className,
  style,
}: MascotStageProps) {
  const birdPosition = useMemo<[number, number, number]>(
    () => (anchorPoint && anchorPoint.length === 3 ? anchorPoint : [0, 0, 0]),
    [anchorPoint]
  );
  const buildingUrl = useMemo(
    () => resolveBuildingUrl(buildingId, buildingModelFile),
    [buildingId, buildingModelFile]
  );

  useEffect(() => {
    useGLTF.preload(buildingUrl);
    useGLTF.preload(birdUrl);
  }, [buildingUrl]);

  return (
    <Canvas
      className={className}
      style={style}
      dpr={[1, 2]}
      shadows
      camera={{ position: [0, 1.2, 3.2], fov: 40 }}
    >
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow />

      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.2}>
          <group>
            <MeshModel url={buildingUrl} />
            <group position={birdPosition}>
              <MeshModel url={birdUrl} />
            </group>
          </group>
        </Bounds>
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.1}
      />
    </Canvas>
  );
}
