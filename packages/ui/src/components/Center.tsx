import React from "react";
import clsx from "clsx";
import { Flex, FlexProps } from "./Flex";

export interface CenterProps extends FlexProps {}

/**
 * Center component aligns child elements vertically and horizontally inside a flex container.
 */
export const Center = React.forwardRef<HTMLElement, CenterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        align="center"
        justify="center"
        className={clsx("h-full w-full", className)}
        {...props}
      >
        {children}
      </Flex>
    );
  }
);

Center.displayName = "Center";
