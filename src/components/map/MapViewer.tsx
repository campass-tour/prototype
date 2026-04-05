import { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchContentRef, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { Plus, Minus, Maximize, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';
import mapImage from '@/assets/image/map.svg';
import { UserPositionIndicator } from './UserPositionIndicator';
import { MapPin } from './MapPin';
import { MapOverlayLayer } from './MapOverlayLayer';
import ARModelViewer from '../photo/ARModelViewer';
import { mapPinsData } from '../../constants/mapPinsData';
import { userPosition } from '../../constants/userPositionData';

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

  // 用户位置和Pin点数据已提取到独立文件

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
      containerRef.current.style.setProperty('--map-inv-scale', String(1 / scale));
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
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ background: 'var(--color-map-bg)' }}
    >
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
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%', position: 'relative' }}
            >
              <img
                ref={imgRef}
                src={mapImage}
                alt="Interactive Campus Map"
                className="pointer-events-auto select-none"
                draggable={false}
                onLoad={() => {
                  const scale = transformRef.current?.state.scale ?? initialScale;
                  updateCSSVars(scale);
                  setTimeout(() => {
                    centerUsingTransformRef(0);
                  }, 0);
                }}
                style={{ width: '100%', height: '100%', display: 'block', willChange: 'transform' }}
              />
              {/* Render pins and markers onto an exact proportional overlay */}
              <MapOverlayLayer>
                <UserPositionIndicator userPosition={userPosition} />
                {mapPinsData.map(pin => (
                  <MapPin
                    key={pin.id}
                    {...pin}
                    buildingIcon={
                      pin.id === 'cb' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <rect x="3" y="4" width="18" height="16" rx="2"/>
                          <path d="M16 2v4"/>
                          <path d="M8 2v4"/>
                          <path d="M3 10h18"/>
                        </svg>
                      ) : pin.buildingIcon
                    }
                    onMessageWallClick={pin.id === 'cb' ? () => navigate('/wall?location=cb') : undefined}
                    onEnterAR={pin.id === 'cb' ? (id, name) => setArTarget({ id, name }) : undefined}
                  />
                ))}
              </MapOverlayLayer>
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