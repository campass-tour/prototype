import {
  LayoutGrid,
  Package2,
  ScanFace,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { WardrobeCategory } from '../../types';

const wardrobeImages = import.meta.glob('../../assets/image/**/*.{png,jpg,jpeg,webp,svg}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const categoryIcons: Record<WardrobeCategory['icon'], LucideIcon> = {
  LayoutGrid,
  Sparkles,
  ScanFace,
  Package2,
};

export function WardrobeStudioItemImage({
  imageFile,
  className,
  alt,
}: {
  /** Path relative to `src/assets/image/` (e.g. `clothes/sunglasses.png`). */
  imageFile: string;
  className?: string;
  alt: string;
}) {
  const src = wardrobeImages[`../../assets/image/${imageFile}`];
  // If the image is missing, we still render a box so layouts don't jump.
  if (!src) {
    return <span className={className} aria-label={alt} />;
  }

  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />;
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
