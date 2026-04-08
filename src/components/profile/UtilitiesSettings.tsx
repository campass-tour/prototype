import React from 'react';
import { Info, LogOut, ChevronRight } from 'lucide-react';

export const UtilitiesSettings: React.FC = () => {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)] w-full border border-[var(--border)]">
      <div className="flex flex-col">
        {/* About Item */}
        <button className="w-full flex items-center justify-between px-6 py-5 border-b border-gray-100 hover:bg-[var(--color-background)] transition-colors group">
          <div className="flex items-center gap-4 text-[var(--color-text-main)]">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[var(--color-background)] transition-colors">
              <Info size={18} />
            </div>
            <span className="font-semibold text-[15px] md:text-base">About Campass</span>
          </div>
          <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
        </button>

        {/* Log Out Item */}
        <button className="w-full flex items-center justify-between px-6 py-5 hover:bg-red-50/50 transition-colors group">
          <div className="flex items-center gap-4 text-red-500 group-hover:text-red-600 transition-colors">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut size={18} />
            </div>
            <span className="font-semibold text-[15px] md:text-base">Log Out</span>
          </div>
        </button>
      </div>
    </div>
  );
};