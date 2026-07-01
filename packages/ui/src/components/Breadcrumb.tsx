import React from "react";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb component provides historical hierarchy markers.
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={clsx("flex items-center text-sm text-muted-foreground", className)}
        {...props}
      >
        <ol className="flex items-center gap-xs flex-wrap">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex items-center gap-xs">
                {idx > 0 && <ChevronRight className="h-4 w-4 shrink-0 opacity-50 rtl:rotate-180" />}
                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {item.label}
                  </span>
                ) : item.href ? (
                  <a
                    href={item.href}
                    className="hover:text-foreground hover:underline transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";
