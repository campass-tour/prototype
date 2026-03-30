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
      className={`w-[180px] rounded-[16px] bg-white p-4 shadow-md transition-all duration-300
        ${isLocked ? "opacity-70 grayscale" : "hover:-translate-y-1"}
        ${isNew ? "ring-2 ring-cyan-400" : ""}
      `}
    >
      <div className="relative mb-3 flex h-[120px] items-center justify-center rounded-[12px] bg-[#F5F6FA]">
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
                ? "bg-gray-200 text-gray-600"
                : isNew
                ? "bg-cyan-400 text-white"
                : "bg-[#281559] text-white"
            }`}
        >
          {isLocked ? "Locked" : isNew ? "New" : "Unlocked"}
        </span>
      </div>

      <h3 className="text-[18px] font-semibold text-[#1A1A1A]">
        {isLocked ? "???" : name}
      </h3>

      <p className="mt-1 text-[14px] text-gray-500">
        {isLocked ? "Unknown location" : location}
      </p>
    </div>
  );
}