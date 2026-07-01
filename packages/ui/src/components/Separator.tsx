import React from "react";
import clsx from "clsx";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

/**
 * Separator component provides a visual divider matching accessibility guidelines.
 */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = "horizontal", decorative = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        className={clsx(
          "bg-border shrink-0",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";
