import { useEffect, useMemo, useState } from 'react';
import '@google/model-viewer';
import type { WardrobeItem } from '../../types';
import { getAssembledWearableModelUrl } from '../../lib/modelAssembly';

const clothingModels = import.meta.glob('../../assets/model/clothes/*.glb', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const ModelViewer = 'model-viewer' as any;

type WardrobeStudioModelViewerProps = {
  birdUrl: string;
  previewItem: WardrobeItem | null;
  resetViewKey: number;
  modelViewerProps?: Record<string, unknown>;
  style?: React.CSSProperties;
};

export default function WardrobeStudioModelViewer({
  birdUrl,
  previewItem,
  resetViewKey,
  modelViewerProps,
  style,
}: WardrobeStudioModelViewerProps) {
  const wearableUrl = useMemo(() => {
    if (!previewItem?.modelFile) return null;
    return clothingModels[`../../assets/model/clothes/${previewItem.modelFile}`] ?? null;
  }, [previewItem]);

  const [assembledSrc, setAssembledSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setAssembledSrc(null);

    if (!wearableUrl || !previewItem) return () => { active = false; };

    getAssembledWearableModelUrl({
      birdUrl,
      wearableUrl,
      wearableOffset: previewItem.previewOffset,
      wearableRotation: previewItem.previewRotation,
      wearableScale: previewItem.previewScale,
      cacheKey: `wardrobe:${previewItem.id}`,
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
  }, [birdUrl, wearableUrl, previewItem, resetViewKey]);

  const src = wearableUrl ? (assembledSrc || birdUrl) : birdUrl;

  return (
    <ModelViewer
      key={`wardrobe-mv-${resetViewKey}`}
      src={src}
      style={style}
      {...modelViewerProps}
    />
  );
}

