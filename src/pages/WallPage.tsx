import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MESSAGES } from '../constants/messages';
import type { Message } from '../types';
import { MapPin, Plus } from 'lucide-react';
import { MessageDetailModal } from '../components/common/MessageDetailModal';
import { ComposeMessageModal } from '../components/wall/ComposeMessageModal';
import type { DanmakuItem } from '../components/wall/Danmaku';
import { LOCATIONS } from '../constants/locations';
import { isCollectibleUnlocked } from '../lib/storage';
import PolaroidCard from '../components/wall/PolaroidCard';
import { Button } from '../components/ui/button';

 

export const WallPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const locationQuery = searchParams.get('location');
  
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string | null>(locationQuery || null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    // Only update if different to avoid cascading renders
    if (locationQuery && selectedLocationFilter !== locationQuery) {
      setTimeout(() => setSelectedLocationFilter(locationQuery), 0);
    }
  }, [locationQuery, selectedLocationFilter]);

  // Get unlocked locations
  const unlockedLocations = useMemo(() => {
    return LOCATIONS.filter(loc => isCollectibleUnlocked(loc.id));
  }, []);

  // Filter messages based on selected location
  const filteredMessages = useMemo(() => {
    if (!selectedLocationFilter) return MESSAGES;
    return MESSAGES.filter(msg => msg.locationId === selectedLocationFilter);
  }, [selectedLocationFilter]);

  const selectedDanmakuItem: DanmakuItem | null = useMemo(() => {
    if (!selectedMessage) return null;
    return {
      id: selectedMessage.id,
      text: selectedMessage.content,
      avatar: selectedMessage.author.avatarUrl,
      rightImage: selectedMessage.imageUrl,
      top: 0,
      duration: 0,
      originalMessage: selectedMessage,
    };
  }, [selectedMessage]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-6 pb-32">
      {/* Card-style header */}
      <div
        className="w-full bg-[var(--color-surface)] shadow-[var(--shadow-card)] rounded-[var(--radius-card)] px-0 py-0 mb-2 flex flex-col relative overflow-hidden border border-[var(--border)]"
        style={{
          background: 'linear-gradient(135deg, var(--color-surface) 80%, var(--accent-bg) 100%)',
        }}
      >
        {/* Accent gradient bar */}
        <div
          className="absolute left-0 top-0 w-full h-1.5 rounded-t-(--radius-card)"
          style={{
            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          }}
        />
        <div className="px-6 pt-6 pb-3 flex flex-col gap-1 z-10 relative">
          <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-main) text-center w-full">
            Message Wall
          </h1>
          {/* 按钮已移至卡片下方 */}
          <p className="text-(--color-text-secondary) text-base md:text-lg mt-2">
            Discover memories, photos, and tips from other explorers.
          </p>
        </div>
        {/* 卡片下方右下角小按钮 */}
        <div className="w-full flex justify-end pr-6 pb-4">
          <Button 
            className="hidden md:flex gap-1 wall-compose-btn-advanced font-semibold text-sm px-3 py-1.5 h-8 min-h-0"
            style={{ fontSize: '0.95rem' }}
            onClick={() => setIsComposeOpen(true)}
          >
            <Plus className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Write Whisper</span>
          </Button>
        </div>
      </div>

      {/* Location Filter */}
      {unlockedLocations.length > 0 && (
        <div className="mb-6">

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedLocationFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLocationFilter(null)}
            >
              All Locations
            </Button>
            {unlockedLocations.map((location) => (
              <Button
                key={location.id}
                variant={selectedLocationFilter === location.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLocationFilter(location.id)}
              >
                <MapPin className="w-3 h-3 mr-1" />
                {location.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 
        Mobile: single column (columns-1) with gap.
        Desktop: multi-column (columns-2/3/4) for masonry layout.
      */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
        {filteredMessages.map((msg, idx) => (
          <PolaroidCard 
            key={msg.id} 
            message={msg} 
            index={idx} 
            onClick={() => setSelectedMessage(msg)}
          />
        ))}
      </div>

      <MessageDetailModal 
        item={selectedDanmakuItem} 
        onClose={() => setSelectedMessage(null)} 
      />

      {/* Mobile Compose FAB */}
      <button 
        className="md:hidden fixed bottom-22.5 right-6 w-14 h-14 bg-(--color-primary) text-white rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex items-center justify-center z-40 active:scale-95 transition-transform"
        onClick={() => setIsComposeOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </button>

      <ComposeMessageModal 
        isOpen={isComposeOpen} 
        onClose={() => setIsComposeOpen(false)} 
      />
    </div>
  );
};

export default WallPage;