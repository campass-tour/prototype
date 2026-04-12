import React from 'react';
import { Search, X } from 'lucide-react';

interface WallSearchBarProps {
  value: string;
  onValueChange: (value: string) => void;
  onClear: () => void;
  resultCount: number;
  totalCount: number;
}

export const WallSearchBar: React.FC<WallSearchBarProps> = ({
  value,
  onValueChange,
  onClear,
  resultCount,
  totalCount,
}) => {
  const hasValue = value.trim().length > 0;

  return (
    <div className="w-full bg-[var(--color-surface)] shadow-[var(--shadow-card)] rounded-[var(--radius-card)] border border-[var(--border)] px-4 py-3">
      <div className="relative w-full">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-secondary)"
          aria-hidden="true"
        />
        <input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClear();
          }}
          placeholder="Search by text, author, or location…"
          aria-label="Search messages"
          className="w-full h-10 rounded-[var(--radius-button)] border border-[var(--border)] bg-(--color-background) pl-10 pr-10 text-sm text-(--color-text-main) placeholder:text-(--color-text-secondary) shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {hasValue && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-[var(--radius-button)] text-(--color-text-secondary) hover:bg-(--accent-bg) hover:text-(--color-text-main) transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-(--color-text-secondary)">
        <span>
          {resultCount}
          {resultCount === 1 ? ' result' : ' results'}
          {hasValue && totalCount !== resultCount ? ` (of ${totalCount})` : ''}
        </span>
        {hasValue && (
          <span className="hidden sm:inline">Press Esc to clear</span>
        )}
      </div>
    </div>
  );
};

export default WallSearchBar;
