import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Danmaku } from '../wall/Danmaku';
import { getLoreById } from '../../constants/lores';
import { getLocationData } from '../../constants/locations';
import { MESSAGES } from '../../constants/messages';
import defaultImageUrl from '../../assets/image/default-image.png';
import { UnlockedContent } from './UnlockedContent';
import { LockedContent } from './LockedContent';

const imageFiles = import.meta.glob('../../assets/image/*-image.{png,jpg,jpeg,webp}', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const iconFiles = import.meta.glob('../../assets/icon/*.ico', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

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
  onEnterAR
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
  const startY = useRef(0);
  const startOffset = useRef(0);

  // Handle click outside to close popups/drawers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      
      // Ignore clicks on danmaku or its modal
      if (target.closest('.danmaku-item') || target.closest('.danmaku-modal-overlay')) {
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

  // Manage Danmaku delayed closing
  useEffect(() => {
    let timer: number;
    if (isOpen && status === 'unlocked') {
      setIsDanmakuActive(true);
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

  // Get image src
  let imageSrc = defaultImageUrl;
  const pngPath = `../../assets/image/${id}-image.png`;
  const jpgPath = `../../assets/image/${id}-image.jpg`;
  const jpegPath = `../../assets/image/${id}-image.jpeg`;
  const webpPath = `../../assets/image/${id}-image.webp`;

  if (imageFiles[pngPath]) imageSrc = imageFiles[pngPath];
  else if (imageFiles[jpgPath]) imageSrc = imageFiles[jpgPath];
  else if (imageFiles[jpegPath]) imageSrc = imageFiles[jpegPath];
  else if (imageFiles[webpPath]) imageSrc = imageFiles[webpPath];

  // Calculate actual message count for this location
  const whisperCount = MESSAGES.filter(msg => msg.locationId === id).length;

  // Get icon src for unlocked pins
  const getIconSrc = () => {
    const iconPath = `../../assets/icon/${id}-icon.ico`;
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
          ref={pinRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
            if (!isOpen) {
              setDrawerOffset(0);
            }
          }}
          className={`
            cursor-pointer flex items-center justify-center rounded-[var(--radius-pill)] 
            w-12 h-12 transition-all duration-300 box-border
            ${isLocked 
              ? 'backdrop-blur-md bg-[var(--color-primary)]/50 text-white shadow-lg animate-bounce' 
              : 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-card)]'
            }
          `}
        >
          {isLocked ? (
            <span className="text-[var(--font-size-h2)] font-[var(--font-weight-bold)]">?</span>
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

        {/* Desktop Popover Container (Attached relative to the pin) */}
        {isOpen && !isMobile && (
          <div 
            ref={popupRef}
            className="absolute left-1/2 bottom-full mb-4 -translate-x-1/2 w-[420px] bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-[var(--spacing-4)] z-50 animate-in fade-in zoom-in-95 border border-[var(--border)]"
            onClick={(e) => e.stopPropagation()}
          >
            {renderContent()}
            {/* Popover Arrow */}
            <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-transparent border-t-[var(--border)]">
              <div className="absolute left-1/2 -top-[13px] -translate-x-1/2 w-0 h-0 border-l-[9px] border-r-[9px] border-t-[11px] border-transparent border-t-[var(--color-surface)]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet (Attached to window bottom) */}
      {isOpen && isMobile && createPortal(
        <div 
          ref={popupRef}
          className="fixed inset-x-0 bottom-0 z-50 bg-[var(--color-surface)] text-[var(--color-text-main)] animate-in slide-in-from-bottom flex flex-col"
          style={{ 
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
            className="w-full flex justify-center pt-[var(--spacing-2)] pb-[var(--spacing-2)] cursor-grab active:cursor-grabbing"
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
            <div className="w-12 h-1.5 bg-[var(--color-state-disabled)] rounded-[var(--radius-pill)]"></div>
          </div>
          
          <div className="p-[var(--spacing-4)] pt-0 pb-[calc(var(--spacing-5)+var(--spacing-3))] overflow-y-auto max-h-[85vh]">
            {renderContent()}
          </div>
        </div>,
        document.body
      )}
      <Danmaku isActive={isDanmakuActive} locationId={id} />
    </>
  );
};