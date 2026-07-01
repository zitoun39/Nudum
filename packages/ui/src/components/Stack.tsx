import React from "react";
import clsx from "clsx";
import { Box, BoxProps } from "./Box";

export interface StackProps extends BoxProps {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
}

const gapClasses = {
  none: "gap-0",
  xs: "gap-xs", // 4px
  sm: "gap-sm", // 8px
  md: "gap-md", // 16px
  lg: "gap-lg", // 24px
  xl: "gap-xl", // 32px
  "2xl": "gap-2xl", // 48px
  "3xl": "gap-3xl" // 64px
};

const directionClasses = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse"
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline"
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
};

/**
 * Stack component wraps flexbox layouts to arrange children in a row or column direction
 * with standard spacing scale gaps.
 */
export const Stack = React.forwardRef<HTMLElement, StackProps>(
  (
    { direction = "col", gap = "md", align, justify, wrap = false, className, children, ...props },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        className={clsx(
          "flex",
          directionClasses[direction],
          gapClasses[gap],
          align && alignClasses[align],
          justify && justifyClasses[justify],
          wrap ? "flex-wrap" : "flex-nowrap",
          className
        )}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Stack.displayName = "Stack";
