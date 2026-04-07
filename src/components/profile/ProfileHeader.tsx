import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import EditProfileDrawer from './EditProfileDrawer';

export const ProfileHeader: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="w-full bg-[var(--color-surface)] shadow-[var(--shadow-card)] rounded-[var(--radius-card)] px-0 py-0 mb-2 flex flex-col relative overflow-hidden border border-[var(--border)]">
      {/* Cover Photo */}
      <div className="h-32 md:h-48 w-full bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc]">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" 
          alt="Cover" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
      </div>

      <div className="px-6 pb-6 md:px-8 relative flex flex-col items-center sm:items-start text-center sm:text-left">
        {/* Avatar Area */}
        <div className="relative -mt-16 md:-mt-20 mb-4 inline-block">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white p-1 shadow-[0_0_20px_rgba(156,125,217,0.5)] flex items-center justify-center object-cover">
             <img 
                src="https://picui.ogmua.cn/s1/2026/04/08/69d56b9761229.webp" 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover"
              />
          </div>
          {/* Edit Entry */}
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-state-disabled)] shadow-md flex items-center justify-center text-[var(--color-text-main)] hover:bg-gray-50 transition-colors z-10"
            aria-label="Edit Profile"
          >
            <Pencil size={15} />
          </button>
        </div>

        {/* Identity Info */}
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-main)] leading-tight">
            silly bird
          </h1>
          <div className="mt-2 inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-white text-xs md:text-sm font-semibold tracking-wide uppercase">
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