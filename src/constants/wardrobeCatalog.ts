import wardrobeCatalogData from '../data/wardrobeCatalog.json';
import type { WardrobeCategory, WardrobeItem, WardrobeState } from '../types';

type WardrobeCatalog = {
  categories: WardrobeCategory[];
  items: WardrobeItem[];
};

const catalog = wardrobeCatalogData as WardrobeCatalog;

export const WARDROBE_CATEGORIES = catalog.categories;
export const WARDROBE_ITEMS = catalog.items;

export const WARDROBE_DEFAULT_STATE: WardrobeState = {
  balance: 0,
  ownedItemIds: WARDROBE_ITEMS.filter((item) => item.ownedByDefault).map((item) => item.id),
  equippedBySlot: {},
};
