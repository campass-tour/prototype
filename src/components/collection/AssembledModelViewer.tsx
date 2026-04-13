import { useEffect, useMemo, useState } from 'react';
import '@google/model-viewer';
import { getAssembledModelBlob } from '../../lib/modelAssembly';
import { WARDROBE_ITEMS } from '../../constants/wardrobeCatalog';
import { getWardrobeEquippedBySlot } from '../../lib/wardrobeStudioStorage';

// Dynamically load all .glb models in the assets folder
const glbModels = import.meta.glob('../../assets/model/*.glb', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const clothingModels = import.meta.glob('../../assets/model/clothes/*.glb', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Get first available fallback model
const getDefaultModelUrl = () => {
  const keys = Object.keys(glbModels);
  return keys.length > 0 ? glbModels[keys[0]] : '';
};

const birdUrl = glbModels['../../assets/model/bird.glb'] || getDefaultModelUrl();
const ModelViewer = 'model-viewer' as any;

const resolveBuildingUrl = (buildingId: string, modelFile?: string | null) => {
  const direct = glbModels[`../../assets/model/${buildingId}.glb`];
  if (direct) return direct;

  if (modelFile) {
    const configured = glbModels[`../../assets/model/${modelFile}`];
    if (configured) return configured;
  }

  const legacy = glbModels[`../../assets/model/${buildingId}-model.glb`];
  return legacy || getDefaultModelUrl();
};

const resolveBirdUrl = (birdModelFile?: string | null) => {
  if (birdModelFile) {
    const configured = glbModels[`../../assets/model/${birdModelFile}`];
    if (configured) return configured;
  }
  return birdUrl;
};

type AssembledModelViewerProps = {
  buildingId: string;
  buildingModelFile?: string | null;
  birdModelFile?: string | null;
  buildingOffset?: [number, number, number] | null;
  className?: string;
  style?: React.CSSProperties;
  modelViewerProps?: Record<string, unknown>;
  enabled?: boolean;
};

export default function AssembledModelViewer({
  buildingId,
  buildingModelFile,
  birdModelFile,
  buildingOffset,
  className,
  style,
  modelViewerProps,
  enabled = true,
}: AssembledModelViewerProps) {
  const buildingUrl = useMemo(
    () => resolveBuildingUrl(buildingId, buildingModelFile),
    [buildingId, buildingModelFile]
  );
  const resolvedBirdUrl = useMemo(
    () => resolveBirdUrl(birdModelFile),
    [birdModelFile]
  );
  const [assembledBlob, setAssembledBlob] = useState<Blob | null>(null);
  const [assembledSrc, setAssembledSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setAssembledBlob(null);

    if (!enabled) return () => { active = false; };

    const equippedBySlot = getWardrobeEquippedBySlot();
    const slotPriority = ['head', 'face', 'gear'] as const;
    const wearables = slotPriority
      .map((slot) => equippedBySlot[slot])
      .map((itemId) => (itemId ? WARDROBE_ITEMS.find((item) => item.id === itemId) ?? null : null))
      .filter((item) => item?.modelFile)
      .map((item) => {
        const modelFile = item?.modelFile ?? null;
        const wearableUrl = modelFile
          ? clothingModels[`../../assets/model/clothes/${modelFile}`] ?? null
          : null;
        if (!wearableUrl || !item) return null;
        return {
          wearableUrl,
          wearableOffset: item.previewOffset,
          wearableRotation: item.previewRotation,
          wearableScale: item.previewScale,
        };
      })
      .filter((value): value is NonNullable<typeof value> => value !== null);

    getAssembledModelBlob({
      birdUrl: resolvedBirdUrl,
      buildingUrl,
      buildingOffset,
      wearables,
      cacheKey: buildingId,
    })
      .then((blob: Blob) => {
        if (active) setAssembledBlob(blob);
      })
      .catch(() => {
        if (active) setAssembledBlob(null);
      });

    return () => {
      active = false;
    };
  }, [buildingId, buildingUrl, buildingOffset, resolvedBirdUrl, enabled]);

  useEffect(() => {
    if (!assembledBlob) {
      setAssembledSrc(null);
      return;
    }

    const objectUrl = URL.createObjectURL(assembledBlob);
    setAssembledSrc(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [assembledBlob]);

  const finalSrc = assembledSrc || buildingUrl || getDefaultModelUrl();

  return (
    <ModelViewer
      className={className}
      style={style}
      src={finalSrc}
      loading="lazy"
      {...modelViewerProps}
    />
  );
}
