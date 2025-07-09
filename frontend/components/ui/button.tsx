import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        destructiveOutline:
          "border bg-background shadow-xs hover:text-destructive/90 hover:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:border-(--honeysuckle-300) hover:text-(--honeysuckle-300) transition-all duration-300",
        primary:
          "bg-(--honeysuckle-100) text-(--honeysuckle-950) hover:bg-(--honeysuckle-900) hover:text-(--honeysuckle-100) focus-visible:ring-(--honeysuckle-400) shadow-sm py-[16px] px-[33px] transition-all duration-300",
        secondary:
          "bg-(--jonquil-100) text-(--jonquil-950) hover:bg-(--jonquil-200) focus-visible:ring-(--jonquil-400) shadow-sm py-[16px] px-[33px]",
        cta: "bg-(--honeysuckle-100) hover:bg-(--honeysuckle-900) hover:text-(--honeysuckle-100) text-black text-[1rem] shadow-xl transition-all duration-300",
        neutral:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        none: "text-(--honeysuckle-300) hover:text-(--honeysuckle-400) hover:bg-transparent text-md",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-2xl px-8 has-[>svg]:px-6",
        custom: "rounded-2xl px-[32px] py-[20px] has-[>svg]:px-[20px]",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
