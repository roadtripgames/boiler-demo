import clsx from "clsx";

export type TextInputProps = {
  iconLeft?: React.ReactNode;
  className?: string;
  variant?: "outline" | "flush";
  placeholder?: string;
  onValueChange?: (value: string) => void;
};

type HTMLInputProps = React.ComponentPropsWithoutRef<"input">;

export const TextInput: React.FC<TextInputProps & HTMLInputProps> = ({
  iconLeft,
  className,
  variant = "outline",
  placeholder,
  value,
  onValueChange,
  ...props
}) => {
  return (
    <>
      {iconLeft && <i className="absolute mt-3 ml-3">{iconLeft}</i>}
      <input
        className={clsx(
          "flex h-10 items-center",
          "disabled:select-none",
          className,
          {
            "rounded-md border border-slate-300 px-3 outline-primary-500 hover:border-slate-400":
              variant === "outline",
            "bg-transparent outline-none": variant === "flush",
            "bg-white shadow-sm": variant !== "flush",
            "pl-9": !!iconLeft,
          }
        )}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      />
    </>
  );
};
