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
import MapFilter from './MapFilter';
import ARModelViewer from '../photo/ARModelViewer';
import { LOCATIONS } from '../../constants/locations';
import { userPosition as staticUserPosition } from '../../constants/userPositionData';
import { convertGpsToImageCoordinates } from '../../lib/mapConverter';
// import { getMarkerAndContainerCenters } from './getMarkerAndContainerCenters';
import { isCollectibleUnlocked } from '../../lib/storage';
import { centerMarkerInContainer } from '../../lib/mapUtils';
import type { TransformAnimationType } from '../../lib/mapUtils';
import { SideDrawer } from '../common/SideDrawer';
import WallContent from './WallContent';

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
  const [selectedLevels, setSelectedLevels] = useState<number[] | null>(null);
  const [activeDrawerLocation, setActiveDrawerLocation] = useState<string | null>(null);
  const availableLevels = Array.from(new Set(LOCATIONS.map(l => l.lv || 1))).sort();
  const [isWideScreen, setIsWideScreen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 900 : true);

  // Real-time user image position derived from GPS (percent coordinates)
  const [userImagePosition, setUserImagePosition] = useState<{ x: number; y: number; heading: number } | null>(null);
  const [showUserImagePosition, setShowUserImagePosition] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Watch browser geolocation and convert to image % coordinates.
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;

    // Bounding box (GPS): NW and SE corners provided by user
    const MIN_LON = 120.73598783189566;
    const MAX_LON = 120.7470627351817;
    const MIN_LAT = 31.268996839860193;
    const MAX_LAT = 31.27890548449692;

    let watchId: number | null = null;
    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          // If outside bounding box, show the arrow at image center (50%,50%) temporarily
          if (lon < MIN_LON || lon > MAX_LON || lat < MIN_LAT || lat > MAX_LAT) {
            setUserImagePosition({ x: 50, y: 50, heading: pos.coords.heading ?? 0 });
            setShowUserImagePosition(true);
            return;
          }

          const imageCoords = convertGpsToImageCoordinates({ lat, lon });
          if (!imageCoords) {
            setShowUserImagePosition(false);
            return;
          }

          setUserImagePosition({ x: imageCoords.xPercent, y: imageCoords.yPercent, heading: pos.coords.heading ?? 0 });
          setShowUserImagePosition(true);
        },
        () => {
          // On error, hide the dynamic arrow (fallback to static if present)
          setShowUserImagePosition(false);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    } catch (e) {
      setShowUserImagePosition(false);
    }

    return () => {
      if (watchId !== null && 'geolocation' in navigator) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

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
      setTransform: (x: number, y: number, scale: number, animationTime?: number, animationType?: TransformAnimationType) => void,
      animationTime = 500
    ) => {
      return centerMarkerInContainer(
        'user-position-marker',
        containerRef.current,
        positionX,
        positionY,
        scale,
        setTransform,
        animationTime
      );
    },
    []
  );

  const centerUsingTransformRef = useCallback((animationTime = 500) => {
    const ref = transformRef.current;

    if (!ref) {
      return false;
    }

    if (!ref.state) return false;
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
        onTransformed={(_, state) => {
          updateCSSVars(state.scale);
          // 地图变换完成后，触发弹窗位置更新
          window.dispatchEvent(new CustomEvent('map-transform'));
        }}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
          <>
            <MapFilter
              availableLevels={availableLevels}
              selectedLevels={selectedLevels}
              onChange={(levels) => setSelectedLevels(levels)}
            />
            <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-2 bg-(--color-surface) p-2 rounded-xl shadow-(--shadow-card) border border-(--color-state-disabled)">
              <button 
                onClick={() => centerOnUserMarker(
                  transformRef.current?.state?.positionX ?? 0,
                  transformRef.current?.state?.positionY ?? 0,
                  transformRef.current?.state?.scale ?? initialScale,
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
                    const scale = transformRef.current?.state?.scale ?? initialScale;
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
                  {showUserImagePosition && userImagePosition ? (
                    <UserPositionIndicator userPosition={{ x: userImagePosition.x, y: userImagePosition.y, heading: userImagePosition.heading }} />
                  ) : (
                    staticUserPosition && (
                      <UserPositionIndicator userPosition={{ x: staticUserPosition.x, y: staticUserPosition.y, heading: staticUserPosition.heading ?? 0 }} />
                    )
                  )}
                  {LOCATIONS.filter(loc => {
                    if (selectedLevels === null) return true;
                    return selectedLevels.includes(loc.lv ?? 1);
                  }).map(location => {
                    const isUnlocked = isCollectibleUnlocked(location.id);
                    return (
                      <MapPin
                        key={location.id}
                        id={location.id}
                        x={location.x ?? 50}
                        y={location.y ?? 50}
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
                        onMessageWallClick={() => {
                          if (isWideScreen) {
                            setActiveDrawerLocation(location.id);
                          } else {
                            navigate(`/wall?location=${location.id}`);
                          }
                        }}
                        onPinClick={() => {
                          const needsToOpenDrawer = isWideScreen; // All desktop clicks should open the drawer now

                          requestAnimationFrame(() => {
                            const { positionX, positionY, scale } = transformRef.current?.state || {
                              positionX: 0,
                              positionY: 0,
                              scale: initialScale
                            };

                            // 使用 TransformWrapper 回调中提供的 setTransform，因为它是最新的
                            const centerSuccess = centerMarkerInContainer(
                              `pin-${location.id}`,
                              containerRef.current,
                              positionX,
                              positionY,
                              scale,
                              setTransform, // 使用从回调中获得的 setTransform
                              500
                            );

                            if (centerSuccess) {
                              // 居中成功后，计划在下一个动画帧中打开抽屉
                              // 这样确保变换动画已经开始，即使尚未完成
                              requestAnimationFrame(() => {
                                if (needsToOpenDrawer) {
                                  // 为当前location打开抽屉
                                  setActiveDrawerLocation(location.id);
                                  // 触发一个自定义事件通知所有弹窗更新位置
                                  window.dispatchEvent(new CustomEvent('map-transform'));
                                }
                              });
                            } else if (needsToOpenDrawer) {
                              // 如果居中失败但仍需打开抽屉
                              setActiveDrawerLocation(location.id);
                              // 触发一个自定义事件通知所有弹窗更新位置
                              window.dispatchEvent(new CustomEvent('map-transform'));
                            }
                          });

                          // 在桌面端返回true，阻止MapPin内部的默认打开行为
                          // 这样我们可以控制何时打开弹窗
                          return needsToOpenDrawer;
                        }}
                        onEnterAR={(id, name) => setArTarget({ id, name })}
                        isSidebarOpen={activeDrawerLocation !== null}
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
      
      {isWideScreen && (
        <SideDrawer
          isOpen={activeDrawerLocation !== null}
          onClose={() => setActiveDrawerLocation(null)}
        >
          {/* 保持原有内容逻辑 */}
          {activeDrawerLocation && (
            <WallContent locationId={activeDrawerLocation} onClose={() => setActiveDrawerLocation(null)} />
          )}
        </SideDrawer>
      )}
    </div>
  );
}
