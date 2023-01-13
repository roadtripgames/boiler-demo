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
  placeholder?: string;
};

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          ref={forwardedRef}
          className={clsx(
            "inline-flex items-center justify-center gap-x-2 gap-y-2 transition",
            "h-12 rounded-lg px-4 shadow",
            "bg-white text-base text-slate-900 hover:bg-slate-50"
          )}
        >
          <SelectPrimitive.Value placeholder={props.placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
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

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Item
        {...props}
        ref={forwardedRef}
        className="flex h-12 items-center rounded px-8"
      >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  }
);
