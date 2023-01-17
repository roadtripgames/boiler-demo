import clsx from "clsx";

export type ButtonProps = {
  className?: string;
  variant?: "primary" | "outline" | "link";
};

export const Button: React.FC<
  ButtonProps & React.ComponentPropsWithoutRef<"button">
> = ({ className, children, variant = "primary", ...props }) => {
  return (
    <button
      className={clsx(
        "h-9 rounded-md border border-transparent font-medium outline-primary-500 transition",
        {
          "px-3": variant !== "link",

          "bg-primary-600 text-white": variant === "primary",
          "hover:bg-primary-500": variant === "primary" && !props.disabled,

          "border border-slate-200 bg-white": variant === "outline",
          "hover:border-slate-300 hover:bg-slate-50":
            variant === "outline" && !props.disabled,

          "font-semibold hover:text-primary-600":
            variant === "link" && !props.disabled,

          "cursor-not-allowed bg-primary-200": props.disabled,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
