import { useEffect, useMemo, useState } from 'react';
import '@google/model-viewer';
import defaultModelUrl from '../../assets/model/default-model.glb?url';
import { getAssembledModelUrl } from '../../lib/modelAssembly';
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

const birdUrl = glbModels['../../assets/model/bird.glb'] || defaultModelUrl;
const ModelViewer = 'model-viewer' as any;

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

type AssembledModelViewerProps = {
  buildingId: string;
  buildingModelFile?: string | null;
  buildingOffset?: [number, number, number] | null;
  className?: string;
  style?: React.CSSProperties;
  modelViewerProps?: Record<string, unknown>;
};

export default function AssembledModelViewer({
  buildingId,
  buildingModelFile,
  buildingOffset,
  className,
  style,
  modelViewerProps,
}: AssembledModelViewerProps) {
  const buildingUrl = useMemo(
    () => resolveBuildingUrl(buildingId, buildingModelFile),
    [buildingId, buildingModelFile]
  );
  const [assembledSrc, setAssembledSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setAssembledSrc(null);

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

    getAssembledModelUrl({
      birdUrl,
      buildingUrl,
      buildingOffset,
      wearables,
      cacheKey: buildingId,
    })
      .then((url) => {
        if (active) setAssembledSrc(url);
      })
      .catch(() => {
        if (active) setAssembledSrc(null);
      });

    return () => {
      active = false;
    };
  }, [buildingId, buildingUrl, buildingOffset]);

  const finalSrc = assembledSrc || buildingUrl || defaultModelUrl;

  return (
    <ModelViewer
      className={className}
      style={style}
      src={finalSrc}
      {...modelViewerProps}
    />
  );
}
