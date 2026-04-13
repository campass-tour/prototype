import { Coins } from 'lucide-react';

type WardrobeStudioCreditsProps = {
  credits: number;
  className?: string;
};

export default function WardrobeStudioCredits({
  credits,
  className = '',
}: WardrobeStudioCreditsProps) {
  return (
    <div
      className={`inline-flex min-w-0 items-center gap-2 rounded-full border border-[var(--collection-capsule-border)] bg-[var(--collection-capsule-bg)] px-3 py-2 text-sm font-semibold text-[var(--color-text-main)] shadow-[var(--collection-capsule-shadow)] backdrop-blur-xl ${className}`}
    >
      <Coins className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
      <span className="min-w-0 whitespace-nowrap text-[11px] font-semibold tabular-nums sm:text-sm">
        <span className="max-[359px]:hidden">Credits </span>
        <span className="hidden max-[359px]:inline">CR </span>
        {credits}
      </span>
    </div>
  );
}
