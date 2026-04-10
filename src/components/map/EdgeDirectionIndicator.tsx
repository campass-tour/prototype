
import React from 'react';

interface Props {
  visible: boolean;
  bearing: number; // 只需要这个参数！
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
  targetName
}) => {
  if (!visible) return null;

  // 🌟 关键：直接使用 bearing，不做任何减法运算！
  // 此时指针会根据你的位置，永远指向目标建筑的方向
  const pointerRotation = bearing;

  const cardinal = bearingToCardinal(bearing);
  const targetLabel = targetName || 'Campus';

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[50] pointer-events-none">
      <div className="flex items-center gap-3 px-4 py-2 bg-white/85 backdrop-blur-md rounded-full shadow-lg border border-primary/10">
        {/* 雷达 Icon */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
            <circle cx="32" cy="32" r="3" fill="var(--color-primary)" />
            {/* 🌟 只有这里旋转，且只受 bearing 影响 */}
            <g style={{ transform: `rotate(${pointerRotation}deg)`, transformOrigin: '32px 32px' }}>
              <path d="M32 8 L40 38 L32 33 L24 38 Z" fill="var(--color-accent)" />
            </g>
          </svg>
        </div>
        {/* 适配手机/电脑的响应式文案 */}
        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            DIRECTION
          </span>
          <span className="text-sm font-bold text-[var(--color-primary)] whitespace-nowrap">
            {targetLabel} is {cardinal}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EdgeDirectionIndicator;
