import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import birdModelUrl from '../../assets/model/bird.glb?url';
import type { WardrobeItem } from '../../types';
import WardrobeStudioModelViewer from './WardrobeStudioModelViewer';

type WardrobeStudioStageProps = {
  previewItem: WardrobeItem | null;
  resetViewKey: number;
  onResetView: () => void;
};

export default function WardrobeStudioStage({
  previewItem,
  resetViewKey,
  onResetView,
}: WardrobeStudioStageProps) {
  useEffect(() => {
    // Preload the bird model (model-viewer will also cache after first load).
    // This keeps perceived latency low on mobile.
    void birdModelUrl;
  }, []);

  return (
    <section className="studio-stage-shell overflow-hidden rounded-[var(--radius-card)] border border-[var(--collection-capsule-border)] bg-[var(--collection-capsule-bg)] shadow-[var(--collection-capsule-shadow)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-[var(--wall-divider)] px-5 py-4 text-left md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--collection-progress-kicker)]">
            Bird Fitting Stage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetView}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--collection-capsule-border)] bg-[var(--collection-capsule-bg)] px-4 py-3 text-sm font-semibold text-[var(--color-text-main)]"
          >
            <RotateCcw className="h-4 w-4 text-[var(--color-primary)]" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Mobile: full-width stage, height locked to ~65svh so wardrobe can grow. */}
      <div className="relative h-[65svh] sm:h-[min(60svh,38rem)] lg:h-[min(62svh,44rem)]">
        <div className="absolute inset-x-[14%] bottom-[10%] h-24 rounded-full bg-[var(--collection-progress-track)] blur-3xl" />
        <div className="absolute bottom-8 left-1/2 h-10 w-48 -translate-x-1/2 rounded-full border border-[var(--collection-capsule-border)] bg-[var(--collection-progress-ring-center)] shadow-[var(--collection-capsule-shadow)]" />

        <div className="absolute inset-0 z-10" style={{ perspective: '800px' }}>
          <WardrobeStudioModelViewer
            birdUrl={birdModelUrl}
            previewItem={previewItem}
            resetViewKey={resetViewKey}
            modelViewerProps={{
              'camera-controls': 'true',
              'interaction-prompt': 'none',
              exposure: '1.2',
              'shadow-intensity': '1',
            }}
            style={{ width: '100%', height: '110%', transform: 'translateY(-6%)', outline: 'none' }}
          />
        </div>
      </div>
    </section>
  );
}
