import { useEffect, useMemo, useState } from 'react';
import '@google/model-viewer';
import type { WardrobeItem } from '../../types';
import { getAssembledWearableModelBlob } from '../../lib/modelAssembly';

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

  const [assembledBlob, setAssembledBlob] = useState<Blob | null>(null);
  const [assembledSrc, setAssembledSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setAssembledBlob(null);

    if (!wearableUrl || !previewItem) return () => { active = false; };

    getAssembledWearableModelBlob({
      birdUrl,
      wearableUrl,
      wearableOffset: previewItem.previewOffset,
      wearableRotation: previewItem.previewRotation,
      wearableScale: previewItem.previewScale,
      cacheKey: `wardrobe:${previewItem.id}`,
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
  }, [birdUrl, wearableUrl, previewItem, resetViewKey]);

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

  const src = wearableUrl ? (assembledSrc || birdUrl) : birdUrl;

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
