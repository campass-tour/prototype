import React, { useState } from 'react';
import MascotCard from './MascotCard';
import CollectionProgressBar from './CollectionProgressBar';
import CollectionSwiperModal from './CollectionSwiperModal';
import ARModelViewer from '../photo/ARModelViewer';
import { LOCATIONS, getLocationData } from '../../constants/locations';
import { getUnlockedCollectibles, getUnlockedCount } from '../../lib/storage';
import defaultImageUrl from '../../assets/image/default-image.png';

const imageFiles = import.meta.glob('../../assets/image/*-image.{png,jpg,jpeg,webp}', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

export const CollectionPage: React.FC = () => {
  const unlockedData = getUnlockedCollectibles();
  const unlockedCount = getUnlockedCount();
  const [selectedMascotId, setSelectedMascotId] = useState<string | null>(null);
  const [arTargetId, setArTargetId] = useState<string | null>(null);
  const [arTargetName, setArTargetName] = useState<string>('');

  const handleMascotClick = (id: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      setSelectedMascotId(id);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-6 space-y-6">
      {/* Card-style header */}
      <div
        className="w-full bg-[var(--color-surface)] shadow-[var(--shadow-card)] rounded-[var(--radius-card)] px-0 py-0 mb-2 flex flex-col relative overflow-hidden border border-[var(--border)]"
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
            My Collection
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base md:text-lg">
            Discover campus landmarks and unlock your mascot gallery.
          </p>
        </div>
      </div>

      <CollectionProgressBar current={unlockedCount || 0} total={LOCATIONS.length} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {LOCATIONS.map((loc) => {
          const locData = getLocationData(loc.id);
          const isUnlocked = !!unlockedData[loc.id];
          
          // Determine image dynamically. Format: id-image.png/jpg or fallback to default-image.png
          let imageSrc = defaultImageUrl;
          
          const pngPath = `../../assets/image/${loc.id}-image.png`;
          const jpgPath = `../../assets/image/${loc.id}-image.jpg`;
          const jpegPath = `../../assets/image/${loc.id}-image.jpeg`;
          const webpPath = `../../assets/image/${loc.id}-image.webp`;

          if (imageFiles[pngPath]) imageSrc = imageFiles[pngPath];
          else if (imageFiles[jpgPath]) imageSrc = imageFiles[jpgPath];
          else if (imageFiles[jpegPath]) imageSrc = imageFiles[jpegPath];
          else if (imageFiles[webpPath]) imageSrc = imageFiles[webpPath];

          return (
            <div key={loc.id} onClick={() => handleMascotClick(loc.id, isUnlocked)} className={isUnlocked ? "cursor-pointer" : ""}>
              <MascotCard
                name={locData?.mascotName || loc.name}
                location={loc.name}
                status={isUnlocked ? 'unlocked' : 'locked'}
                image={isUnlocked ? imageSrc : undefined}
              />
            </div>
          );
        })}
      </div>

      <CollectionSwiperModal 
        open={!!selectedMascotId}
        onClose={() => setSelectedMascotId(null)}
        initialCheckinId={selectedMascotId || ''}
        onViewCollection={() => setSelectedMascotId(null)}
        onEnterAR={(mascotId, mascotName) => {
          setSelectedMascotId(null);
          setArTargetId(mascotId);
          setArTargetName(mascotName);
        }}
      />

      <ARModelViewer
        open={!!arTargetId}
        onClose={() => setArTargetId(null)}
        checkinId={arTargetId || undefined}
        mascotName={arTargetName}
      />
    </div>
  );
};
