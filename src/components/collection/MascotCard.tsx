import { useState, useEffect } from 'react';

type MascotCardProps = {
  name: string;
  location: string;
  image?: string;
  status: "locked" | "unlocked" | "new";
};

export default function MascotCard({
  name,
  location,
  image,
  status,
}: MascotCardProps) {
  const isLocked = status === "locked";
  const isNew = status === "new";
  const [tiltAngle, setTiltAngle] = useState(0);

  useEffect(() => {
    if (isLocked || typeof window === 'undefined') return;

    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission !== 'granted') return;
        } catch (error) {
          return;
        }
      }

      const handleOrientation = (event: DeviceOrientationEvent) => {
        const beta = event.beta || 0; // 前后倾斜
        const gamma = event.gamma || 0; // 左右倾斜
        // 计算角度，限制在 -45 到 45 度之间
        const angle = Math.max(-45, Math.min(45, Math.atan2(gamma, beta) * 180 / Math.PI));
        setTiltAngle(angle);
      };

      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    };

    requestPermission();
  }, [isLocked]);

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl bg-[var(--color-surface)] p-4 shadow-sm transition-all duration-500 ease-out border border-[var(--color-state-disabled)]/30
        ${isLocked ? "opacity-75 grayscale" : "hover:-translate-y-2 hover:shadow-xl hover:border-[var(--color-primary)]/50"}
        ${isNew ? "ring-2 ring-[var(--color-accent)]" : ""}
      `}
    >
      <div className="relative mb-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--color-background)]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="text-5xl transition-transform duration-500 group-hover:scale-110">
            {isLocked ? "🔒" : "🐦"}
          </div>
        )}

        {/* Status Badge */}
        <span
          className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm transition-colors duration-300
            ${
              isLocked
                ? "bg-black/40 text-white/90"
                : isNew
                ? "bg-[var(--color-accent)]/90 text-white"
                : "bg-[var(--color-primary)]/90 text-white"
            }`}
        >
          {isLocked ? "Locked" : isNew ? "New" : "Unlocked"}
        </span>
        
        {/* Subtle overlay gradient on hover */}
        {!isLocked && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        )}

        {/* Rainbow laser sheen for unlocked cards on mobile */}
        {!isLocked && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-200"
            style={{
              background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,0,255,0.4) 60deg, rgba(0,255,255,0.4) 120deg, rgba(255,255,0,0.4) 180deg, rgba(255,0,255,0.4) 240deg, transparent 300deg)',
              transform: `rotate(${tiltAngle}deg)`,
              transformOrigin: 'center',
              filter: 'blur(1px)',
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-1 transition-transform duration-500">
        <h3 className="text-lg font-bold text-[var(--color-text-main)] transition-colors duration-300 group-hover:text-[var(--color-primary)] line-clamp-1">
          {isLocked ? "???" : name}
        </h3>

        <p className="text-sm font-medium text-[var(--color-text-secondary)] line-clamp-1 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          {!isLocked && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          {isLocked ? "Unknown location" : location}
        </p>
      </div>
    </div>
  );
}