import React, { useState, useEffect } from 'react';
import { Map, Backpack, MessageSquare, User, CircleUserRound, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabId = 'explore' | 'collection' | 'wall' | 'profile';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial user preference
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const tabs = [
    { id: 'explore' as TabId, label: 'Explore', icon: Map },
    { id: 'collection' as TabId, label: 'Collection', icon: Backpack },
    { id: 'wall' as TabId, label: 'Wall', icon: MessageSquare },
    { id: 'profile' as TabId, label: 'Profile', icon: User },
  ];

  return (
    <div className="flex md:flex-row flex-col h-screen w-full bg-[var(--color-background)] text-[var(--color-text-main)] font-sans">
      
      {/* Mobile Header (Hidden on Desktop) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] shadow-sm z-10 shrink-0 border-b border-[var(--color-state-disabled)]">
        <h1 className="campass-logo font-extrabold text-xl tracking-tight flex">
          <span className="text-[var(--color-logo-cam)]">Cam</span>
          <span className="text-[var(--color-logo-pass)]">pass</span>
        </h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] transition-colors"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button className="p-1 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] transition-colors">
            <CircleUserRound size={28} />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-[var(--color-surface)] shadow-[2px_0_12px_rgba(0,0,0,0.03)] z-20 shrink-0 h-full border-r border-[var(--color-state-disabled)] relative">
        {/* Dark mode toggle in top left */}
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

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Inner container scales to full height and width */}
          <div className="w-full h-full p-4 md:p-8 pb-24 md:pb-8 flex flex-col">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
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

    </div>
  );
}
