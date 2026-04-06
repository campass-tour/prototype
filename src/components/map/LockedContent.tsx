import React from 'react';

interface LockedContentProps {
  realBuildingName: string;
  hintImage?: string;
  hintText?: string;
}

export const LockedContent: React.FC<LockedContentProps> = ({
  hintImage,
  hintText
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold mb-[var(--spacing-3)] text-2xl leading-tight text-[var(--color-text-main)]">
        Mysterious Spot
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        {hintText || 'Find this exact spot to unlock its secrets.'}
      </p>
      <div className="relative w-full aspect-4/3 rounded-[var(--radius-card)] overflow-hidden bg-gray-200 shadow-inner">
        {hintImage ? (
          <img 
            src={hintImage} 
            alt="Location Clue" 
            className="w-full h-full object-cover blur-[6px] scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)] bg-[var(--color-state-disabled)] blur-sm">
            <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Blurred Clue Image</span>
          </div>
        )}
        {/* Overlay text for extra mystery */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span className="text-white font-bold text-sm tracking-wide">
              Clue Hidden
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
