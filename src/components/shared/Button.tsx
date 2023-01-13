import clsx from "clsx";

export type ButtonProps = {
  className?: string;
  variant?: "primary" | "outline";
};

export const Button: React.FC<
  ButtonProps & React.ComponentPropsWithoutRef<"button">
> = ({ className, children, variant = "primary", ...props }) => {
  return (
    <button
      className={clsx(
        "h-9 rounded-md border border-transparent px-3 font-medium outline-primary-500 transition",
        {
          "bg-primary-600 text-white hover:bg-primary-500":
            variant === "primary",
          "border border-slate-200 bg-white hover:bg-slate-50":
            variant === "outline",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
