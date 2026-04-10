import React from 'react';
import { X } from 'lucide-react';

export interface SideDrawerProps {
  isOpen: boolean;
  width?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  width = 'w-[520px] max-w-[60vw]',
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-0 right-0 h-full ${width} bg-(--color-surface) dark:bg-(--color-surface) shadow-[-10px_0_40px_rgba(0,0,0,0.1)] z-100 flex flex-col border-l border-border animate-in slide-in-from-right duration-300`}
    >
      <button
        onClick={onClose}
        aria-label="Close drawer"
        className="absolute right-4 top-4 p-2 rounded-full hover:bg-(--color-divider) text-(--color-text-secondary) transition-colors"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  );
};

export default SideDrawer;