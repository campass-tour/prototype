import { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { Plus, Minus, Maximize, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';
import mapImage from '@/assets/image/map.svg';
import { UserPositionIndicator } from './UserPositionIndicator';
import { MapPin } from './MapPin';
import { MapOverlayLayer } from './MapOverlayLayer';
import ARModelViewer from '../photo/ARModelViewer';
import { LOCATIONS } from '../../constants/locations';
import { userPosition } from '../../constants/userPositionData';
import { getMarkerAndContainerCenters } from './getMarkerAndContainerCenters';
import { isCollectibleUnlocked } from '../../lib/storage';

interface MapViewerProps {
  className?: string;
  initialScale?: number;
}

export function MapViewer({ className, initialScale = 0.5 }: MapViewerProps) {
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

  const centerOnUserMarker = useCallback(
    (
      positionX: number,
      positionY: number,
      scale: number,
      setTransform: (x: number, y: number, scale: number, animationTime?: number, animationType?: "linear" | "easeOut" | "easeInQuad" | "easeOutQuad" | "easeInOutQuad" | "easeInCubic" | "easeOutCubic" | "easeInOutCubic" | "easeInQuart" | "easeOutQuart" | "easeInOutQuart" | "easeInQuint" | "easeOutQuint" | "easeInOutQuint") => void,
      animationTime = 500
    ) => {
      const centers = getMarkerAndContainerCenters('user-position-marker', containerRef.current);
      if (!centers) return false;
      const { markerCenterX, markerCenterY, containerCenterX, containerCenterY } = centers;
      const deltaX = containerCenterX - markerCenterX;
      const deltaY = containerCenterY - markerCenterY;
      setTransform(positionX + deltaX, positionY + deltaY, scale, animationTime, 'easeOut');
      return true;
    },
    []
  );

  const centerUsingTransformRef = useCallback((animationTime = 500) => {
    const ref = transformRef.current;

    if (!ref) {
      return false;
    }

    const { positionX, positionY, scale } = ref.state;

    return centerOnUserMarker(
      positionX,
      positionY,
      scale,
      ref.setTransform,
      animationTime,
    );
  }, [centerOnUserMarker]);

  const handleTransformInit = useCallback((ref: ReactZoomPanPinchRef) => {
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
        minScale={0.15}
        maxScale={5}
        centerOnInit={true}
        limitToBounds={false}
        pinch={{ step: 5 }}
        wheel={{ step: 0.1 }}
        onInit={handleTransformInit}
        onTransformed={(_, state) => updateCSSVars(state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
          <>
            <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-2 bg-(--color-surface) p-2 rounded-xl shadow-(--shadow-card) border border-(--color-state-disabled)">
              <button 
                onClick={() => centerOnUserMarker(
                  transformRef.current?.state.positionX ?? 0,
                  transformRef.current?.state.positionY ?? 0,
                  transformRef.current?.state.scale ?? initialScale,
                  setTransform,
                )} 
                className="p-2 rounded-lg hover:bg-(--color-background) text-(--color-primary) bg-primary/10 transition-colors focus:outline-none"
                aria-label="Locate me"
              >
                <LocateFixed size={22} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => zoomIn()} 
                className="p-2 rounded-lg hover:bg-(--color-background) text-(--color-text-main) transition-colors focus:outline-none"
                aria-label="Zoom in"
              >
                <Plus size={22} strokeWidth={2.5} />
              </button>
              <div className="w-full h-px bg-(--color-state-disabled)" />
              <button 
                onClick={() => zoomOut()} 
                className="p-2 rounded-lg hover:bg-(--color-background) text-(--color-text-main) transition-colors focus:outline-none"
                aria-label="Zoom out"
              >
                <Minus size={22} strokeWidth={2.5} />
              </button>
              <div className="w-full h-px bg-(--color-state-disabled)" />
              <button 
                onClick={() => resetTransform()} 
                className="p-2 rounded-lg hover:bg-(--color-background) text-(--color-text-main) transition-colors focus:outline-none"
                aria-label="Reset zoom"
              >
                <Maximize size={22} strokeWidth={2.5} />
              </button>
            </div>
            
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <div className="relative pointer-events-none" style={{ display: 'inline-flex' }}>
                <img
                  ref={imgRef}
                  src={mapImage}
                  alt="Interactive Campus Map"
                  className="pointer-events-auto select-none max-w-none"
                  draggable={false}
                  onLoad={() => {
                    const scale = transformRef.current?.state.scale ?? initialScale;
                    updateCSSVars(scale);
                    // 先居中用户箭头，再做其它逻辑
                    setTimeout(() => {
                      centerUsingTransformRef(500);
                    }, 0);
                  }}
                  style={{ display: 'block', willChange: 'transform' }}
                />
                {/* Render pins and markers onto an exact proportional overlay */}
                <MapOverlayLayer>
                  <UserPositionIndicator userPosition={userPosition} />
                  {LOCATIONS.map(location => {
                    const isUnlocked = isCollectibleUnlocked(location.id);
                    return (
                      <MapPin
                        key={location.id}
                        id={location.id}
                        x={location.x}
                        y={location.y}
                        status={isUnlocked ? 'unlocked' : 'locked'}
                        buildingName={location.name}
                        buildingIcon={
                          location.id === 'cb' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                              <rect x="3" y="4" width="18" height="16" rx="2"/>
                              <path d="M16 2v4"/>
                              <path d="M8 2v4"/>
                              <path d="M3 10h18"/>
                            </svg>
                          ) : undefined
                        }
                        hintText={isUnlocked ? undefined : `Find this ${location.name} to unlock its secrets!`}
                        onMessageWallClick={() => navigate(`/wall?location=${location.id}`)}
                        onEnterAR={(id, name) => setArTarget({ id, name })}
                      />
                    );
                  })}
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
