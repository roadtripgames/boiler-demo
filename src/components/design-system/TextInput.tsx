import clsx from "clsx";
import { useEffect, useState } from "react";

export type TextInputProps = {
  iconLeft?: React.ReactNode;
  className?: string;
  variant?: "outline" | "flush";
  placeholder?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type HTMLInputProps = React.ComponentPropsWithoutRef<"input">;

export const TextInput: React.FC<TextInputProps & HTMLInputProps> = ({
  iconLeft,
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
    <>
      <i className="absolute mt-3 ml-3">{iconLeft}</i>
      <input
        className={clsx(
          "flex h-10 items-center",
          "disabled:select-none",
          className,
          {
            "rounded-md border border-slate-300 bg-white px-3 outline-primary-500 hover:border-slate-400":
              variant === "outline",
            "outline-none": variant === "flush",
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
