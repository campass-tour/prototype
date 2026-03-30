type MascotCardProps = {
  name: string;
  location: string;
  image?: string;
  status: "locked" | "unlocked" | "new";
};

export default function MascotCard({
  name,
  location,
  image,
  status,
}: MascotCardProps) {
  const isLocked = status === "locked";
  const isNew = status === "new";

  return (
    <div
      className={`w-[180px] rounded-[16px] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] transition-all duration-300 border border-[var(--color-state-disabled)]
        ${isLocked ? "opacity-70 grayscale" : "hover:-translate-y-1"}
        ${isNew ? "ring-2 ring-[var(--color-accent)]" : ""}
      `}
    >
      <div className="relative mb-3 flex h-[120px] items-center justify-center rounded-[12px] bg-[var(--color-background)]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full rounded-[12px] object-cover"
          />
        ) : (
          <div className="text-5xl">{isLocked ? "🔒" : "🐦"}</div>
        )}

        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-medium
            ${
              isLocked
                ? "bg-[var(--color-state-disabled)] text-[var(--color-text-secondary)]"
                : isNew
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-primary)] text-white"
            }`}
        >
          {isLocked ? "Locked" : isNew ? "New" : "Unlocked"}
        </span>
      </div>

      <h3 className="text-[18px] font-semibold text-[var(--color-text-main)]">
        {isLocked ? "???" : name}
      </h3>

      <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">
        {isLocked ? "Unknown location" : location}
      </p>
    </div>
  );
}