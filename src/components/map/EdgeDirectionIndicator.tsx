import React from 'react';
import { Compass, ArrowUp } from 'lucide-react';

interface Props {
  visible: boolean;
  bearing: number; // degrees from North (0-360)
  deviceHeading?: number | null; // degrees from North (0-360)
  targetName?: string | null;
}

function bearingToCardinal(bearing: number) {
  const sectors = [
    'North',
    'Northeast',
    'East',
    'Southeast',
    'South',
    'Southwest',
    'West',
    'Northwest',
  ];
  // normalize 0-360
  const b = ((bearing % 360) + 360) % 360;
  const index = Math.floor(((b + 22.5) % 360) / 45);
  return sectors[index];
}

export const EdgeDirectionIndicator: React.FC<Props> = ({ visible, bearing, deviceHeading, targetName }) => {
  if (!visible) return null;

  // rotation for compass dial based on bearing
  const compassRotation = ((bearing % 360) + 360) % 360;
  // rotation for arrow: if we have deviceHeading, rotate relative to device heading
  const arrowRotation = deviceHeading != null ? bearing - deviceHeading : bearing;
  const arrowRotationNorm = ((arrowRotation % 360) + 360) % 360;

  const cardinal = bearingToCardinal(bearing);
  const label = targetName ? `${targetName} is to your ${cardinal}` : `Campus is to your ${cardinal}`;

  return (
    <div className="absolute top-4 left-4 z-[9999] pointer-events-auto">
      <style>{`
        @keyframes arrow-swing { 0%{ transform: translateY(0) rotate(0deg);} 50%{ transform: translateY(-2px) rotate(6deg);} 100%{ transform: translateY(0) rotate(0deg);} }
      `}</style>

      <div className="flex items-center gap-4">
        {/* Rotating Compass */}
        <div 
          className="flex-shrink-0 relative"
          style={{ transform: `rotate(${compassRotation}deg)`, transition: 'transform 0.3s ease-out' }}
        >
          <div className="w-14 h-14 rounded-full bg-white/95 shadow-lg flex items-center justify-center text-[var(--color-primary)] border-2 border-[var(--color-primary)]/20">
            <Compass size={20} />
          </div>

          {/* Arrow pointing outward */}
          <div
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center"
            style={{ transform: `rotate(${arrowRotationNorm}deg)` }}
          >
            <div style={{ animation: 'arrow-swing 1.6s ease-in-out infinite' }}>
              <ArrowUp size={16} className="text-[var(--color-primary)]" />
            </div>
          </div>
        </div>

        {/* Label on the right */}
        <div className="text-sm font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );
};

export default EdgeDirectionIndicator;
