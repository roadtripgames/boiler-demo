import React, { useCallback, useState } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronDownIcon,
  DividerHorizontalIcon,
} from "@radix-ui/react-icons";
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuProps as _DropdownMenuProps,
} from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import Spinner from "./Spinner";

type DropdownMenuProps = _DropdownMenuProps & {
  className?: string;
  contentClassName?: string;
  placeholder?: string;
  values: string[];
  value?: string;
  defaultValue?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  className,
  contentClassName,
  placeholder,
  values,
  value: _value,
  defaultValue,
  onSelect,
  disabled,
  loading,
  ...props
}) => {
  const [value, setValue] = useState<string | undefined>(
    _value ?? defaultValue ?? undefined
  );

  const handleSelect = useCallback(
    (v: string) => {
      if (!disabled) {
        setValue(v);
        onSelect?.(v);
      }
    },
    [disabled, onSelect]
  );

  return (
    <DropdownMenuPrimitive.Root {...props}>
      <DropdownMenuContent className={clsx("", contentClassName)}>
        {values.map((v) => (
          <DropdownMenuItem envKey={v} onSelect={() => handleSelect(v)}>
            {v}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
      <DropdownMenuTrigger
        disabled={disabled}
        asChild
        className={clsx(
          "rounded-md border border-slate-300 bg-white shadow-sm",
          "h-10 px-4",
          {
            "hover:border-slate-400": !disabled,
            "bg-slate-50": disabled,
          }
        )}
      >
        <button
          className={clsx(
            "flex select-none items-center justify-between gap-x-2",
            className
          )}
        >
          {!value && placeholder && (
            <span className="text-slate-500">{placeholder}</span>
          )}
          {loading ? (
            <Spinner size="small" />
          ) : (
            <span className="">{value}</span>
          )}
          <ChevronDownIcon />
        </button>
      </DropdownMenuTrigger>
    </DropdownMenuPrimitive.Root>
  );
};

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        {...props}
        ref={forwardedRef}
        className={clsx(
          "animate-slideDownAndFadeIn rounded-md bg-white py-1 shadow-lg transition"
        )}
        align="start"
        sideOffset={5}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuLabel = DropdownMenuPrimitive.Label;
export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Item
      {...props}
      ref={forwardedRef}
      className={clsx(
        "relative flex h-9 cursor-pointer items-center pl-4 pr-12 outline-none",
        "text-slate-800 data-[highlighted]:bg-primary-100"
      )}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
});

DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

export const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem {...props} ref={forwardedRef}>
      {children}
      <DropdownMenuPrimitive.ItemIndicator>
        {props.checked === "indeterminate" && <DividerHorizontalIcon />}
        {props.checked === true && <CheckIcon />}
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuRadioItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.RadioItem {...props} ref={forwardedRef}>
      {children}
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.RadioItem>
  );
});

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
