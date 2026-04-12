import WardrobeStudioActionBar from '../components/collection/WardrobeStudioActionBar';
import WardrobeStudioGrid from '../components/collection/WardrobeStudioGrid';
import WardrobeStudioHeader from '../components/collection/WardrobeStudioHeader';
import WardrobeStudioStage from '../components/collection/WardrobeStudioStage';
import WardrobeStudioTabs from '../components/collection/WardrobeStudioTabs';
import { useWardrobeStudio } from '../hooks/useWardrobeStudio';

export default function WardrobeStudioPage() {
  const {
    action,
    actionDisabled,
    canAfford,
    equippedItems,
    filteredItems,
    handlePrimaryAction,
    handleRandomLook,
    handleResetView,
    handleSelectItem,
    previewItem,
    resetViewKey,
    selectedCategory,
    selectedItem,
    selectedItemId,
    setSelectedCategory,
    studioState,
  } = useWardrobeStudio();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 bg-[var(--wall-page-bg)] px-2 pb-32 pt-4 md:gap-6 md:px-6 md:pb-10 md:pt-8">
      <WardrobeStudioHeader equippedCount={equippedItems.length} />

      {/* Mobile: stage (3/4) + wardrobe panel (1/4). Desktop keeps split layout. */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(22rem,1fr)] lg:gap-6">
        <div className="w-full lg:sticky lg:top-8 lg:self-start">
          <WardrobeStudioStage
            previewItem={previewItem}
            resetViewKey={resetViewKey}
            onResetView={handleResetView}
            onRandomLook={handleRandomLook}
          />
        </div>

        <section className="flex h-[35svh] min-h-40 flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--collection-capsule-border)] bg-[var(--collection-capsule-bg)] p-4 shadow-[var(--collection-capsule-shadow)] backdrop-blur-xl lg:h-auto">
          <div>
            <WardrobeStudioTabs
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="mt-3 flex-1">
            <WardrobeStudioGrid
              items={filteredItems}
              selectedItemId={selectedItemId}
              studioState={studioState}
              onSelectItem={handleSelectItem}
            />
          </div>

          <div className="mt-3 hidden lg:block">
            <WardrobeStudioActionBar
              action={action}
              disabled={actionDisabled}
              canAfford={canAfford}
              selectedItem={selectedItem}
              onPrimaryAction={handlePrimaryAction}
            />
          </div>
        </section>
      </div>

      {/* Mobile: keep the action bar outside the 1/4 panel so it never disappears. */}
      <div className="lg:hidden">
        <WardrobeStudioActionBar
          action={action}
          disabled={actionDisabled}
          canAfford={canAfford}
          selectedItem={selectedItem}
          onPrimaryAction={handlePrimaryAction}
        />
      </div>
    </div>
  );
}
