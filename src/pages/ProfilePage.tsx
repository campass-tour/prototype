import React from 'react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { StatsDashboard } from '../components/profile/StatsDashboard';
import { MyMemories } from '../components/profile/MyMemories';
import { UtilitiesSettings } from '../components/profile/UtilitiesSettings';

const ProfilePage: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-background)] min-h-[100svh] pb-32">
      <div className="w-full max-w-7xl mx-auto px-2 md:px-6 py-6 flex flex-col gap-6">
        
        {/* 1. Identity & Edit Header */}
        <div className="w-full">
          <ProfileHeader />
        </div>

        {/* 2. Data Visualization Dashboard */}
        <div className="w-full">
          <StatsDashboard />
        </div>

        {/* 3. My Content / Memories */}
        <div className="w-full">
          <MyMemories />
        </div>

        {/* 4. Utilities & Settings */}
        <div className="w-full">
          <UtilitiesSettings />
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
