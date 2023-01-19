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
        "flex select-none items-center justify-center rounded-full bg-slate-50",
        {
          "h-8 w-8 text-sm": size === "sm",
          "h-10 w-10 text-lg": size === "md",
          "h-24 w-24 text-3xl": size === "lg",
          border: !src,
        },
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={"user profile picture"} className="rounded-full" />
      ) : (
        <span className="font-semibold">{letter}</span>
      )}
    </div>
  );
};
