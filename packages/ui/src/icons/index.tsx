import React from "react";
import {
  Activity,
  Check,
  AlertCircle,
  Database,
  FileText,
  Layout,
  Lock,
  Settings,
  Search,
  Menu as MenuIcon,
  User,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit2,
  Plus,
  X,
  type LucideProps
} from "lucide-react";

// Standard tree-shakeable icon exports
export {
  Activity,
  Check,
  AlertCircle,
  Database,
  FileText,
  Layout,
  Lock,
  Settings,
  Search,
  MenuIcon,
  User,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit2,
  Plus,
  X
};

export type IconProps = LucideProps;

/**
 * Custom SVG Icon wrapper to render arbitrary SVGs inside the design system context.
 */
export interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CustomIcon = React.forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 24, className, children, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {children}
      </svg>
    );
  }
);

CustomIcon.displayName = "CustomIcon";
