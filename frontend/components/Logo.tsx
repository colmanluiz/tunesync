import { IoSyncCircle } from "react-icons/io5";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function Logo({
  className = "",
  iconClassName = "",
  textClassName = "",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <IoSyncCircle
        className={`w-8 h-8 text-(--honeysuckle-150) ${iconClassName}`}
      />
      <span
        className={`text-2xl font-bold font-satoshi text-(--honeysuckle-950) ${textClassName}`}
      >
        Tune
        <span className="text-(--honeysuckle-150)">Sync</span>
      </span>
    </div>
  );
}
