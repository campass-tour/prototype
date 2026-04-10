import React from 'react';

interface Props {
  visible: boolean;
  bearing: number; // 目标相对于正北的绝对角度 (0-360)
  deviceHeading?: number | null; // 手机当前朝向相对于正北的角度 (0-360)
  targetName?: string | null;
}

// 将角度转换为自然语言方位
function bearingToCardinal(bearing: number) {
  const sectors = [
    'North', 'Northeast', 'East', 'Southeast',
    'South', 'Southwest', 'West', 'Northwest'
  ];
  const b = ((bearing % 360) + 360) % 360;
  const index = Math.floor(((b + 22.5) % 360) / 45);
  return sectors[index];
}

export const EdgeDirectionIndicator: React.FC<Props> = ({
  visible,
  bearing,
  deviceHeading,
  targetName
}) => {
  if (!visible) return null;

  // 目标角度 - 手机朝向 = 指针在屏幕上的实际旋转角度
  const currentHeading = deviceHeading || 0;
  const pointerRotation = - (bearing - currentHeading);

  const cardinal = bearingToCardinal(bearing);
  const targetLabel = targetName || 'Campus';

  return (
    <div className="absolute top-4 left-4 sm:top-6 sm:left-1/2 sm:-translate-x-1/2 z-[50] pointer-events-none transition-all duration-300">
      <div className="flex items-center gap-3 md:gap-4 px-4 py-2 md:px-6 md:py-3 bg-white/85 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(40,21,89,0.12)] border border-[var(--color-primary)]/10">
        {/* 自定义雷达 Icon */}
        <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
            {/* 外圈雷达虚线轨道 */}
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
            {/* 内圈雷达底盘 */}
            <circle cx="32" cy="32" r="22" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="1" opacity="0.6" />
            {/* 中心锚点 */}
            <circle cx="32" cy="32" r="3" fill="var(--color-primary)" />
            {/* 旋转的指针组 */}
            <g
              style={{
                transform: `rotate(${pointerRotation}deg)`,
                transformOrigin: '32px 32px',
              }}
            >
              {/* 指针发光阴影 */}
              <path d="M32 6 L42 40 L32 34 L22 40 Z" fill="var(--color-accent)" opacity="0.4" filter="blur(3px)" />
              {/* 实体立体指针 */}
              <path d="M32 8 L40 38 L32 33 Z" fill="var(--color-accent)" />
              <path d="M32 8 L24 38 L32 33 Z" fill="#009B9E" />
            </g>
          </svg>
        </div>
        {/* 响应式文案排版 */}
        <div className="flex flex-col justify-center">
          {/* 仅在 md 及以上显示目标名称 */}
          <span className="hidden md:block text-[10px] md:text-xs font-semibold tracking-wider text-[var(--color-text-secondary)] uppercase">
            TARGET: {targetLabel}
          </span>
          {/* 方位 (手机端精简，电脑端详尽) */}
          <span className="text-sm md:text-base font-bold text-[var(--color-primary)] whitespace-nowrap">
            {/* 手机端显示：Head {cardinal} */}
            <span className="sm:hidden">Head {cardinal}</span>
            {/* 电脑端/平板显示：Target is to your {cardinal} */}
            <span className="hidden sm:inline">Signal lost. Head {cardinal}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EdgeDirectionIndicator;
