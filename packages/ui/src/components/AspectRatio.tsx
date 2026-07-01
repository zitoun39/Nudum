import React from "react";
import clsx from "clsx";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

/**
 * AspectRatio component forces elements to respect a standard visual width-to-height ratio.
 */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: `${100 / ratio}%`,
          ...style
        }}
        className={clsx("overflow-hidden", className)}
        {...props}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

AspectRatio.displayName = "AspectRatio";
