import { Inbox } from 'lucide-react';
import type { WardrobeItem } from '../../types';
import { WardrobeStudioItemImage } from './WardrobeStudioIcons';

type WardrobeStudioGridProps = {
  items: WardrobeItem[];
  selectedItemId: string | null;
  onSelectItem: (item: WardrobeItem) => void;
};

export default function WardrobeStudioGrid({
  items,
  selectedItemId,
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
    <div className="grid grid-cols-2 gap-3 pb-1 md:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const isSelected = selectedItemId === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectItem(item)}
            className={`flex aspect-square min-w-0 w-full flex-col justify-between rounded-[var(--radius-card)] border p-3 text-left transition ${
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
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--color-text-main)]">{item.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
