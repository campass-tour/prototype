import { Coins } from 'lucide-react';

type WardrobeStudioCreditsProps = {
  credits: number;
};

export default function WardrobeStudioCredits({ credits }: WardrobeStudioCreditsProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--collection-capsule-border)] bg-[var(--collection-capsule-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] shadow-[var(--collection-capsule-shadow)] backdrop-blur-xl">
      <Coins className="h-4 w-4 text-[var(--color-primary)]" />
      <span>Credits {credits}</span>
    </div>
  );
}

