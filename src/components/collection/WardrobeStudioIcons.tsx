import {
  Glasses,
  LayoutGrid,
  Package2,
  ScanFace,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { WardrobeCategory, WardrobeIconName } from '../../types';

const itemIcons: Record<WardrobeIconName, LucideIcon> = {
  'badge-cent': Sparkles,
  'captain-band': Sparkles,
  'laurel-crown': Sparkles,
  'mono-shades': Glasses,
  'star-lens': Glasses,
  'field-notes': Package2,
  'campus-satchel': Package2,
  'signal-kite': Package2,
};

const categoryIcons: Record<WardrobeCategory['icon'], LucideIcon> = {
  LayoutGrid,
  Sparkles,
  ScanFace,
  Package2,
};

export function WardrobeStudioItemIcon({
  icon,
  className,
}: {
  icon: WardrobeIconName;
  className?: string;
}) {
  const Icon = itemIcons[icon] ?? Glasses;
  return <Icon className={className} />;
}

export function WardrobeStudioCategoryIcon({
  icon,
  className,
}: {
  icon: WardrobeCategory['icon'];
  className?: string;
}) {
  const Icon = categoryIcons[icon] ?? LayoutGrid;
  return <Icon className={className} />;
}
