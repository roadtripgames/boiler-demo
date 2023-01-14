import clsx from "clsx";
import Image from "next/image";

export type AvatarProps = {
  className?: string;
  src?: string | null;
  name?: string | null;
};

export const Avatar: React.FC<AvatarProps> = ({ name, src, className }) => {
  const letter = name?.[0] ?? "?";

  return (
    <div
      className={clsx(
        "flex h-10 w-10 select-none items-center justify-center rounded-full border bg-slate-50 text-lg",
        className
      )}
    >
      {src ? (
        <Image src={src} alt={"user profile picture"} />
      ) : (
        <span className="font-bold">{letter}</span>
      )}
    </div>
  );
};
