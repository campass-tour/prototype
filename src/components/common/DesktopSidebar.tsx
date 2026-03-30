import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { TabId } from './MainLayout';

interface DesktopSidebarProps {
  tabs: { id: TabId; label: string; icon: React.ElementType }[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function DesktopSidebar({ tabs, activeTab, onTabChange, isDarkMode, toggleDarkMode }: DesktopSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--color-surface)] shadow-[2px_0_12px_rgba(0,0,0,0.03)] z-20 shrink-0 h-full border-r border-[var(--color-state-disabled)] relative">
      <button 
        onClick={toggleDarkMode}
        className="absolute left-4 top-4 p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      <div className="p-8 pb-4 flex items-center justify-center">
        <h1 className="campass-logo font-extrabold text-4xl tracking-tight flex select-none">
          <span className="text-[var(--color-logo-cam)]">Cam</span>
          <span className="text-[var(--color-logo-pass)]">pass</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-3 mt-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center space-x-4 w-full px-5 py-4 rounded-xl transition-all duration-200 font-semibold text-base",
                isActive 
                  ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20" 
                  : "text-[var(--color-text-secondary)] hover:bg-gray-50 hover:text-[var(--color-text-main)]"
              )}
            >
              <Icon size={22} className={isActive ? "text-white" : ""} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  );
}