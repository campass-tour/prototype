import { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchContentRef, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { Plus, Minus, Maximize, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';
import mapImage from '@/assets/image/map.png';
import { UserPositionIndicator } from './UserPositionIndicator';
import { MapPin } from '../photo/MapPin';
import { MapOverlayLayer } from './MapOverlayLayer';
import ARModelViewer from '../photo/ARModelViewer';

interface MapViewerProps {
  className?: string;
  initialScale?: number;
}

export function MapViewer({ className, initialScale = 1.2 }: MapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const navigate = useNavigate();

  const [arTarget, setArTarget] = useState<{ id: string, name: string } | null>(null);

  // Fake GPS Data
  const userPosition = {
    x: 45, // from left
    y: 50, // from top
    heading: 105 // test distinct heading
  };

  const updateCSSVars = useCallback((scale: number) => {
    if (imgRef.current && containerRef.current) {
      const naturalWidth = imgRef.current.naturalWidth;
      const naturalHeight = imgRef.current.naturalHeight;
      const scaledWidth = naturalWidth * scale;
      const scaledHeight = naturalHeight * scale;
      const containerRect = containerRef.current.getBoundingClientRect();
      containerRef.current.style.setProperty('--image-width', scaledWidth + 'px');
      containerRef.current.style.setProperty('--image-height', scaledHeight + 'px');
      containerRef.current.style.setProperty('--container-width', containerRect.width + 'px');
      containerRef.current.style.setProperty('--container-height', containerRect.height + 'px');
    }
  }, []);

  useEffect(() => {
    const imgElement = imgRef.current;
    const handleLoad = () => updateCSSVars(initialScale);
    if (imgElement?.complete) {
      handleLoad();
    } else {
      imgElement?.addEventListener('load', handleLoad);
    }
    return () => {
      imgElement?.removeEventListener('load', handleLoad);
    };
  }, [initialScale, updateCSSVars]);

  const centerOnUserMarker = useCallback((
    positionX: number,
    positionY: number,
    scale: number,
    setTransform: ReactZoomPanPinchContentRef['setTransform'],
    animationTime = 500,
  ) => {
    const marker = document.getElementById('user-position-marker');
    const container = containerRef.current;

    if (!marker || !container) {
      return false;
    }

    const markerRect = marker.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const markerCenterX = markerRect.left + markerRect.width / 2;
    const markerCenterY = markerRect.top + markerRect.height / 2;
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    const deltaX = containerCenterX - markerCenterX;
    const deltaY = containerCenterY - markerCenterY;

    setTransform(positionX + deltaX, positionY + deltaY, scale, animationTime, 'easeOut');

    return true;
  }, []);

  const centerUsingTransformRef = useCallback((animationTime = 500) => {
    const ref = transformRef.current;

    if (!ref) {
      return false;
    }

    return centerOnUserMarker(
      ref.state.positionX,
      ref.state.positionY,
      ref.state.scale,
      ref.setTransform,
      animationTime,
    );
  }, [centerOnUserMarker]);

  const handleInit = useCallback((ref: ReactZoomPanPinchRef) => {
    transformRef.current = ref;

    let attempts = 0;
    const maxAttempts = 10;
    const tryCenter = () => {
      const centered = centerUsingTransformRef(500);
      if (!centered && attempts < maxAttempts) {
        attempts += 1;
        setTimeout(tryCenter, 60);
      }
    };

    setTimeout(tryCenter, 0);
  }, [centerUsingTransformRef]);

  return (
    <div ref={containerRef} className={cn("relative w-full bg-[var(--color-surface)] overflow-hidden", className)}>
      <TransformWrapper
        ref={transformRef}
        initialScale={initialScale}
        minScale={1}
        maxScale={5}
        centerOnInit={true}
        limitToBounds={false}
        pinch={{ step: 5 }}
        wheel={{ step: 0.1 }}
        onInit={handleInit}
        onTransformed={(_, state) => updateCSSVars(state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform, instance }) => (
          <>
            <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-2 bg-[var(--color-surface)] p-2 rounded-xl shadow-[var(--shadow-card)] border border-[var(--color-state-disabled)]">
              <button 
                onClick={() => centerOnUserMarker(
                  instance.transformState.positionX,
                  instance.transformState.positionY,
                  instance.transformState.scale,
                  setTransform,
                )} 
                className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-primary)] bg-[var(--color-primary)]/10 transition-colors focus:outline-none"
                aria-label="Locate me"
              >
                <LocateFixed size={22} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => zoomIn()} 
                className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-text-main)] transition-colors focus:outline-none"
                aria-label="Zoom in"
              >
                <Plus size={22} strokeWidth={2.5} />
              </button>
              <div className="w-full h-px bg-[var(--color-state-disabled)]" />
              <button 
                onClick={() => zoomOut()} 
                className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-text-main)] transition-colors focus:outline-none"
                aria-label="Zoom out"
              >
                <Minus size={22} strokeWidth={2.5} />
              </button>
              <div className="w-full h-px bg-[var(--color-state-disabled)]" />
              <button 
                onClick={() => resetTransform()} 
                className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-text-main)] transition-colors focus:outline-none"
                aria-label="Reset zoom"
              >
                <Maximize size={22} strokeWidth={2.5} />
              </button>
            </div>
            
            <TransformComponent 
              wrapperStyle={{ width: "100%", height: "100%" }} 
              contentStyle={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <div 
                className="relative flex items-center justify-center pointer-events-none"
              >
                <img 
                  ref={imgRef}
                  src={mapImage} 
                  alt="Interactive Campus Map" 
                  className="pointer-events-auto select-none max-w-none max-h-none"
                  draggable={false}
                  onLoad={() => {
                    const scale = transformRef.current?.state.scale ?? initialScale;
                    updateCSSVars(scale);
                    setTimeout(() => {
                      centerUsingTransformRef(0);
                    }, 0);
                  }}
                  style={{
                    width: 'var(--image-width)', 
                    height: 'var(--image-height)' 
                  }}
                />
                
                {/* Render pins and markers onto an exact proportional overlay */}
                <MapOverlayLayer>
                  <UserPositionIndicator userPosition={userPosition} />
                  
                  {/* Demo MapPins */}
                  <MapPin
                    id="mystery_building"
                    x={25}
                    y={35}
                    status="locked"
                    buildingName="Mystery Building"
                    hintText="Find this building to unlock its secrets!"
                  />
                  <MapPin
                    id="cb" // Central Building
                    x={35}
                    y={50}
                    status="unlocked"
                    buildingName="CB"
                    buildingIcon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                        <rect x="3" y="4" width="18" height="16" rx="2"/>
                        <path d="M16 2v4"/>
                        <path d="M8 2v4"/>
                        <path d="M3 10h18"/>
                      </svg>
                    }
                    onMessageWallClick={() => navigate('/wall?location=cb')}
                    onEnterAR={(id, name) => setArTarget({ id, name })}
                  />
                </MapOverlayLayer>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      
      <ARModelViewer
        open={!!arTarget}
        onClose={() => setArTarget(null)}
        checkinId={arTarget?.id}
        mascotName={arTarget?.name || 'Mascot'}
      />
    </div>
  );
}