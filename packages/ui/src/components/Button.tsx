import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 border",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline:
          "border border-border bg-background hover:bg-muted hover:text-foreground active:bg-muted/70",
        ghost: "hover:bg-muted hover:text-foreground active:bg-muted/70",
        link: "text-primary underline-offset-4 hover:underline bg-transparent p-0"
      },
      size: {
        sm: "h-8 px-3 text-xs gap-xs",
        md: "h-10 px-4 text-sm gap-sm",
        lg: "h-12 px-6 text-base gap-md"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Button component represents a customizable CTA element.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={clsx(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

/**
 * IconButton is a button optimized for displaying icons.
 */
export interface IconButtonProps extends ButtonProps {
  ariaLabel: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, ariaLabel, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 p-0",
      md: "h-10 w-10 p-0",
      lg: "h-12 w-12 p-0"
    };

    return (
      <Button
        ref={ref}
        aria-label={ariaLabel}
        className={clsx(sizeClasses[size || "md"], "rounded-full", className)}
        size={size}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

/**
 * LinkButton renders an anchor element formatted to look like a CTA.
 */
export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof buttonVariants> {}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant = "link", size = "md", ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={clsx(buttonVariants({ variant, size, className }), "inline-flex cursor-pointer")}
        {...props}
      />
    );
  }
);
LinkButton.displayName = "LinkButton";
