import React, { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { MESSAGES } from '../../constants/messages';
import PolaroidCard from '../wall/PolaroidCard';
import { getLocationData } from '../../constants/locations';
import { useNavigate } from 'react-router-dom';
import { isCollectibleUnlocked } from '../../lib/storage';
import { MessageDetailModal } from '../common/MessageDetailModal';
import type { Message } from '../../types';
import type { DanmakuItem } from '../wall/Danmaku';

interface MapWhispersDrawerProps {
  isOpen: boolean;
  locationId: string | null;
  onClose: () => void;
}

const mapToDanmakuItem = (msg: Message): DanmakuItem => ({
  id: msg.id,
  text: msg.content,
  avatar: msg.author.avatarUrl,
  rightImage: msg.imageUrl,
  top: 0,
  duration: 0,
  originalMessage: msg
});

export const MapWhispersDrawer: React.FC<MapWhispersDrawerProps> = ({ 
  isOpen, 
  locationId, 
  onClose 
}) => {
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  if (!isOpen || !locationId) return null;

  const isUnlocked = isCollectibleUnlocked(locationId);
  const locationData = getLocationData(locationId);
  const messages = isUnlocked ? MESSAGES.filter(m => m.locationId === locationId) : [];

  const handleFullscreen = () => {
    if (isUnlocked) {
      navigate(`/wall?location=${locationId}`);
    } else {
      navigate(`/wall`);
    }
  };

  return (
    <div 
      className="absolute top-0 right-0 h-full w-[520px] max-w-[60vw] bg-[var(--color-background)] shadow-[-10px_0_40px_rgba(0,0,0,0.1)] z-[100] flex flex-col border-l border-[var(--border)] animate-in slide-in-from-right duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--color-surface)] shadow-sm">
        <div>
          <h2 className="text-[var(--font-size-h3)] font-[var(--font-weight-bold)] text-[var(--color-text-main)]">
            {isUnlocked ? locationData?.locationName || 'Unknown Location' : 'Mysterious Location'}
          </h2>
          <p className="text-[var(--font-size-small)] text-[var(--color-text-muted)] mt-1">
            {isUnlocked ? `${messages.length} Whispers` : 'Location Locked'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleFullscreen}
            className="p-2 rounded-full hover:bg-[var(--color-divider)] text-[var(--color-text-main)] transition-colors"
            aria-label="View on Wall"
            title="Open in Fullscreen (Wall)"
          >
            <Maximize2 size={20} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--color-divider)] text-[var(--color-text-main)] transition-colors"
            aria-label="Close whispers drawer"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Messages List / Placeholder */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative">
        {!isUnlocked ? (
          <div className="text-center py-10 flex flex-col items-center justify-center h-full text-[var(--color-text-muted)]">
            <div className="w-16 h-16 rounded-full bg-[var(--color-state-disabled)] flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-[var(--color-text-main)]">?</span>
            </div>
            <p className="text-lg font-semibold text-[var(--color-text-main)]">Secrets Await</p>
            <p className="text-sm mt-2 max-w-[80%] mx-auto">Explore the campus and unlock this location to read whispers left by others.</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={msg.id} className="w-full flex justify-center">
              <PolaroidCard 
                message={msg} 
                index={index} 
                onClick={() => setSelectedMessage(msg)} 
              />
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-[var(--color-text-muted)]">
            <p>No whispers here yet.</p>
            <p className="text-sm mt-2">Be the first to leave one!</p>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <MessageDetailModal
          item={mapToDanmakuItem(selectedMessage)}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
};
