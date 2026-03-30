import React from 'react';
import MascotCard from './MascotCard';
import CollectionProgressBar from './CollectionProgressBar';
import { LOCATIONS, getLocationData } from '../../constants/locations';

export const CollectionPage: React.FC = () => {
  const unlockedData = JSON.parse(localStorage.getItem('unlocked_collectibles') || '{}');
  const unlockedCount = Object.keys(unlockedData).length;

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

      <CollectionProgressBar current={unlockedCount || 0} total={12} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {LOCATIONS.map((loc) => {
          const locData = getLocationData(loc.id);
          return (
            <MascotCard
              key={loc.id}
              name={locData.mascotName}
              location={loc.name}
              status={unlockedData[loc.id] ? 'unlocked' : 'locked'}
            />
          );
        })}
        <MascotCard
          name="South Campus Bird"
          location="South Campus"
          status="locked"
        />
      </div>
    </div>
  );
};
