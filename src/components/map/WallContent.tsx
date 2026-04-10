import React, { useState } from 'react';
import { X, Maximize2, MessageSquare } from 'lucide-react';
import { MESSAGES } from '../../constants/messages';
import PolaroidCard from '../wall/PolaroidCard';
import { getLocationData } from '../../constants/locations';
import { useNavigate } from 'react-router-dom';
import { isCollectibleUnlocked } from '../../lib/storage';
import { MessageDetailModal } from '../common/MessageDetailModal';
import { getLoreById } from '../../constants/lores';
import defaultImageUrl from '../../assets/image/default-image.png';
import { UnlockedContent } from './UnlockedContent';
import { LockedContent } from './LockedContent';
// import { SideDrawer } from '../common/SideDrawer';
import type { Message } from '../../types';
import type { DanmakuItem } from '../wall/Danmaku';

const imageFiles = import.meta.glob('../../assets/image/*.{png,jpg,jpeg,webp,svg}', { query: '?url', import: 'default', eager: true }) as Record<string, string>;


interface WallContentProps {
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

const WallContent: React.FC<WallContentProps> = ({ locationId, onClose }) => {
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  if (!locationId) return null;

  const isUnlocked = isCollectibleUnlocked(locationId);
  const locationData = getLocationData(locationId);
  const messages = isUnlocked ? MESSAGES.filter(m => m.locationId === locationId) : [];
  const lore = getLoreById(locationId);

  // Get image src from locationData.image
  let imageSrc = defaultImageUrl;
  if (locationData?.image) {
    const path = `../../assets/image/${locationData.image}`;
    imageSrc = imageFiles[path] || defaultImageUrl;
  }

  const realBuildingName = locationData?.locationName || 'Mysterious Spot';

  const handleFullscreen = () => {
    if (isUnlocked) {
      navigate(`/wall?location=${locationId}`);
    } else {
      navigate(`/wall`);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-(--color-surface) shadow-sm shrink-0">
        <div>
          <h2 className="text-xl font-bold text-(--color-text-main)">
            {isUnlocked ? realBuildingName : 'Mysterious Location'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isUnlocked && (
            <button 
              onClick={handleFullscreen}
              className="p-2 rounded-full hover:bg-(--color-divider) text-(--color-text-secondary) transition-colors"
              aria-label="View on Wall"
              title="Open in Fullscreen (Wall)"
            >
              <Maximize2 size={20} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-(--color-divider) text-(--color-text-secondary) transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {!isUnlocked ? (
          <div className="bg-(--color-surface) p-5 rounded-2xl border border-border shadow-sm">
            <LockedContent
              id={locationId}
              realBuildingName={realBuildingName}
              hideTitle={true}
            />
          </div>
        ) : (
          <>
            {/* Top section: Mascot and Lore */}
            <div className="bg-(--color-surface) p-5 rounded-2xl border border-border shadow-sm">
              <UnlockedContent
                id={locationId}
                realBuildingName={realBuildingName}
                imageSrc={imageSrc}
                whisperCount={messages.length}
                lore={lore}
                isDesktopUA={true}
                hideViewWhispersButton={true}
                hideTitle={true}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="h-px bg-gray-200 flex-1"></div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <MessageSquare size={16} />
                {messages.length} Whispers
              </div>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Feed */}
            {messages.length > 0 ? (
              <div className="space-y-6 pb-6">
                {messages.map((msg, index) => (
                  <div key={msg.id} className="w-full flex justify-center">
                    <PolaroidCard 
                      message={msg} 
                      index={index} 
                      onClick={() => setSelectedMessage(msg)} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-(--color-text-muted) bg-(--color-surface) rounded-2xl border border-dashed border-border">
                <p>No whispers here yet.</p>
                <p className="text-sm mt-2">Be the first to leave one!</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <MessageDetailModal
          item={mapToDanmakuItem(selectedMessage)}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </>
  );
};

export default WallContent;
