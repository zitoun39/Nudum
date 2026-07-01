import React from "react";
import clsx from "clsx";

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={clsx("w-full caption-bottom text-sm border-collapse", className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={clsx("[&_tr]:border-b bg-muted/40", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={clsx("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={clsx("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={clsx(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={clsx(
      "h-12 px-4 text-left rtl:text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 select-none",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={clsx("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/**
 * DataTable renders headers and maps values with automatic sorting and paginated interfaces.
 */
export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onSort?: (column: keyof T) => void;
  className?: string;
}

export function DataTable<T>({ columns, data, onSort, className }: DataTableProps<T>) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((col, idx) => (
            <TableHead
              key={idx}
              onClick={() =>
                col.sortable &&
                col.accessor &&
                typeof col.accessor === "string" &&
                onSort?.(col.accessor as keyof T)
              }
              className={clsx(col.sortable && "cursor-pointer hover:bg-muted/80")}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-xl text-muted-foreground">
              No results.
            </TableCell>
          </TableRow>
        )}
        {data.map((row, rowIdx) => (
          <TableRow key={rowIdx}>
            {columns.map((col, colIdx) => {
              const content =
                typeof col.accessor === "function"
                  ? col.accessor(row)
                  : (row[col.accessor] as React.ReactNode);
              return <TableCell key={colIdx}>{content}</TableCell>;
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
