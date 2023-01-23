import clsx from "clsx";
import React from "react";
import Spinner from "./Spinner";

export type ButtonProps = {
  className?: string;
  variant?: "primary" | "outline" | "link";
  loading?: boolean;
  loadingText?: string;
} & React.ComponentPropsWithoutRef<"button">;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      loading = false,
      loadingText = "",
      children,
      variant = "primary",
      ...props
    },
    forwardedRef
  ) => {
    const unclickable = props.disabled || loading;

    return (
      <button
        ref={forwardedRef}
        className={clsx(
          "h-9 rounded-md border border-transparent outline-primary-500 transition",
          {
            "px-3 shadow-sm": variant !== "link",

            "bg-primary-600 text-white": variant === "primary",
            "hover:bg-primary-500": variant === "primary" && !unclickable,
            "bg-primary-200": variant === "primary" && unclickable,

            "border border-slate-200 bg-white": variant === "outline",
            "hover:border-slate-300 hover:bg-slate-50":
              variant === "outline" && !unclickable,

            "font-semibold hover:text-primary-600":
              variant === "link" && !unclickable,

            "cursor-not-allowed": unclickable,
            "flex items-center gap-x-2": loading && loadingText,
          },
          className
        )}
        {...props}
      >
        {loading && loadingText && loadingText}
        {loading ? <Spinner size="small" /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";
