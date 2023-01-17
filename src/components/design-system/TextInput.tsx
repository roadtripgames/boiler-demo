import clsx from "clsx";
import { useEffect, useState } from "react";

export type TextInputProps = {
  className?: string;

  variant?: "outline" | "flush";
  placeholder?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type HTMLInputProps = React.ComponentPropsWithoutRef<"input">;

export const TextInput: React.FC<TextInputProps & HTMLInputProps> = ({
  className,
  variant = "outline",
  placeholder,
  value,
  // value: _value,
  defaultValue,
  onValueChange,
  ...props
}) => {
  // const [value, setValue] = useState<HTMLInputProps["value"]>(
  //   _value ?? defaultValue ?? ""
  // );

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue(e.target.value);
  //   onValueChange?.(e.target.value);
  // };

  // useEffect(() => {
  //   setValue(_value);
  // }, [_value]);

  return (
    <input
      className={clsx(
        "flex h-10 items-center",
        "disabled:select-none",
        className,
        {
          "rounded-md border border-slate-200 bg-white px-3 outline-primary-500 hover:border-slate-300":
            variant === "outline",
          "outline-none": variant === "flush",
        }
      )}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onValueChange?.(e.target.value)}
      {...props}
    />
  );
};
