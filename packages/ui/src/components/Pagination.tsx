import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination component coordinates data page selections.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, className, ...props }, ref) => {
    const handlePrev = () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
      <nav
        ref={ref}
        aria-label="Pagination Navigation"
        className={clsx("flex items-center justify-center gap-sm py-2", className)}
        {...props}
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className="flex h-10 w-10 items-center justify-center rounded-md border hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>

        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-md border hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </nav>
    );
  }
);
Pagination.displayName = "Pagination";
