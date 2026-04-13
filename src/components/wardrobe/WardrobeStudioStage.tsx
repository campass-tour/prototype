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
    <div className="px-2 md:px-0">
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

      {/* Mobile: full-width stage, height locked to ~40svh so wardrobe can grow and user has scroll space. */}
      <div className="relative h-[40svh] sm:h-[45svh] lg:h-[min(62svh,44rem)]">
        <div className="absolute inset-x-[14%] bottom-[10%] h-20 sm:h-24 rounded-full bg-[var(--collection-progress-track)] blur-3xl opacity-50" />
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 h-8 sm:h-10 w-32 sm:w-48 -translate-x-1/2 rounded-[100%] border border-[var(--collection-capsule-border)] bg-[#3a3b45] opacity-20 shadow-[0_0_20px_10px_rgba(0,0,0,0.5)] lg:bg-[var(--collection-progress-ring-center)] lg:opacity-100 lg:shadow-[var(--collection-capsule-shadow)]" />

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" style={{ perspective: '800px' }}>
          <div className="relative w-full h-[90%] sm:h-[110%] pointer-events-auto">
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
              style={{ width: '100%', height: '100%', transform: 'translateY(-6%)', outline: 'none' }}
            />
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
