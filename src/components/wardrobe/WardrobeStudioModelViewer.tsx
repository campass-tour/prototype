import { useEffect, useMemo, useState } from 'react';
import '@google/model-viewer';
import type { WardrobeItem } from '../../types';
import { getAssembledWearablesModelBlob } from '../../lib/modelAssembly';

const clothingModels = import.meta.glob('../../assets/model/clothes/*.glb', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const ModelViewer = 'model-viewer' as any;

type WardrobeStudioModelViewerProps = {
  birdUrl: string;
  previewItems: WardrobeItem[];
  resetViewKey: number;
  modelViewerProps?: Record<string, unknown>;
  style?: React.CSSProperties;
};

export default function WardrobeStudioModelViewer({
  birdUrl,
  previewItems,
  resetViewKey,
  modelViewerProps,
  style,
}: WardrobeStudioModelViewerProps) {
  const wearables = useMemo(
    () =>
      previewItems
        .map((item) => {
          if (!item.modelFile) return null;
          const wearableUrl = clothingModels[`../../assets/model/clothes/${item.modelFile}`] ?? null;
          if (!wearableUrl) return null;
          return {
            id: item.id,
            wearableUrl,
            wearableOffset: item.previewOffset,
            wearableRotation: item.previewRotation,
            wearableScale: item.previewScale,
          };
        })
        .filter((wearable): wearable is NonNullable<typeof wearable> => wearable !== null),
    [previewItems]
  );

  const [assembledBlob, setAssembledBlob] = useState<Blob | null>(null);
  const [assembledSrc, setAssembledSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setAssembledBlob(null);

    if (wearables.length === 0) {
      return () => {
        active = false;
      };
    }

    getAssembledWearablesModelBlob({
      birdUrl,
      wearables,
      cacheKey: `wardrobe:${wearables.map((wearable) => wearable.id).join(',')}`,
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
  }, [birdUrl, wearables, resetViewKey]);

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

  const src = wearables.length > 0 ? (assembledSrc || birdUrl) : birdUrl;

  return (
    <ModelViewer
      key={`wardrobe-mv-${resetViewKey}`}
      src={src}
      style={style}
      loading="lazy"
      {...modelViewerProps}
    />
  );
}
