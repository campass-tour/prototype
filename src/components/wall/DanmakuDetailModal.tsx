import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { DanmakuItem } from './Danmaku';

interface DanmakuDetailModalProps {
  item: DanmakuItem | null;
  onClose: () => void;
}

export const DanmakuDetailModal: React.FC<DanmakuDetailModalProps> = ({ item, onClose }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  if (!item) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 danmaku-modal-overlay">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div 
        className="w-full max-w-sm bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 cursor-default"
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-main)] transition-colors focus:outline-none bg-[var(--color-background)] rounded-full p-1"
        >
          <X size={20} />
        </button>

        {/* User Info header */}
        <div className="flex items-center gap-3 pr-8">
          {item.avatar ? (
            <img 
              src={item.avatar} 
              alt="avatar" 
              className="w-12 h-12 rounded-[var(--radius-pill)] object-cover flex-shrink-0 bg-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-[var(--radius-pill)] bg-[var(--color-primary)] flex flex-shrink-0 items-center justify-center text-white font-[var(--font-weight-bold)] text-[16px]">
              Anon
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-[var(--font-weight-bold)] text-[var(--color-text-main)] text-[var(--font-size-body)]">
              {item.avatar ? "Random Visitor" : "Anonymous"}
            </span>
            <span className="text-[var(--color-text-secondary)] text-[var(--font-size-caption)]">
              Just now
            </span>
          </div>
        </div>

        {/* Text Payload */}
        <div className="text-[var(--color-text-main)] font-[var(--font-weight-regular)] text-[var(--font-size-body)] whitespace-pre-wrap leading-relaxed py-2">
          {item.text}
        </div>

        {/* Optional Image */}
        {item.rightImage && (
          <div className="w-full h-48 rounded-[var(--radius-button)] overflow-hidden bg-gray-100 mt-1 shadow-sm">
            <img 
              src={item.rightImage} 
              alt="attachment" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};