import React from 'react';
import { Compass, MessageSquare, Heart } from 'lucide-react';

export const StatsDashboard: React.FC = () => {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-card)] py-6 px-6 shadow-[var(--shadow-card)] w-full border border-[var(--border)]">
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        
        {/* Exploration Progress */}
        <div className="flex flex-col items-center text-center px-2">
          <div className="text-[var(--color-primary)] mb-2 bg-[var(--color-primary)]/10 p-2.5 rounded-full">
            <Compass size={22} />
          </div>
          <span className="text-xl md:text-2xl font-bold text-[var(--color-text-main)] mt-1">
            5 <span className="text-sm md:text-base text-[var(--color-text-secondary)] font-normal">/ 12</span>
          </span>
          <span className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-1 whitespace-nowrap font-medium">
            Exploration
          </span>
        </div>

        {/* Echoes / Messages sent */}
        <div className="flex flex-col items-center text-center px-2">
          <div className="text-[#00C4CC] mb-2 bg-[#00C4CC]/10 p-2.5 rounded-full">
            <MessageSquare size={22} />
          </div>
          <span className="text-xl md:text-2xl font-bold text-[var(--color-text-main)] mt-1">
            12
          </span>
          <span className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-1 whitespace-nowrap font-medium">
            Echoes Sent
          </span>
        </div>

        {/* Likes Received */}
        <div className="flex flex-col items-center text-center px-2">
          <div className="text-[#FF4081] mb-2 bg-[#FF4081]/10 p-2.5 rounded-full">
            <Heart size={22} />
          </div>
          <span className="text-xl md:text-2xl font-bold text-[var(--color-text-main)] mt-1">
            128
          </span>
          <span className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-1 whitespace-nowrap font-medium">
            Likes
          </span>
        </div>

      </div>
    </div>
  );
};