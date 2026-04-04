import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MESSAGES, type Message } from '../constants/messages';
import { Heart, MapPin } from 'lucide-react';
import { DanmakuDetailModal } from '../components/wall/DanmakuDetailModal';
import type { DanmakuItem } from '../components/wall/Danmaku';
import { getLocationData } from '../constants/locations';
import { isCollectibleUnlocked } from '../lib/storage';
import { LOCATIONS } from '../constants/locations';
import { Button } from '../components/ui/button';

const formatTimeAgo = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  return `${Math.floor(diffInHours / 24)} days ago`;
};

const PolaroidCard: React.FC<{ message: Message; index: number; onClick: () => void }> = ({ message, index, onClick }) => {
  // Generate a random slight rotation for desktop hover
  const hoverRotation = useMemo(() => {
    const rotations = ['-2deg', '-1deg', '1deg', '2deg'];
    return rotations[index % rotations.length];
  }, [index]);

  const locationData = getLocationData(message.locationId);
  const isUnlocked = isCollectibleUnlocked(message.locationId);
  const locationName = isUnlocked && locationData ? locationData.locationName : 'Mysterious Location';

  return (
    <div
      className="group break-inside-avoid mb-6 transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col"
      onClick={onClick}
      style={{
        '--hover-rotate': hoverRotation,
      } as React.CSSProperties}
    >
      <div 
        className="bg-white p-3 pb-6 md:p-4 md:pb-8 shadow-[var(--shadow-card)] rounded-sm border border-gray-200/50"
        style={{
          transform: 'rotate(var(--tw-rotate, 0))',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        // Add a class that applies rotation strictly on hover by using a tailwind utility combined with our custom variable,
        // or just apply it in the inline style class
      >
        <style>{`
          @media (min-width: 768px) {
            .group:hover > div {
              transform: rotate(${hoverRotation}) !important;
            }
          }
        `}</style>
        
        {/* Photo Section */}
        {message.imageUrl && (
          <div className="w-full bg-gray-100 rounded-sm mb-4 overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <img 
              src={message.imageUrl} 
              alt="Memory" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        
        {/* Text Section (Handwritten font feeling) */}
        <div className="flex flex-col space-y-3">
          <p 
            className="text-black text-lg md:text-xl leading-relaxed" 
            style={{ 
              fontFamily: '"Caveat", "Comic Sans MS", cursive, sans-serif' // Fallback for handwritten
            }}
          >
            {message.content}
          </p>

          {/* Always show profile info */}
          <div className="flex items-center gap-2 mt-1">
            {message.author.avatarUrl ? (
              <img src={message.author.avatarUrl} alt={message.author.username} className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                {message.author.username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-gray-600 text-sm font-medium">{message.author.username}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full px-2 py-1 w-max">
            <MapPin className="w-3 h-3 text-[var(--color-primary)]" />
            {locationName}
          </div>

          <div className="flex items-center justify-between text-gray-500 text-sm mt-2">
            <span style={{ fontFamily: '"Caveat", "Comic Sans MS", cursive, sans-serif', fontSize: '1.1rem' }}>
              {formatTimeAgo(message.timestamp)}
            </span>
            <div 
              className="flex items-center gap-1 p-1 -mr-1 rounded-md transition-colors hover:bg-gray-100 group/like"
              onClick={(e) => {
                e.stopPropagation(); // prevent card click
                // In a real app we would call a like hook here
              }}
            >
              <Heart className="w-4 h-4 text-red-400 group-hover/like:text-red-500 group-hover/like:fill-red-400 transition-all" />
              <span className="group-hover/like:text-red-500 font-medium">{message.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WallPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const locationQuery = searchParams.get('location');
  
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string | null>(locationQuery || null);

  useEffect(() => {
    if (locationQuery) {
      setSelectedLocationFilter(locationQuery);
    }
  }, [locationQuery]);

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
    <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
      {/* Card-style header */}
      <div
        className="w-full bg-[var(--color-surface)] shadow-[var(--shadow-card)] rounded-[var(--radius-card)] px-0 py-0 mb-6 flex flex-col relative overflow-hidden border border-[var(--border)]"
        style={{
          background: 'linear-gradient(135deg, var(--color-surface) 80%, var(--accent-bg) 100%)',
        }}
      >
        {/* Accent gradient bar */}
        <div
          className="absolute left-0 top-0 w-full h-1.5 rounded-t-[var(--radius-card)]"
          style={{
            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          }}
        />
        <div className="px-6 pt-6 pb-3 flex flex-col gap-1 z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-main)]">
            Message Wall
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base md:text-lg">
            Discover memories, photos, and tips from other explorers.
          </p>
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

      <DanmakuDetailModal 
        item={selectedDanmakuItem} 
        onClose={() => setSelectedMessage(null)} 
      />
    </div>
  );
};

export default WallPage;