import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Pencil } from 'lucide-react';
import EditProfileDrawer from './EditProfileDrawer';

export const ProfileHeader: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="w-full bg-[var(--color-surface)] shadow-[var(--shadow-card)] rounded-[var(--radius-card)] px-0 py-0 mb-2 flex flex-col relative overflow-hidden border border-[var(--border)]">
      {/* Cover Photo (more compact on desktop) */}
      <div className="h-28 md:h-36 w-full bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc]">
        <LazyLoadImage
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"
          alt="Cover"
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          effect="blur"
        />
      </div>
      <div className="px-4 pb-4 md:px-6 relative flex flex-col md:flex-row md:items-center text-center md:text-left">
        {/* Avatar Area */}
        <div className="relative -mt-14 md:-mt-12 mb-3 md:mb-0 inline-block mx-auto md:mr-4">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white p-1 shadow-[0_0_16px_rgba(156,125,217,0.45)] flex items-center justify-center object-cover">
             <LazyLoadImage
                src="https://picui.ogmua.cn/s1/2026/04/08/69d56b9761229.webp"
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
                effect="blur"
              />
          </div>
          {/* Edit Entry */}
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="absolute bottom-1 right-1 md:bottom-1 md:right-1 w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-state-disabled)] shadow-sm flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-background)] transition-colors z-10"
            aria-label="Edit Profile"
          >
            <Pencil size={15} />
          </button>
        </div>

        {/* Identity Info */}
        <div className="flex flex-col items-center md:items-start md:flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text-main)] leading-tight">
            silly bird
          </h1>
          <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-accent)] text-white text-xs font-semibold tracking-wide uppercase">
            Campus Rookie
          </div>
        </div>
      </div>

      <EditProfileDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
};


export default ProfileHeader;