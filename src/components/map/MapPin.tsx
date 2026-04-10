import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Danmaku } from '../wall/Danmaku';
import { getLoreById } from '../../constants/lores';
import { getLocationData } from '../../constants/locations';
import { MESSAGES } from '../../constants/messages';
import defaultImageUrl from '../../assets/image/default-image.png';
import { UnlockedContent } from './UnlockedContent';
import { LockedContent } from './LockedContent';

const imageFiles = import.meta.glob('../../assets/image/*.{png,jpg,jpeg,webp,svg}', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const iconFiles = import.meta.glob('../../assets/icon/*', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

interface MapPinProps {
  id: string; // The location ID for fetching messages
  x: number; // Percentage horizontal position (0-100)
  y: number; // Percentage vertical position (0-100)
  status: 'locked' | 'unlocked';
  buildingName?: string;
  buildingIcon?: React.ReactNode;
  hintImage?: string;
  hintText?: string;
  onMessageWallClick?: () => void;
  onEnterAR?: (id: string, name: string) => void;
  onPinClick?: () => boolean | void; // Return true to prevent default open/close behavior
  isSidebarOpen?: boolean;
}

export const MapPin: React.FC<MapPinProps> = ({
  id,
  x,
  y,
  status,
  buildingIcon,
  buildingName,
  hintImage,
  hintText,
  onMessageWallClick,
  onEnterAR,
  onPinClick
  , isSidebarOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktopUA] = useState(() => 
    typeof navigator !== 'undefined' ? !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : false
  );
  const [isDanmakuActive, setIsDanmakuActive] = useState(false);
  const [drawerOffset, setDrawerOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  // const [popupPos, setPopupPos] = useState<{ left: number; top: number } | null>(null);
  const startY = useRef(0);
  const startOffset = useRef(0);

  // Handle click outside to close popups/drawers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      
      // Ignore clicks on danmaku or its modal or image viewer
      if (target.closest('.danmaku-item') || target.closest('.danmaku-modal-overlay') || target.closest('.image-viewer-overlay')) {
        return;
      }

      if (isOpen && 
          pinRef.current && !pinRef.current.contains(event.target as Node) &&
          popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Check viewport width to switch between popover and bottom sheet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    // Initial check
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate popup position in viewport when opening desktop popover
  useEffect(() => {
    if (!isOpen || isMobile) {
      // setPopupPos(null);
      return;
    }

    const updatePos = () => {
      const el = pinRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (popupRef.current) {
        // position popup if it's rendered as an absolutely positioned element
        popupRef.current.style.left = `${rect.left + rect.width / 2}px`;
        popupRef.current.style.top = `${rect.top}px`;
      }
    };

    updatePos();
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);

    // 为了使弹窗跟随地图变换，我们监听地图容器的变化
    // 创建一个自定义事件监听器
    const handleMapTransform = () => {
      // 地图变换后，更新弹窗位置
      setTimeout(updatePos, 0); // 使用timeout确保DOM已更新
    };

    window.addEventListener('map-transform', handleMapTransform);

    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('map-transform', handleMapTransform);
    };
  }, [isOpen, isMobile, x, y]);

  // Manage Danmaku delayed closing
  useEffect(() => {
    let timer: number;
    if (isOpen && status === 'unlocked') {
      // setIsDanmakuActive(true); // Avoid direct setState in effect
    } else {
      // Delay closing danmaku by 1.5 seconds if drawer closes
      timer = window.setTimeout(() => setIsDanmakuActive(false), 1500);
    }
    return () => clearTimeout(timer);
  }, [isOpen, status]);

  const isLocked = status === 'locked';
  const lore = getLoreById(id);
  const locationData = getLocationData(id);
  const realBuildingName = locationData?.locationName || buildingName || 'Mysterious Spot';
  const level = locationData?.lv || 1;


  const getPinClasses = () => {
    const baseClasses = 'cursor-pointer flex items-center justify-center rounded-[var(--radius-pill)] w-12 h-12 transition-all duration-300 box-border';
    const colorClass = level === 2 ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-primary)]';

    if (isLocked) {
      return `${baseClasses} relative backdrop-blur-md text-white shadow-lg animate-bounce overflow-hidden`;
    } else {
      return `${baseClasses} ${colorClass} text-white shadow-[var(--shadow-card)]`;
    }
  };

  // Get image src from locationData.image (provided by constants/getLocationData)
  let imageSrc = defaultImageUrl;
  if (locationData?.image) {
    const path = `../../assets/image/${locationData.image}`;
    imageSrc = imageFiles[path] || defaultImageUrl;
  }

  // Calculate actual message count for this location
  const whisperCount = MESSAGES.filter(msg => msg.locationId === id).length;

  // Get icon src from locationData.icon
  const getIconSrc = () => {
    if (!locationData?.icon) return null;
    const iconPath = `../../assets/icon/${locationData.icon}`;
    return iconFiles[iconPath] || null;
  };

  const renderContent = () => (
    isLocked ? (
      <LockedContent
        id={id}
        realBuildingName={isLocked ? 'Mysterious Spot' : realBuildingName}
        hintImage={hintImage}
        hintText={hintText}
      />
    ) : (
      <UnlockedContent
        id={id}
        realBuildingName={realBuildingName}
        imageSrc={imageSrc}
        whisperCount={whisperCount}
        lore={lore}
        onMessageWallClick={onMessageWallClick}
        onEnterAR={onEnterAR}
        isDesktopUA={isDesktopUA}
      />
    )
  );

  return (
    <>
      <div
        className="absolute z-10 pointer-events-auto"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%) scale(var(--map-inv-scale, 1))",
          transition: "left 300ms ease-out, top 300ms ease-out"
        }}
      >
        {/* The Map Pin Indicator */}
        <div
          id={`pin-${id}`}  // 添加ID属性以便在地图上定位
          ref={pinRef}
          onClick={(e) => {
            e.stopPropagation();
            if (onPinClick) {
              const preventDefault = onPinClick();
              if (preventDefault) return;
            }
            setIsOpen(!isOpen);
            if (!isOpen) {
              setDrawerOffset(0);
            }
          }}
          className={getPinClasses()}
        >
          {isLocked ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <span
                className="absolute inset-0 rounded-(--radius-pill)"
                style={{
                  backgroundColor: level === 2 ? 'var(--color-accent)' : 'var(--color-primary)',
                  opacity: 0.6
                }}
              />
              <span className="relative z-10 text-(--font-size-h2) font-bold">?</span>
            </div>
          ) : (
            <span className="w-6 h-6 flex items-center justify-center">
              {(() => {
                const customIconSrc = getIconSrc();
                if (customIconSrc) {
                  return <img src={customIconSrc} alt={`${realBuildingName} icon`} className="w-full h-full object-contain" />;
                }
                return buildingIcon || (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18"></path>
                    <path d="M9 8h1"></path>
                    <path d="M9 12h1"></path>
                    <path d="M9 16h1"></path>
                    <path d="M14 8h1"></path>
                    <path d="M14 12h1"></path>
                    <path d="M14 16h1"></path>
                    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                  </svg>
                );
              })()}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet (Attached to window bottom) */}
      {isOpen && isMobile && createPortal(
        <div 
          ref={popupRef}
          className="fixed inset-x-0 bottom-0 bg-(--color-surface) text-(--color-text-main) animate-in slide-in-from-bottom flex flex-col"
          style={{ 
            zIndex: 'var(--z-modal)',
            borderTopLeftRadius: 'var(--radius-card)', 
            borderTopRightRadius: 'var(--radius-card)',
            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
            transform: `translateY(${drawerOffset}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle identifier */}
          <div 
            className="w-full flex justify-center pt-(--spacing-2) pb-(--spacing-2) cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
            onTouchStart={(e) => {
              if (e.touches.length > 1) return; // 只允许单指
              setIsDragging(true);
              startY.current = e.touches[0].clientY;
              startOffset.current = drawerOffset;
            }}
            onTouchMove={(e) => {
              if (!isDragging) return;
              if (e.touches.length > 1) return; // 只允许单指
              e.preventDefault(); // 阻止页面滚动
              const deltaY = e.touches[0].clientY - startY.current;
              const newOffset = Math.max(0, startOffset.current + deltaY);
              setDrawerOffset(newOffset);
            }}
            onTouchEnd={() => {
              if (drawerOffset > window.innerHeight * 0.8) {
                setIsOpen(false);
              }
              setIsDragging(false);
            }}
            onMouseDown={(e) => {
              setIsDragging(true);
              startY.current = e.clientY;
              startOffset.current = drawerOffset;
            }}
            onMouseMove={(e) => {
              if (!isDragging) return;
              const deltaY = e.clientY - startY.current;
              const newOffset = Math.max(0, startOffset.current + deltaY);
              setDrawerOffset(newOffset);
            }}
            onMouseUp={() => {
              if (drawerOffset > window.innerHeight * 0.8) {
                setIsOpen(false);
              }
              setIsDragging(false);
            }}
          >
            <div className="w-12 h-1.5 bg-(--color-state-disabled) rounded-(--radius-pill)"></div>
          </div>
          
          <div className="p-(--spacing-4) pt-0 pb-[calc(var(--spacing-5)+var(--spacing-3))] overflow-y-auto max-h-[85vh]">
            {renderContent()}
          </div>
        </div>,
        document.body
      )}
      {!isSidebarOpen && <Danmaku isActive={isDanmakuActive} locationId={id} />}
    </>
  );
};