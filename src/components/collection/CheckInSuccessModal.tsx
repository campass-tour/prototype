type CheckInSuccessModalProps = {
  open: boolean;
  onClose: () => void;
  locationName: string;
  mascotName: string;
  current: number;
  total: number;
  image?: string;
  onViewCollection?: () => void;
  onEnterAR?: () => void;
};

export default function CheckInSuccessModal({
  open,
  onClose,
  locationName,
  mascotName,
  current,
  total,
  image,
  onViewCollection,
  onEnterAR,
}: CheckInSuccessModalProps) {
  if (!open) return null;

  const safeTotal = total > 0 ? total : 1;
  const percentage = Math.min((current / safeTotal) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-[16px] border border-[var(--color-primary)]/20 bg-[var(--color-surface)]/80 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-main)]"
        >
          ×
        </button>

        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
          {image ? (
            <img
              src={image}
              alt={mascotName}
              className="h-20 w-20 object-cover rounded-full"
            />
          ) : (
            <div className="text-6xl animate-bounce">🐦</div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
            Check-in Successful
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
            {mascotName}
          </h2>

          <p className="mt-2 text-[15px] text-[var(--color-text-secondary)]">
            You discovered{" "}
            <span className="font-semibold text-[var(--color-primary)]">
              {locationName}
            </span>{" "}
            and unlocked a new campus mascot.
          </p>
        </div>

        <div className="mt-6 rounded-[12px] bg-[var(--color-background)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-text-main)]">
              Collection Progress
            </span>
            <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-sm font-medium text-white">
              {current} / {total}
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-state-disabled)]">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-2 text-right text-sm text-[var(--color-text-secondary)]">
            {Math.round(percentage)}% collected
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
  <button
    onClick={onViewCollection || onClose}
    className="flex-1 rounded-[8px] border border-[var(--color-state-disabled)] bg-[var(--color-surface)] px-4 py-3 font-medium text-[var(--color-text-main)] transition hover:bg-[var(--color-background)]"
  >
    View Collection
  </button>

  <button
    onClick={onEnterAR || onClose}
    className="flex-1 rounded-[8px] bg-[var(--color-accent)] px-4 py-3 font-medium text-white transition hover:opacity-90"
  >
    Enter AR Capture
  </button>
</div>
      </div>
    </div>
  );
}