import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DanmakuDetailModal } from './DanmakuDetailModal';

export interface DanmakuItem {
  id: number;
  text: string;
  avatar?: string;
  rightImage?: string;
  top: number;
  duration: number;
}

const MOCK_MESSAGES = [
  "This architecture is amazing! 🏛️",
  "Wow, I never knew this place existed 😊",
  "Great study spot.",
  "Love the lighting here ✨",
  "Where is this exactly?",
  "Found it! Such a beautiful design.",
  "Let's meet here tomorrow.",
  "A masterpiece of campus design!",
  "Can't wait to see this in person."
];

const MOCK_AVATARS = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
  undefined // occasionally no avatar provided
];

const MOCK_RIGHT_IMAGES = [
  undefined,
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64&q=80",
  undefined,
  undefined
];

export const Danmaku: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [items, setItems] = useState<DanmakuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DanmakuItem | null>(null);

  useEffect(() => {
    if (!isActive) {
      setItems([]);
      return;
    }

    let nextId = 0;
    
    // Play danmaku occasionally
    const spawnDanmaku = () => {
      const text = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
      const avatar = MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)];
      const rightImage = MOCK_RIGHT_IMAGES[Math.floor(Math.random() * MOCK_RIGHT_IMAGES.length)];
      
      const top = 10 + Math.random() * 30; 
      
      const duration = 6 + Math.random() * 4;

      const newItem: DanmakuItem = {
        id: nextId++,
        text,
        avatar,
        rightImage,
        top,
        duration
      };

      setItems(prev => [...prev, newItem]);

      setTimeout(() => {
        setItems(prev => prev.filter(item => item.id !== newItem.id));
      }, duration * 1000 + 500); 
    };

   
    spawnDanmaku();
    setTimeout(spawnDanmaku, 800);

    const interval = setInterval(() => {
      spawnDanmaku();
    }, 1800);

    return () => {
      clearInterval(interval);
      setItems([]);
    };
  }, [isActive]);

  if (!isActive) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden danmaku-overlay">
        <style>
          {`
            @keyframes slide-left {
              from { transform: translateX(100vw); }
              to { transform: translateX(-100%); }
            }
          `}
        </style>
        
        {items.map(item => (
          <div 
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(item);
            }}
            className="absolute flex items-center pl-1 pr-[var(--spacing-3)] py-1 bg-[var(--color-surface)] shadow-[var(--shadow-card)] rounded-[var(--radius-pill)] gap-[var(--spacing-2)] whitespace-nowrap pointer-events-auto cursor-pointer hover:bg-[var(--color-background)] transition-colors danmaku-item"
            style={{ 
              top: `${item.top}%`, 
              left: 0,
              animation: `slide-left ${item.duration}s linear forwards`
            }}
          >
          {/* The Circular Avatar is positioned at the leftmost end */}
          {item.avatar ? (
            <img 
              src={item.avatar} 
              alt="avatar" 
              className="w-8 h-8 rounded-[var(--radius-pill)] object-cover flex-shrink-0 bg-gray-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-[var(--radius-pill)] bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 text-white font-[var(--font-weight-bold)] text-[12px]">
              Anon
            </div>
          )}
          {/* Constrain length with truncation to force a single line display */}
          <span className="text-[var(--color-text-main)] font-[var(--font-weight-semibold)] text-[var(--font-size-body)] truncate max-w-[320px]">
            {item.text}
          </span>
          {/* Optional right-side image */}
          {item.rightImage && (
            <img
              src={item.rightImage}
              alt="danmaku-right"
              className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-gray-200 ml-2"
            />
          )}
        </div>
      ))}
      </div>
      
      <DanmakuDetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </>,
    document.body
  );
};
