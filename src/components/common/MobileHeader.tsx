import { Sun, Moon, CircleUserRound } from 'lucide-react';

interface MobileHeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function MobileHeader({ isDarkMode, toggleDarkMode }: MobileHeaderProps) {
  return (
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
  );
}