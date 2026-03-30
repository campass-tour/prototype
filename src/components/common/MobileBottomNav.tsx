import React from 'react';
import { cn } from '../../lib/utils';
import type { TabId } from './MainLayout';

interface MobileBottomNavProps {
  tabs: { id: TabId; label: string; icon: React.ElementType }[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function MobileBottomNav({ tabs, activeTab, onTabChange }: MobileBottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex justify-around items-center px-2 py-2 pb-safe z-20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center w-16 py-2 transition-colors focus:outline-none"
          >
            <div 
              className={cn(
                "flex items-center justify-center p-1.5 rounded-full transition-all duration-300",
                isActive ? "bg-[#28155915]" : "bg-transparent"
              )}
            >
              <Icon 
                size={24} 
                className={isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"} 
                strokeWidth={isActive ? 2.5 : 2}
              />
            </div>
            <span 
              className={cn(
                "text-[10px] mt-1 font-medium",
                isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  );
}