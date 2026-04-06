import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-card)] border border-[var(--color-state-disabled)] max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-6 mb-8 relative">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-3xl md:text-4xl">
          JD
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-main)]">John Doe</h2>
          <p className="text-base md:text-lg text-[var(--color-accent)] font-medium mt-1">Level 5 Explorer</p>
        </div>
      </div>

      <h3 className="font-bold text-[var(--color-text-main)] text-xl mb-4">Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">        
        <div className="bg-[var(--color-background)] p-6 rounded-xl text-center shadow-sm">
          <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">42</div>
          <div className="text-sm md:text-base text-[var(--color-text-secondary)]">Locations Visited</div>
        </div>
        <div className="bg-[var(--color-background)] p-6 rounded-xl text-center shadow-sm">
          <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">15</div>
          <div className="text-sm md:text-base text-[var(--color-text-secondary)]">Badges Collected</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
