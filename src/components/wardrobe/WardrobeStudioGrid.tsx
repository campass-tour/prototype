import { Inbox } from 'lucide-react';
import type { WardrobeItem } from '../../types';
import WardrobeStudioItemCard from './WardrobeStudioItemCard';

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
    <div className="grid grid-cols-3 gap-2 pb-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => {
        const isSelected = selectedItemId === item.id;

        return (
          <WardrobeStudioItemCard
            key={item.id}
            item={item}
            isSelected={isSelected}
            onSelect={onSelectItem}
          />
        );
      })}
    </div>
  );
}
