type CollectionProgressBarProps = {
  current: number;
  total: number;
  title?: string;
};

export default function CollectionProgressBar({
  current,
  total,
  title = "Collection Progress",
}: CollectionProgressBarProps) {
  const safeTotal = total > 0 ? total : 1;
  const percentage = Math.min((current / safeTotal) * 100, 100);

  return (
    <div className="w-full rounded-[16px] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] border border-[var(--color-state-disabled)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-[var(--color-text-main)]">
            {title}
          </h2>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
            Keep exploring to unlock more campus birds.
          </p>
        </div>

        <div className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-sm font-medium text-white">
          {current} / {total}
        </div>
      </div>

      <div className="h-4 w-full overflow-hidden rounded-full bg-[var(--color-state-disabled)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-2 text-right text-sm text-[var(--color-text-secondary)]">
        {Math.round(percentage)}% collected
      </div>
    </div>
  );
}