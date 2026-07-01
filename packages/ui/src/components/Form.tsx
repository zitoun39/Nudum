import React from "react";
import clsx from "clsx";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Label component outputs standardized form title tags.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export interface RequiredIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * RequiredIndicator signals mandatory form entries.
 */
export const RequiredIndicator: React.FC<RequiredIndicatorProps> = ({ className, ...props }) => {
  return (
    <span
      className={clsx("text-destructive ml-1 select-none font-bold", className)}
      aria-hidden="true"
      {...props}
    >
      *
    </span>
  );
};

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * HelperText outputs secondary instructions.
 */
export const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={clsx("text-xs text-muted-foreground leading-normal", className)}
        {...props}
      />
    );
  }
);
HelperText.displayName = "HelperText";

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * ErrorMessage presents invalid parameter feedback.
 */
export const ErrorMessage = React.forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        role="alert"
        className={clsx("text-xs text-destructive font-medium leading-normal", className)}
        {...props}
      />
    );
  }
);
ErrorMessage.displayName = "ErrorMessage";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Field wraps input components, matching spacing rhythms.
 */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={clsx("flex flex-col gap-xs w-full", className)} {...props} />;
  }
);
Field.displayName = "Field";

export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {}

/**
 * Fieldset groups related fields.
 */
export const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ className, ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        className={clsx("border border-border p-md rounded-md flex flex-col gap-md", className)}
        {...props}
      />
    );
  }
);
Fieldset.displayName = "Fieldset";
