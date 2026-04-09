import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface EditProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileDrawer: React.FC<EditProfileDrawerProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center" style={{ zIndex: 'var(--z-overlay)' }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-[var(--color-surface)] rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 shadow-xl transform transition-transform animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8" style={{ zIndex: 'var(--z-modal)' }}>
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text-main)] m-0">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-[var(--color-background)] text-[var(--color-text-secondary)] transition-colors"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Avatar Presets Selection */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-3">
              Choose Avatar
            </label>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-16 h-16 rounded-full cursor-pointer snap-center shrink-0 border-2 ${i === 1 ? 'border-[var(--color-primary)]' : 'border-transparent'}`}>
                  <img 
                    src={`https://picui.ogmua.cn/s1/2026/04/08/69d56b9761229.webp`}
                    alt={`Avatar option ${i}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Nickname Input */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2" htmlFor="nickname">
              Nickname
            </label>
            <input 
              id="nickname"
              type="text" 
              defaultValue="Jane Doe"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all bg-[var(--color-background)]"
            />
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileDrawer;