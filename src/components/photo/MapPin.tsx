import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface MapPinProps {
  x: number; // Percentage horizontal position (0-100)
  y: number; // Percentage vertical position (0-100)
  status: 'locked' | 'unlocked';
  buildingName?: string;
  buildingIcon?: React.ReactNode;
  hintImage?: string;
  hintText?: string;
  onMessageWallClick?: () => void;
}

export const MapPin: React.FC<MapPinProps> = ({ 
  x, 
  y, 
  status, 
  buildingIcon, 
  buildingName, 
  hintImage, 
  hintText, 
  onMessageWallClick 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  // Handle click outside to close popups/drawers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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

  const isLocked = status === 'locked';

  return (
    <>
      <div 
        className="absolute z-10 transition-all duration-300 pointer-events-auto"
        style={{ 
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%)"
        }}
      >
        {/* The Map Pin Indicator */}
        <div 
          ref={pinRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
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
              {/* Fallback to default building shape if no special building icon provided */}
              {buildingIcon || (
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
              )}
            </span>
          )}
        </div>

        {/* Desktop Popover Container (Attached relative to the pin) */}
        {isOpen && !isMobile && (
          <div 
            ref={popupRef}
            className="absolute left-1/2 bottom-full mb-4 -translate-x-1/2 w-64 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-[var(--spacing-4)] z-50 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[var(--font-size-h2)] font-[var(--font-weight-bold)] text-[var(--color-text-main)] mb-[var(--spacing-2)] leading-tight">
              {buildingName || 'Location Information'}
            </h3>
            <p className="text-[var(--font-size-body)] text-[var(--color-text-secondary)] mb-0">
              Please use your mobile device to experience drawing features and unlock secrets.
            </p>
            {/* Popover Arrow */}
            <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[var(--color-surface)]"></div>
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
            transform: `translateY(${dragOffset}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle identifier */}
          <div 
            className="w-full flex justify-center pt-[var(--spacing-2)] pb-[var(--spacing-2)] cursor-grab active:cursor-grabbing"
            onTouchStart={(e) => {
              setIsDragging(true);
              startY.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
              if (!isDragging) return;
              const deltaY = e.touches[0].clientY - startY.current;
              setDragOffset(Math.max(0, deltaY));
            }}
            onTouchEnd={() => {
              if (dragOffset > 100) {
                setIsOpen(false);
              }
              setDragOffset(0);
              setIsDragging(false);
            }}
            onMouseDown={(e) => {
              setIsDragging(true);
              startY.current = e.clientY;
            }}
            onMouseMove={(e) => {
              if (!isDragging) return;
              const deltaY = e.clientY - startY.current;
              setDragOffset(Math.max(0, deltaY));
            }}
            onMouseUp={() => {
              if (dragOffset > 100) {
                setIsOpen(false);
              }
              setDragOffset(0);
              setIsDragging(false);
            }}
          >
            <div className="w-12 h-1.5 bg-[var(--color-state-disabled)] rounded-[var(--radius-pill)]"></div>
          </div>
          
          <div className="p-[var(--spacing-4)] pt-0 pb-[calc(var(--spacing-5)+var(--spacing-3))] overflow-y-auto max-h-[85vh]">
            <h2 className="text-[var(--font-size-h1)] font-[var(--font-weight-bold)] mb-[var(--spacing-4)]">
              {buildingName || 'Mysterious Spot'}
            </h2>
            
            {isLocked ? (
              <div className="flex flex-col gap-[var(--spacing-3)]">
                <p className="text-[var(--font-size-body)] text-[var(--color-text-secondary)]">
                  {hintText || 'Find this exact spot to unlock its secrets.'}
                </p>
                <div className="relative w-full aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden bg-gray-200">
                  {hintImage ? (
                    <img 
                      src={hintImage} 
                      alt="Location Clue" 
                      className="w-full h-full object-cover blur-md scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)] bg-[var(--color-state-disabled)] blur-sm">
                      <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <span>Blurred Clue Image</span>
                    </div>
                  )}
                  {/* Overlay text for extra mystery */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white font-[var(--font-weight-bold)] text-[var(--font-size-h2)] drop-shadow-md">
                      Clue Hidden
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-[var(--spacing-4)] mt-[var(--spacing-2)]">
                <p className="text-[var(--font-size-body)] text-[var(--color-text-secondary)] text-center">
                  You have successfully unlocked this architecture! Tap the button below to see the messages left by others.
                </p>
                <button 
                  onClick={onMessageWallClick}
                  className="w-full bg-[var(--color-primary)] text-white font-[var(--font-weight-bold)] py-[var(--spacing-3)] px-[var(--spacing-4)] rounded-[var(--radius-button)] shadow-[var(--shadow-card)] active:scale-95 transition-transform"
                >
                  Enter Message Wall Space
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

