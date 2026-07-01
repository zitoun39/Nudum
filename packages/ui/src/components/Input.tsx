import React, { useState } from "react";
import clsx from "clsx";
import { Search, Eye, EyeOff, Plus, Minus, X } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/**
 * Input is a standardized responsive text input.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

/**
 * SearchInput includes a search icon at the leading edge.
 */
export interface SearchInputProps extends InputProps {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, onChange, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          className={clsx("pl-10 pr-10", className)}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

/**
 * PasswordInput includes a trailing toggle button to show/hide plaintext characters.
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative flex items-center w-full">
        <Input
          type={showPassword ? "text" : "password"}
          className={clsx("pr-10", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none select-none"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

/**
 * NumberInput provides increment and decrement stepper controls.
 */
export interface NumberInputProps extends Omit<InputProps, "onChange"> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (val: number) => void;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value = 0, min, max, step = 1, onChange, ...props }, ref) => {
    const handleIncrement = () => {
      const newVal = value + step;
      if (max !== undefined && newVal > max) return;
      onChange?.(newVal);
    };

    const handleDecrement = () => {
      const newVal = value - step;
      if (min !== undefined && newVal < min) return;
      onChange?.(newVal);
    };

    return (
      <div className="relative flex items-center w-full">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={min !== undefined && value <= min}
          className="absolute left-1 flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted active:bg-muted/70 disabled:opacity-30 disabled:pointer-events-none"
          tabIndex={-1}
        >
          <Minus className="h-3 w-3" />
        </button>
        <Input
          type="number"
          className={clsx("text-center px-10", className)}
          ref={ref}
          value={value}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            if (!isNaN(parsed)) onChange?.(parsed);
          }}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={max !== undefined && value >= max}
          className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted active:bg-muted/70 disabled:opacity-30 disabled:pointer-events-none"
          tabIndex={-1}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";
