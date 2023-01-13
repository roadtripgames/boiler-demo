import clsx from "clsx";
import { useState } from "react";

export type TextInputProps = {
  className?: string;

  variant?: "outline" | "flush";
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export const TextInput: React.FC<
  TextInputProps & React.ComponentPropsWithoutRef<"input">
> = ({
  className,
  variant = "outline",
  placeholder,
  value: _value,
  defaultValue,
  onValueChange,
  ...props
}) => {
  const [value, setValue] = useState<string | undefined>(
    _value ?? defaultValue ?? ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onValueChange?.(e.target.value);
  };

  return (
    <input
      className={clsx(
        "flex h-10 items-center",
        "disabled:select-none",
        className,
        {
          "rounded-md border border-slate-300 bg-white px-3 outline-primary-500":
            variant === "outline",
          "outline-none": variant === "flush",
        }
      )}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      {...props}
    />
  );
};
