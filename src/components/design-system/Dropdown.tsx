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

type DropdownMenuProps = _DropdownMenuProps & {
  className?: string;
  contentClassName?: string;
  placeholder?: string;
  values: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  className,
  contentClassName,
  placeholder,
  values,
  value: _value,
  defaultValue,
  onChange,
  disabled,
  ...props
}) => {
  const [value, setValue] = useState<string | undefined>(
    _value ?? defaultValue ?? undefined
  );

  const handleValueChange = useCallback(
    (v: string) => {
      if (!disabled) {
        setValue(v);
        onChange?.(v);
      }
    },
    [disabled, onChange]
  );

  return (
    <DropdownMenuPrimitive.Root {...props}>
      <DropdownMenuContent className={contentClassName}>
        {values.map((v) => (
          <DropdownMenuItem key={v} onSelect={() => handleValueChange(v)}>
            {v}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
      <DropdownMenuTrigger
        disabled={disabled}
        asChild
        className="h-10 rounded-md border border-slate-300 bg-white px-4 outline-2 outline-primary-500 hover:border-slate-400 data-[state=open]:outline data-[state=open]:outline-primary-500"
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
          {value && <span className="">{value}</span>}
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
          "animate-slideDownAndFade rounded-md bg-white py-1 shadow-lg transition"
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
        "relative flex h-10 cursor-pointer items-center pl-4 pr-12 outline-none",
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
