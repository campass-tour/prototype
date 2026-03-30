import { useEffect, useState } from 'react';
import { Backpack, Map as MapIcon, Sparkles } from 'lucide-react';
import '@google/model-viewer';
import LottieModule from 'lottie-react';

const Lottie = (LottieModule as any).default || LottieModule;
const ModelViewer = 'model-viewer' as any;

// Dynamically load all .glb models in the assets folder
const glbModels = import.meta.glob('../../assets/model/*.glb', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

type CheckInSuccessModalProps = {
  open: boolean;
  onClose: () => void;
  checkinId: string;
  locationName: string;
  mascotName: string;
  current: number;
  total: number;
  onViewCollection?: () => void;
  onEnterAR?: () => void;
};

export default function CheckInSuccessModal({
  open,
  onClose,
  checkinId,
  locationName,
  mascotName,
  current,
  total,
  onViewCollection,
  onEnterAR,
}: CheckInSuccessModalProps) {
  const [lottieData, setLottieData] = useState<any>(null);

  useEffect(() => {
    if (open) {
      fetch('https://assets2.lottiefiles.com/packages/lf20_u4yrau.json')
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then((data) => setLottieData(data))
        .catch((err) => console.log('Lottie load failed, fallback will be used', err));
    }
  }, [open]);

  if (!open) return null;

  const safeTotal = total > 0 ? total : 1;
  const percentage = Math.min((current / safeTotal) * 100, 100);

  // Determine model dynamically. Format: id-model.glb or fallback to default-model.glb
  const targetModelPath = `../../assets/model/${checkinId}-model.glb`;
  const defaultModelPath = '../../assets/model/default-model.glb';
  const modelSrc = glbModels[targetModelPath] || glbModels[defaultModelPath] || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      {lottieData && (
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-70 mix-blend-screen">
          <Lottie animationData={lottieData} loop={true} style={{ width: '150%', height: '150%' }} />
        </div>
      )}

      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-[24px] border border-[var(--color-primary)]/30 bg-[var(--color-surface)]/85 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl animate-in zoom-in-95 duration-500">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-text-main)]/5 text-xl text-[var(--color-text-secondary)] transition hover:bg-[var(--color-text-main)]/10 hover:text-[var(--color-text-main)]"
        >
          ×
        </button>

        <div className="relative mx-auto mb-6 flex h-64 w-full items-center justify-center rounded-2xl bg-[var(--color-primary)]/5 shadow-inner overflow-visible">
          <div className="absolute bottom-4 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-[var(--color-primary)]/20 blur-xl animate-pulse" />
          <div className="absolute bottom-6 left-1/2 h-2 w-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent)]/30 blur-sm" />

          {modelSrc && (
            <div className="absolute inset-0 z-10" style={{ perspective: '800px' }}>
              <ModelViewer
                src={modelSrc}
                auto-rotate="true"
                camera-controls="true"
                disable-zoom="true"
                rotation-per-second="30deg"
                interaction-prompt="none"
                exposure="1.2"
                shadow-intensity="1"
                style={{ width: '100%', height: '120%', transform: 'translateY(-10%)', outline: 'none' }}
              />
            </div>
          )}
        </div>

        <div className="text-center relative z-10">
          <p className="inline-block rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] shadow-sm">
            Discovery Unlocked
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--color-text-main)] drop-shadow-sm">
            {mascotName}
          </h2>

          <p className="mt-2 text-[15px] font-medium text-[var(--color-text-secondary)]">
            You investigated <span className="font-bold text-[var(--color-accent)] drop-shadow-sm">{locationName}</span> and unlocked a new campus mascot!
          </p>
        </div>

        <div className="mt-6 rounded-[16px] bg-[var(--color-background)] p-4 shadow-sm ring-1 ring-[var(--color-state-disabled)]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--color-text-main)]">
              Collection Progress
            </span>
            <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-bold text-white shadow-sm">
              {current} / {total}
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-state-disabled)]">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onEnterAR || onClose}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[var(--color-primary)] px-4 py-4 font-bold text-white shadow-[var(--shadow-card)] transition-all hover:scale-[1.02] hover:opacity-90 cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/20 blur-md pointer-events-none rounded-full top-0 scale-x-150 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="h-5 w-5 animate-pulse text-[var(--color-accent)]" />
            <span className="tracking-wide">Summon in AR</span>
          </button>

          <div className="flex flex-row gap-3">
            <button
              onClick={onViewCollection || onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-[12px] border border-[var(--color-state-disabled)] bg-[var(--color-surface)] px-2 py-3 font-semibold text-[var(--color-text-main)] transition hover:bg-[var(--color-background)] hover:shadow-sm cursor-pointer"
            >
              <Backpack className="h-4 w-4 text-[var(--color-primary)]" />
              <span className="text-sm">View Collection</span>
            </button>
            <button
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-[12px] border border-[var(--color-state-disabled)] bg-[var(--color-surface)] px-2 py-3 font-semibold text-[var(--color-text-main)] transition hover:bg-[var(--color-background)] hover:shadow-sm cursor-pointer"
            >
              <MapIcon className="h-4 w-4 text-[var(--color-primary)]" />
              <span className="text-sm">Return to Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
