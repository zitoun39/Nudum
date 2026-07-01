import React from "react";
import clsx from "clsx";
import { Box, BoxProps } from "./Box";

export interface GridProps extends BoxProps {
  columns?: number;
  rows?: number;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  flow?: "row" | "col" | "dense" | "row-dense" | "col-dense";
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

const flowClasses = {
  row: "grid-flow-row",
  col: "grid-flow-col",
  dense: "grid-flow-dense",
  "row-dense": "grid-flow-row-dense",
  "col-dense": "grid-flow-col-dense"
};

/**
 * Grid component implements CSS Grid layouts with custom columns, rows, flow, and gap spacing.
 */
export const Grid = React.forwardRef<HTMLElement, GridProps>(
  ({ columns, rows, gap = "md", flow = "row", className, children, ...props }, ref) => {
    const style: React.CSSProperties = {
      ...props.style,
      gridTemplateColumns: columns ? `repeat(${columns}, minmax(0, 1fr))` : undefined,
      gridTemplateRows: rows ? `repeat(${rows}, minmax(0, 1fr))` : undefined
    };

    return (
      <Box
        ref={ref}
        style={style}
        className={clsx("grid", gapClasses[gap], flowClasses[flow], className)}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Grid.displayName = "Grid";
