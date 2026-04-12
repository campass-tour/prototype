import React, { useState } from 'react';
import MascotCard from '../components/collection/MascotCard';
import CollectionProgressBar from '../components/collection/CollectionProgressBar';
import CollectionSwiperModal from '../components/collection/CollectionSwiperModal';
import ARModelViewer from '../components/photo/ARModelViewer';
import { LOCATIONS, getLocationData } from '../constants/locations';
import { getUnlockedCollectibles, getUnlockedCount } from '../lib/storage';
import defaultImageUrl from '../assets/image/default-image.png';

const imageFiles = import.meta.glob('../assets/image/*.{png,jpg,jpeg,webp,svg}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 bg-[var(--wall-page-bg)] px-2 pb-32 md:px-6">
      <section className="relative pt-6 text-left md:pt-10">
        <div className="relative max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--wall-kicker)]">
            XJTLU CAMPUS LORE
          </p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-[-0.04em] text-[var(--color-text-main)] md:text-5xl">
            My Collection
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--collection-hero-copy)] md:text-[15px]">
            A digital archive of your campus journey.
          </p>
        </div>

        <div className="mt-6 flex justify-start">
          <CollectionProgressBar current={unlockedCount || 0} total={LOCATIONS.length} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {LOCATIONS.map((loc) => {
          const locData = getLocationData(loc.id);
          const isUnlocked = !!unlockedData[loc.id];

          let imageSrc = defaultImageUrl;
          if (locData?.image) {
            const path = `../assets/image/${locData.image}`;
            imageSrc = imageFiles[path] || defaultImageUrl;
          }

          return (
            <div
              key={loc.id}
              onClick={() => handleMascotClick(loc.id, isUnlocked)}
              className={isUnlocked ? 'cursor-pointer' : ''}
            >
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

export default CollectionPage;
