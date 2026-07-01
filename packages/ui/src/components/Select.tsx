import React, { useState } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check, X } from "lucide-react";
import clsx from "clsx";
import { Input } from "./Input";

export const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> & {
    placeholder?: string;
    className?: string;
    options: { label: string; value: string }[];
  }
>(({ placeholder = "Select...", className, options, ...props }, ref) => {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        ref={ref}
        className={clsx(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="relative z-[1500] max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0">
          <SelectPrimitive.Viewport className="p-1">
            {options.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});
Select.displayName = "Select";

/**
 * MultiSelect represents a multiple tag selection component.
 */
export interface MultiSelectProps {
  options: { label: string; value: string }[];
  value?: string[];
  onChange?: (val: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select multiple...",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange?.(value.filter((v) => v !== val));
    } else {
      onChange?.([...value, val]);
    }
  };

  const removeOption = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== val));
  };

  return (
    <div className={clsx("relative w-full", className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[2.5rem] w-full cursor-pointer flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring"
      >
        <div className="flex flex-wrap gap-xs">
          {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
          {value.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-xs rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
              >
                {opt?.label || val}
                <X
                  className="h-3 w-3 cursor-pointer hover:opacity-80"
                  onClick={(e) => removeOption(e, val)}
                />
              </span>
            );
          })}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            {options.map((opt) => {
              const isSelected = value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className={clsx(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    isSelected && "font-medium"
                  )}
                >
                  {isSelected && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  {opt.label}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Combobox provides a searchable autocomplete dropdown.
 */
export interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Search...",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOpt = options.find((o) => o.value === value);

  return (
    <div className={clsx("relative w-full", className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      >
        <span>{selectedOpt ? selectedOpt.label : placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-2 text-popover-foreground shadow-md flex flex-col gap-sm">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search option..."
              className="h-8"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex flex-col">
              {filteredOptions.length === 0 && (
                <div className="py-2 text-center text-xs text-muted-foreground">
                  No options found.
                </div>
              )}
              {filteredOptions.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange?.(opt.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={clsx(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      isSelected && "font-medium"
                    )}
                  >
                    {isSelected && (
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
