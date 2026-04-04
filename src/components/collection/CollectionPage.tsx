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
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            My Collection
          </h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
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
