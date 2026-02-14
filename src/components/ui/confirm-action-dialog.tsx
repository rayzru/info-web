"use client";

import { type ReactNode, useState } from "react";

import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";

interface ConfirmActionDialogProps {
  /** Dialog title */
  title: string;
  /** Dialog description text or custom content */
  description: ReactNode;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text shown while loading */
  loadingText?: string;
  /** Button variant for confirm action */
  confirmVariant?: ButtonVariant;
  /** Whether the action is in progress */
  isLoading?: boolean;
  /** Callback when action is confirmed */
  onConfirm: () => void;
  /** Render as dropdown menu item instead of button */
  asMenuItem?: boolean;
  /** Icon for menu item or trigger button */
  icon?: ReactNode;
  /** Label for menu item or trigger button */
  triggerLabel?: string;
  /** Variant for the trigger button (when not asMenuItem) */
  triggerVariant?: ButtonVariant;
  /** Size for the trigger button (when not asMenuItem) */
  triggerSize?: ButtonSize;
  /** Additional trigger button className */
  triggerClassName?: string;
  /** Whether the menu item should show destructive styling */
  destructive?: boolean;
  /** Custom trigger element (overrides default button/menu item) */
  trigger?: ReactNode;
  /** Additional content to render in the dialog body (e.g., form fields) */
  children?: ReactNode;
  /** Control dialog open state externally */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmActionDialog({
  title,
  description,
  confirmText = "Подтвердить",
  loadingText = "Выполнение...",
  confirmVariant = "default",
  isLoading = false,
  onConfirm,
  asMenuItem = false,
  icon,
  triggerLabel,
  triggerVariant = "ghost",
  triggerSize = "icon",
  triggerClassName,
  destructive = false,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ConfirmActionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const handleConfirm = () => {
    onConfirm();
  };

  const dialogContent = (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className={cn(icon && "flex items-center gap-2")}>
          {icon}
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription asChild={typeof description !== "string"}>
          {typeof description === "string" ? description : <div>{description}</div>}
        </AlertDialogDescription>
      </AlertDialogHeader>
      {children}
      <AlertDialogFooter>
        <AlertDialogCancel>Отмена</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirm}
          disabled={isLoading}
          className={cn(
            confirmVariant === "destructive" &&
              "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          )}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? loadingText : confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  // Menu item mode
  if (asMenuItem) {
    return (
      <>
        <DropdownMenuItem
          variant={destructive ? "destructive" : undefined}
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          {icon}
          {triggerLabel}
        </DropdownMenuItem>
        <AlertDialog open={open} onOpenChange={setOpen}>
          {dialogContent}
        </AlertDialog>
      </>
    );
  }

  // Custom trigger mode
  if (trigger) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        {dialogContent}
      </AlertDialog>
    );
  }

  // Default button trigger mode
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={cn(
            destructive && "text-destructive hover:text-destructive hover:bg-destructive/10",
            triggerClassName
          )}
        >
          {icon}
          {triggerLabel && <span className={cn(icon && "ml-2")}>{triggerLabel}</span>}
        </Button>
      </AlertDialogTrigger>
      {dialogContent}
    </AlertDialog>
  );
}
