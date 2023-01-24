import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import type {
  SelectProps as _SelectProps,
  SelectItemProps,
} from "@radix-ui/react-select";
import clsx from "clsx";

type SelectProps = _SelectProps & {
  placeholder?: React.ReactNode;
  variant?: "default" | "flush";
};

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ children, placeholder, variant = "default", ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          ref={forwardedRef}
          className={clsx(
            "inline-flex items-center justify-center gap-2 transition",
            "h-9",
            "bg-white text-base text-slate-900 hover:bg-slate-50",
            {
              "rounded-lg bg-white px-4 shadow": variant === "default",
            }
          )}
        >
          <SelectPrimitive.Value>{placeholder}</SelectPrimitive.Value>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="overflow-hidden rounded bg-white shadow-lg">
            <SelectPrimitive.ScrollUpButton>
              <ChevronUpIcon />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="p-2">
              {children}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton>
              <ChevronDownIcon />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  }
);

Select.displayName = "Select";

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectItemProps & { className?: string }
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Item
      {...props}
      ref={forwardedRef}
      className={clsx("flex h-12 items-center rounded px-8", className)}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

SelectItem.displayName = "SelectItem";
