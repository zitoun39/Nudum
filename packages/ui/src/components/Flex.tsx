import React from "react";
import clsx from "clsx";
import { Box, BoxProps } from "./Box";

export interface FlexProps extends BoxProps {
  inline?: boolean;
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

const gapClasses = {
  none: "gap-0",
  xs: "gap-xs",
  sm: "gap-sm",
  md: "gap-md",
  lg: "gap-lg",
  xl: "gap-xl",
  "2xl": "gap-2xl",
  "3xl": "gap-3xl"
};

const directionClasses = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse"
};

const wrapClasses = {
  wrap: "flex-wrap",
  nowrap: "flex-nowrap",
  "wrap-reverse": "flex-wrap-reverse"
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline"
};

/**
 * Flex component provides standard CSS Flexbox layouts with alignment, wrapping, and spacing tokens.
 */
export const Flex = React.forwardRef<HTMLElement, FlexProps>(
  (
    {
      inline = false,
      direction = "row",
      wrap = "nowrap",
      justify,
      align,
      gap,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        className={clsx(
          inline ? "inline-flex" : "flex",
          directionClasses[direction],
          wrapClasses[wrap],
          justify && justifyClasses[justify],
          align && alignClasses[align],
          gap && gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Flex.displayName = "Flex";
