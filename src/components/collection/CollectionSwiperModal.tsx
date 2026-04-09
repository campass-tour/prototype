import { useEffect, useRef } from 'react';
import { Backpack, Sparkles } from 'lucide-react';
import '@google/model-viewer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCards, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';
import defaultModelUrl from '../../assets/model/default-model.glb?url';
import { LOCATIONS, getLocationData } from '../../constants/locations';
import { getUnlockedCollectibles } from '../../lib/storage';

const ModelViewer = 'model-viewer' as any;

// Dynamically load all .glb models in the assets folder
const glbModels = import.meta.glob('../../assets/model/*.glb', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

type CollectionSwiperModalProps = {
  open: boolean;
  onClose: () => void;
  initialCheckinId: string;
  onViewCollection?: () => void;
  onEnterAR?: (id: string, mascotName: string) => void;
};

export default function CollectionSwiperModal({
  open,
  onClose,
  initialCheckinId,
  onViewCollection,
  onEnterAR,
}: CollectionSwiperModalProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  
  // We want to show all UNLOCKED items, plus maybe the clicked one if it isn't recorded as unlocked yet
  // though typically it would be recorded right before opening.
  const unlockedData = getUnlockedCollectibles();
  
  // Use map to guarantee we keep the designed order in LOCATIONS, but only for unlocked ones
  let displayList = LOCATIONS.filter(loc => unlockedData[loc.id] || loc.id === initialCheckinId).map(loc => getLocationData(loc.id)!);
  
  // Failsafe in case nothing is found but it's open
  if (displayList.length === 0 && initialCheckinId) {
    const fallback = getLocationData(initialCheckinId);
    if (fallback) displayList = [fallback];
  }

  // Find index of clicked item to start the swiper at the right place
  const initialIndex = displayList.findIndex(item => item.id === initialCheckinId);
  const safeInitialIndex = initialIndex >= 0 ? initialIndex : 0;

  useEffect(() => {
    if (swiperRef.current && open) {
      // Small timeout to allow DOM to render before sliding
      setTimeout(() => {
        swiperRef.current?.slideTo(safeInitialIndex, 0);
      }, 50);
    }
  }, [open, safeInitialIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-300" style={{ zIndex: 'var(--z-overlay)' }}>
      <div className="absolute inset-0" onClick={onClose} />

      {/* Swiper Container */}
      <div className="w-full max-w-sm h-[600px] z-10 flex flex-col justify-center animate-in zoom-in-95 duration-500">
        <Swiper
          effect="cards"
          grabCursor={true}
          keyboard={{
            enabled: true,
          }}
          navigation={true}
          modules={[EffectCards, Navigation, Keyboard]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          initialSlide={safeInitialIndex}
          className="w-full h-[520px]"
        >
          {displayList.map((item) => {
            const modelFile = item.model;
            const targetModelPath = modelFile ? `../../assets/model/${modelFile}` : `../../assets/model/${item.id}-model.glb`;
            const modelSrc = glbModels[targetModelPath] || defaultModelUrl;

            return (
              <SwiperSlide key={item.id} className="flex items-center justify-center">
                <div className="w-full h-full overflow-hidden rounded-[24px] border border-[var(--color-primary)]/30 bg-[var(--color-surface)]/95 shadow-[var(--shadow-card)] backdrop-blur-xl flex flex-col">
                  
                  {/* Close button - only on the top card actually processes click easily, but we put it relative to the wrapping div to be higher z-index anyway */}
                  <div className="flex-1 flex flex-col p-6">
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

                    <div className="text-center relative z-10 flex-1">
                      <p className="inline-block rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] shadow-sm">
                        Collection Profile
                      </p>

                      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--color-text-main)] drop-shadow-sm">
                        {item.mascotName}
                      </h2>

                      <p className="mt-2 text-[15px] font-medium text-[var(--color-text-secondary)]">
                        Located at <span className="font-bold text-[var(--color-accent)] drop-shadow-sm">{item.locationName}</span>
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 pb-2 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEnterAR?.(item.id, item.mascotName); }}
                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[var(--color-primary)] px-4 py-3 font-bold text-white shadow-[var(--shadow-card)] transition-all hover:scale-[1.02] hover:opacity-90 cursor-pointer"
                      >
                        <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                        <span className="tracking-wide">Summon in AR</span>
                      </button>

                      <div className="flex flex-row gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); onViewCollection?.(); }}
                          className="flex flex-1 items-center justify-center gap-2 rounded-[12px] border border-[var(--color-state-disabled)] bg-[var(--color-surface)] px-2 py-2 font-semibold text-[var(--color-text-main)] transition hover:bg-[var(--color-background)] hover:shadow-sm cursor-pointer"
                        >
                          <Backpack className="h-4 w-4 text-[var(--color-primary)]" />
                          <span className="text-sm">View All</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        
        {/* Global Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-2xl text-white transition hover:bg-white/30"
          style={{ zIndex: 'var(--z-modal)' }}
        >
          ×
        </button>
      </div>
      
      {/* CSS Overrides for Swiper UI */}
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          background: rgba(40, 21, 89, 0.4);
          width: 40px !important;
          height: 40px !important;
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 16px !important;
          font-weight: bold;
        }
        .swiper-button-next { right: -15px !important; }
        .swiper-button-prev { left: -15px !important; }
        
        @media (max-width: 450px) {
          .swiper-button-next { right: 5px !important; }
          .swiper-button-prev { left: 5px !important; }
        }
      `}</style>
    </div>
  );
}