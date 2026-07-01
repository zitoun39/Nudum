import React from "react";
import clsx from "clsx";

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  flex?: string | number;
}

/**
 * Spacer component is a flexible, structural spacer used inside flex containers to distribute elements.
 */
export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ flex = 1, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ flex, ...props.style }}
        className={clsx("self-stretch justify-self-stretch", className)}
        {...props}
      />
    );
  }
);

Spacer.displayName = "Spacer";
