import { Inbox } from 'lucide-react';
import type { WardrobeItem, WardrobeState } from '../../types';
import { WardrobeStudioItemIcon } from './WardrobeStudioIcons';

type WardrobeStudioGridProps = {
  items: WardrobeItem[];
  selectedItemId: string | null;
  studioState: WardrobeState;
  onSelectItem: (item: WardrobeItem) => void;
};

export default function WardrobeStudioGrid({
  items,
  selectedItemId,
  studioState,
  onSelectItem,
}: WardrobeStudioGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--collection-capsule-border)] bg-[var(--color-surface)] text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wall-select-icon-bg)] text-[var(--color-primary)]">
          <Inbox className="h-5 w-5" />
        </span>
        <p className="mt-4 text-sm font-semibold text-[var(--color-text-main)]">No wearable assets in this category yet</p>
        <p className="mt-2 max-w-xs text-sm text-[var(--collection-progress-copy)]">
          Add more entries to the wardrobe catalog JSON and they will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible xl:grid-cols-4">
      {items.map((item) => {
        const isSelected = selectedItemId === item.id;
        const isOwned = studioState.ownedItemIds.includes(item.id);
        const isEquipped = studioState.equippedBySlot[item.category] === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectItem(item)}
            className={`flex w-[min(46vw,10.5rem)] flex-none aspect-square flex-col justify-between rounded-[var(--radius-card)] border p-3 text-left transition md:w-auto md:flex-auto ${
              isSelected
                ? 'border-[var(--color-primary)] bg-[var(--collection-progress-ring-center)] shadow-[var(--collection-capsule-shadow)]'
                : 'border-[var(--collection-capsule-border)] bg-[var(--color-surface)]'
            }`}
            aria-pressed={isSelected}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--wall-select-icon-bg)] text-[var(--color-primary)]">
                <WardrobeStudioItemIcon icon={item.icon} className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-[var(--wall-select-bg)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--collection-progress-kicker)]">
                {isEquipped ? 'Equipped' : isOwned ? 'Owned' : 'Locked'}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--color-text-main)]">{item.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-[var(--collection-progress-copy)]">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
