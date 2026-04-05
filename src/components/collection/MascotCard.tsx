import { useState, useEffect } from 'react';
import bubblesUrl from '../../assets/image/bubbles.svg';

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
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isLocked || typeof window === 'undefined') return;

    // 只在移动端开启陀螺仪效果
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    if (!isMobile) {
      setParallax({ x: 0, y: 0 });
      return;
    }

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
        // 限制移动范围并增加平滑度
        const y = Math.max(-20, Math.min(20, (beta - 45) / 2));
        const x = Math.max(-20, Math.min(20, gamma / 2));
        setParallax({ x, y });
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
      <div className="relative mb-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl" style={{background: 'none'}}>
        {/* Parallax Gradient + Texture Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, rgba(168,192,255,0.18) 0%, rgba(211,184,255,0.16) 100%)`,
            transition: 'background-position 0.3s cubic-bezier(.4,2,.6,1)',
            backgroundSize: '200% 200%',
            backgroundPosition: `calc(50% + ${parallax.x * 0.7}px) calc(50% + ${parallax.y * 0.7}px)`
          }}
        />
        {/* Texture Overlay: bubbles only, above gradient, below mascot */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `url(${bubblesUrl})`,
            backgroundRepeat: 'repeat',
            opacity: 0.4
          }}
          
        />

        {/* Mascot / Image with Parallax Depth Effect */}
        <div
          className="relative z-20 w-full h-full flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
          style={{
            perspective: '800px',
            transform: !isLocked
              ? `rotateX(${-parallax.y * 1.5}deg) rotateY(${parallax.x * 1.5}deg) translateZ(40px) scale(1.05)`
              : 'translateY(10px) scale(1)',
            filter: !isLocked
              ? `drop-shadow(${parallax.x * -0.5}px ${parallax.y * 0.5 + 10}px 15px rgba(0,0,0,0.3))`
              : 'drop-shadow(0px 5px 5px rgba(0,0,0,0.1))'
          }}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="text-7xl transition-transform duration-500 group-hover:scale-110 drop-shadow-xl">
              {isLocked ? "🔒" : "🐦"}
            </div>
          )}
        </div>

        {/* Status Badge */}
        <span
          className={`absolute right-3 top-3 z-20 rounded-full px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm transition-colors duration-300
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
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
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