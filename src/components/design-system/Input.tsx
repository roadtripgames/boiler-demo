import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import cn from "../../lib/cn";

const inputVariants = cva(
  "flex h-10 w-full rounded-md bg-transparent py-2 text-sm placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white border border-slate-300 px-3 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2",
        flush: "border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  iconLeft?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, className, iconLeft, ...props }, ref) => {
    return (
      <>
        {iconLeft && <i className="absolute mt-3 ml-3">{iconLeft}</i>}
        <input
          className={cn(inputVariants({ variant, className }), {
            "pl-9": iconLeft,
          })}
          ref={ref}
          {...props}
        />
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
