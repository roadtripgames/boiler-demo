import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import type {
  DialogContentProps,
  DialogTriggerProps,
} from "@radix-ui/react-dialog";
import clsx from "clsx";

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-slate-900 opacity-20" />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      className={clsx(
        props.className,
        "px-8 pt-12 pb-8",
        "rounded-lg bg-white shadow-xl",
        "fixed will-change-transform",
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "animate-modalSlideDownAndFadeIn"
      )}
    >
      {children}
      <DialogPrimitive.Close
        aria-label="Close"
        className="absolute top-4 right-4 rounded-full p-1 text-slate-500 hover:bg-primary-50 hover:text-primary-500"
      >
        <Cross1Icon className="h-3 w-3" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

DialogContent.displayName = "DialogContent";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Trigger {...props} ref={forwardedRef}>
    {children}
  </DialogPrimitive.Trigger>
));

DialogTrigger.displayName = "DialogTrigger";

export const DialogTitle = DialogPrimitive.Title;
