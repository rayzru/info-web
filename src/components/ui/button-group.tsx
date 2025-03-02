"use client";

import * as React from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "~/lib/utils";

const ButtonGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex gap-5", className)}
      {...props}
      ref={ref}
    />
  );
});
ButtonGroup.displayName = RadioGroupPrimitive.Root.displayName;

const ButtonGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  {
    icon: React.ReactNode;
    label: string;
  } & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, icon, label, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        `2 focus-visible:ring-ring rounded-md border text-center focus:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-red-600 data-[state=checked]:text-white`,
        className,
      )}
      {...props}
    >
      {/* <RadioGroupPrimitive.RadioGroupIndicator className="relative">
        <div className="relative w-full ">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10px]">
            <CheckCircle2 className="" />
          </div>
        </div>
      </RadioGroupPrimitive.RadioGroupIndicator> */}

      <div className="flex flex-col justify-center p-[12px] text-lg">
        <div className="self-center">{icon}</div>
        <div className="">{label}</div>
      </div>
    </RadioGroupPrimitive.Item>
  );
});
ButtonGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { ButtonGroup, ButtonGroupItem };
