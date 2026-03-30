import React from 'react';
import MascotCard from './MascotCard';
import CollectionProgressBar from './CollectionProgressBar';

interface CollectionPageProps {
  onSimulateCheckIn: () => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({ onSimulateCheckIn }) => {
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

        <button
          onClick={onSimulateCheckIn}
          className="rounded-[8px] bg-[var(--color-accent)] px-4 py-3 font-medium text-white transition hover:opacity-90"
        >
          Simulate NFC Check-in
        </button>
      </div>

      <CollectionProgressBar current={3} total={12} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <MascotCard
          name="Hui Bar Bird"
          location="Hui Bar"
          status="unlocked"
        />
        <MascotCard
          name="Museum Bird"
          location="Museum"
          status="new"
        />
        <MascotCard
          name="Library Bird"
          location="Library"
          status="locked"
        />
        <MascotCard
          name="Central Building Bird"
          location="Central Building"
          status="unlocked"
        />
        <MascotCard
          name="South Campus Bird"
          location="South Campus"
          status="locked"
        />
      </div>
    </div>
  );
};
