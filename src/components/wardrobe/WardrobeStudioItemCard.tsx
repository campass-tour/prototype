import type { WardrobeItem } from '../../types';
import { WardrobeStudioItemImage } from './WardrobeStudioIcons';

type WardrobeStudioItemCardProps = {
  item: WardrobeItem;
  isSelected: boolean;
  statusLabel?: string | null;
  onSelect: (item: WardrobeItem) => void;
  /** Keep description in data, but allow the UI to omit it for now. */
  showDescription?: boolean;
};

export default function WardrobeStudioItemCard({
  item,
  isSelected,
  statusLabel,
  onSelect,
  showDescription = true,
}: WardrobeStudioItemCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`flex w-[min(46vw,10.5rem)] flex-none aspect-square flex-col justify-between rounded-[var(--radius-card)] border p-3 text-left transition md:w-auto md:flex-auto ${
        isSelected
          ? 'border-[var(--color-primary)] bg-[var(--collection-progress-ring-center)] shadow-[var(--collection-capsule-shadow)]'
          : 'border-[var(--collection-capsule-border)] bg-[var(--color-surface)]'
      }`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[var(--wall-select-icon-bg)]">
          <WardrobeStudioItemImage
            imageFile={item.icon}
            alt={item.name}
            className="h-full w-full object-contain"
          />
        </span>
        {statusLabel ? (
          <span className="rounded-full bg-[var(--wall-select-bg)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--collection-progress-kicker)]">
            {statusLabel}
          </span>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-semibold text-[var(--color-text-main)]">{item.name}</p>
        {showDescription ? (
          <p className="mt-1 line-clamp-2 text-xs text-[var(--collection-progress-copy)]">{item.description}</p>
        ) : null}
      </div>
    </button>
  );
}
