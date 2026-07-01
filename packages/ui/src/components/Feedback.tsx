import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import clsx from "clsx";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "success" | "warning" | "destructive" | "info";
  title?: string;
  onClose?: () => void;
}

/**
 * Alert component offers contextual warnings or messages.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "info", title, onClose, className, children, ...props }, ref) => {
    const borderColors = {
      primary: "border-primary bg-primary/10 text-primary-foreground",
      success: "border-success bg-success/10 text-success",
      warning: "border-warning bg-warning/10 text-warning",
      destructive: "border-destructive bg-destructive/10 text-destructive",
      info: "border-info bg-info/10 text-info"
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={clsx(
          "relative w-full rounded-md border p-md flex gap-sm items-start",
          borderColors[variant],
          className
        )}
        {...props}
      >
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div className="flex-1 flex flex-col gap-xs">
          {title && (
            <h5 className="font-semibold leading-none tracking-tight text-foreground">{title}</h5>
          )}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-current hover:opacity-80 focus:outline-none"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

/**
 * Toast represents an ephemeral pop-up notification.
 */
export interface ToastProps {
  message: string;
  title?: string;
  duration?: number;
  onClose?: () => void;
  variant?: "info" | "success" | "warning" | "destructive";
}

export const Toast: React.FC<ToastProps> = ({
  message,
  title,
  duration = 3000,
  onClose,
  variant = "info"
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[1600] animate-in fade-in slide-in-from-bottom-5">
      <Alert
        variant={variant}
        title={title}
        onClose={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="w-80 shadow-lg bg-card text-card-foreground"
      >
        {message}
      </Alert>
    </div>
  );
};

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
}

/**
 * Progress component displays dynamic operation milestones.
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className={clsx("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-primary transition-all duration-300"
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * Spinner component offers a rotating indicator during loads.
 */
export const Spinner: React.FC<SpinnerProps> = ({ size = 24, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx("animate-spin text-primary", className)}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton offers simple structural blocks.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return <div className={clsx("animate-pulse rounded bg-muted/60", className)} {...props} />;
};

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * EmptyState outputs placeholders inside empty containers.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, icon, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "flex flex-col items-center justify-center text-center p-xl border border-dashed rounded-md bg-muted/20 gap-md max-w-md mx-auto",
          className
        )}
        {...props}
      >
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="flex flex-col gap-xs">
          <h4 className="font-semibold text-base text-foreground">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground leading-normal">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";
