import clsx from "clsx";
import Image from "next/image";

export type AvatarProps = {
  className?: string;
  src?: string | null;
  name?: string | null;
  size?: "sm" | "lg";
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  className,
  size = "sm",
}) => {
  const letter = name?.[0] ?? "?";

  return (
    <div
      className={clsx(
        "flex select-none items-center justify-center rounded-full border bg-slate-50 text-lg",
        {
          "h-10 w-10 text-lg": size === "sm",
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
