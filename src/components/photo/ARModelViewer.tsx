import { useState, useEffect, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import '@google/model-viewer';
import ARUnsupportedPrompt from './ARUnsupportedPrompt';
import defaultModelUrl from '../../assets/model/default-model.glb?url';
import { getLocationData } from '../../constants/locations';

// Dynamically load all .glb models in the assets folder
const glbModels = import.meta.glob('../../assets/model/*.glb', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

type ARModelViewerProps = {
  open: boolean;
  onClose: () => void;
  checkinId?: string;
  mascotName?: string;
};

export default function ARModelViewer({
  open,
  onClose,
  checkinId,
  mascotName = 'Mascot',
}: ARModelViewerProps) {
  const [isReady, setIsReady] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    if (!open) return;

    // A simple heuristic for supported AR environments
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /ipad|iphone|ipod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/i.test(userAgent);
    const isMobile = isIOS || isAndroid;

    // Delay check slightly to let model-viewer initialize
    const timer = setTimeout(() => {
      // Use native model-viewer capability if possible
      const mv = modelViewerRef.current;
      const mvSupportsAR = mv && 'canActivateAR' in mv ? mv.canActivateAR : true;
      
      // Fallback check: Mobile required + WebXR or iOS
      const fallbackSupport = isMobile && (isIOS || 'xr' in navigator);
      
      setIsSupported(mvSupportsAR && fallbackSupport);
      setIsReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  // Determine model dynamically using unified assets mapping
  const locData = checkinId ? getLocationData(checkinId) : null;
  const modelFile = locData?.model;
  let modelSrc = defaultModelUrl;
  if (modelFile) {
    const path = `../../assets/model/${modelFile}`;
    modelSrc = glbModels[path] || defaultModelUrl;
  } else if (checkinId) {
    const fallbackPath = `../../assets/model/${checkinId}-model.glb`;
    modelSrc = glbModels[fallbackPath] || defaultModelUrl;
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--color-background)] animate-in fade-in duration-300" style={{ zIndex: 'var(--z-overlay)' }}>
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 flex h-16 items-center justify-between px-4 bg-gradient-to-b from-black/50 to-transparent" style={{ zIndex: 'var(--z-overlay)' }}>
        <h2 className="text-lg font-bold text-white drop-shadow-md">
          {mascotName} AR
        </h2>
            <button
          onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition hover:bg-white/30 active:scale-95"
              style={{ zIndex: 'var(--z-overlay)' }}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {!isReady ? (
        <div className="flex items-center justify-center h-full w-full">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
        </div>
      ) : !isSupported ? (
        <ARUnsupportedPrompt />
      ) : (
        <div className="relative w-full h-full flex-1">
          {/* @ts-expect-error: model-viewer is a custom web component not recognized by TypeScript */}
          <model-viewer
            ref={modelViewerRef}
            src={modelSrc}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-background)' }}
            alt={`A 3D model of ${mascotName}`}
          >
            {/* Custom styled AR Button replacing the default one */}
            <button
              slot="ar-button"
              className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white shadow-[var(--shadow-floating)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              style={{ zIndex: 'var(--z-overlay)' }}
            >
              <Camera className="h-5 w-5 text-[var(--color-accent)]" />
              <span>Start AR</span>
            </button>
          {/* @ts-expect-error: model-viewer is a custom web component not recognized by TypeScript */}
          </model-viewer>
        </div>
      )}
    </div>
  );
}
