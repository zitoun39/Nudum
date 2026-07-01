import React from "react";
import clsx from "clsx";

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * Box component is the base layout primitive.
 * It provides standard access to layout bindings and handles custom class nesting.
 */
export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ as: Component = "div", className, children, ...props }, ref) => {
    return (
      <Component ref={ref} className={clsx("box-border m-0 p-0", className)} {...props}>
        {children}
      </Component>
    );
  }
);

Box.displayName = "Box";
