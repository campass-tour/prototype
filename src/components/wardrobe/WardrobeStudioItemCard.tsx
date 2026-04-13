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
      className={`flex aspect-square min-w-0 w-full flex-col items-center justify-center gap-1.5 rounded-[var(--radius-card)] border px-1.5 py-1.5 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] md:items-start md:gap-3 md:px-3 md:py-3 md:text-left ${
        isSelected
          ? 'border-[var(--color-primary)] bg-[var(--collection-progress-ring-center)] shadow-[var(--collection-capsule-shadow)]'
          : 'border-[var(--collection-capsule-border)] bg-[var(--color-surface)]'
      }`}
      aria-pressed={isSelected}
    >
      <div className="flex w-full items-center justify-center gap-1 md:justify-between">
        <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[var(--wall-select-icon-bg)] md:h-14 md:w-14">
          <WardrobeStudioItemImage
            imageFile={item.icon}
            alt={item.name}
            className="h-full w-full object-contain"
          />
          </span>
        {statusLabel ? (
          <span className="hidden rounded-full bg-[var(--wall-select-bg)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--collection-progress-kicker)] md:inline-flex">
            {statusLabel}
          </span>
        ) : null}
      </div>

      <div className="hidden w-full text-center md:block md:text-left">
        <p className="text-sm font-semibold text-[var(--color-text-main)]">{item.name}</p>
        {showDescription ? (
          <p className="mt-1 line-clamp-2 text-xs text-[var(--collection-progress-copy)]">{item.description}</p>
        ) : null}
      </div>
    </button>
  );
}
