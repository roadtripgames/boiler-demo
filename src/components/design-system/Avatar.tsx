import clsx from "clsx";
import Image from "next/image";

export type AvatarProps = {
  className?: string;
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  className,
  size = "md",
}) => {
  const letter = name?.[0] ?? "?";

  return (
    <div
      className={clsx(
        "flex select-none items-center justify-center rounded-full border bg-slate-50",
        {
          "h-8 w-8 text-sm": size === "sm",
          "h-10 w-10 text-lg": size === "md",
          "h-24 w-24 text-3xl": size === "lg",
        },
        className
      )}
    >
      {src ? (
        <Image src={src} alt={"user profile picture"} />
      ) : (
        <span className="font-semibold">{letter}</span>
      )}
    </div>
  );
};
