import { useEffect, useState } from 'react';
import { WARDROBE_DEFAULT_STATE, WARDROBE_ITEMS } from '../constants/wardrobeCatalog';
import { getWardrobeStudioState, setWardrobeStudioState } from '../lib/wardrobeStudioStorage';
import type { WardrobeCategoryId, WardrobeItem, WardrobeState } from '../types';

type StudioAction = 'buy' | 'equip' | 'unequip' | 'idle';

const getItemById = (itemId: string | null) =>
  itemId ? WARDROBE_ITEMS.find((item) => item.id === itemId) ?? null : null;

export function useWardrobeStudio() {
  const [studioState, setStudioState] = useState<WardrobeState>(WARDROBE_DEFAULT_STATE);
  const [selectedCategory, setSelectedCategory] = useState<WardrobeCategoryId>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [resetViewKey, setResetViewKey] = useState(0);

  useEffect(() => {
    setStudioState(getWardrobeStudioState());
  }, []);

  useEffect(() => {
    setWardrobeStudioState(studioState);
  }, [studioState]);

  const selectedItem = getItemById(selectedItemId);
  const filteredItems = WARDROBE_ITEMS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const previewItem = selectedItem ?? null;
  const selectedOwned = !!selectedItem && studioState.ownedItemIds.includes(selectedItem.id);
  const selectedEquipped = !!selectedItem && studioState.equippedBySlot[selectedItem.category] === selectedItem.id;

  const canAfford = !!selectedItem && studioState.balance >= selectedItem.price;
  const action: StudioAction = !selectedItem
    ? 'idle'
    : !selectedOwned && selectedItem.price > 0
      ? 'buy'
      : selectedEquipped
        ? 'unequip'
        : selectedOwned
          ? 'equip'
          : 'idle';

  const actionDisabled = action === 'idle' || (action === 'buy' && !canAfford);

  const handleSelectItem = (item: WardrobeItem) => {
    setSelectedItemId(item.id);
  };

  const handlePrimaryAction = () => {
    if (!selectedItem) return;

    if (!selectedOwned && action === 'buy') {
      if (!canAfford) return;
      setStudioState((current) => ({
        balance: current.balance - selectedItem.price,
        ownedItemIds: current.ownedItemIds.includes(selectedItem.id)
          ? current.ownedItemIds
          : [...current.ownedItemIds, selectedItem.id],
        equippedBySlot: {
          ...current.equippedBySlot,
          [selectedItem.category]: selectedItem.id,
        },
      }));
      return;
    }

    if (!selectedOwned) return;

    if (selectedEquipped) {
      setStudioState((current) => {
        const nextEquippedBySlot = { ...current.equippedBySlot };
        delete nextEquippedBySlot[selectedItem.category];
        return {
          ...current,
          equippedBySlot: nextEquippedBySlot,
        };
      });
      return;
    }

    setStudioState((current) => ({
      ...current,
      equippedBySlot: {
        ...current.equippedBySlot,
        [selectedItem.category]: selectedItem.id,
      },
    }));
  };

  const handleResetView = () => {
    setResetViewKey((value) => value + 1);
  };

  const handleRandomLook = () => {
    const ownedItems = WARDROBE_ITEMS.filter((item) => studioState.ownedItemIds.includes(item.id));
    if (ownedItems.length === 0) return;

    const randomItem = ownedItems[Math.floor(Math.random() * ownedItems.length)] ?? null;
    if (!randomItem) return;

    setSelectedItemId(randomItem.id);
    setStudioState((current) => ({
      ...current,
      equippedBySlot: {
        ...current.equippedBySlot,
        [randomItem.category]: randomItem.id,
      },
    }));
  };

  const equippedItems = Object.values(studioState.equippedBySlot)
    .map((itemId) => getItemById(itemId ?? null))
    .filter((item): item is WardrobeItem => item !== null);

  return {
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
    selectedEquipped,
    selectedItem,
    selectedItemId,
    setSelectedCategory,
    studioState,
  };
}
