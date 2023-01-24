import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import clsx from "clsx";
import React from "react";
import type { ALIGN_OPTIONS } from "@radix-ui/react-popper";

type DropdownSimpleProps = DropdownMenu.DropdownMenuProps & {
  trigger?: React.ReactNode;
  align?: (typeof ALIGN_OPTIONS)[number];
};

export const DropdownSimple: React.FC<DropdownSimpleProps> = ({
  trigger,
  children,
  align = "center",
  ...props
}) => {
  return (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          {...props}
          className={clsx(
            "animate-slideDownAndFadeIn rounded-md bg-white py-1 shadow-lg transition"
          )}
          align={align}
          sideOffset={5}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>
    </DropdownMenu.Root>
  );
};

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenu.DropdownMenuContentProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        {...props}
        ref={forwardedRef}
        className={clsx(
          "animate-slideDownAndFadeIn rounded-md bg-white py-1 shadow-lg transition"
        )}
        align="start"
        sideOffset={5}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownSimpleItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenu.DropdownMenuItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenu.Item
      {...props}
      ref={forwardedRef}
      className={clsx(
        "relative flex h-9 cursor-pointer items-center pl-4 pr-12 outline-none",
        "text-slate-800 data-[highlighted]:bg-primary-100",
        props.className
      )}
    >
      {children}
    </DropdownMenu.Item>
  );
});

DropdownSimpleItem.displayName = "DropdownMenuItem";
