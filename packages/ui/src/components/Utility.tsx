import React, { useState } from "react";
import * as PortalPrimitive from "@radix-ui/react-portal";
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { Copy, Check, Terminal } from "lucide-react";
import clsx from "clsx";
import { Button } from "./Button";
import { Dialog, DialogContent } from "./Dialog";
import { Input } from "./Input";

export const Portal = PortalPrimitive.Root;
export const VisuallyHidden = VisuallyHiddenPrimitive.Root;

export const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={clsx("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      orientation="vertical"
      className="flex touch-none select-none transition-colors duration-150 ease-out bg-secondary/30 w-2.5 border-l border-l-transparent p-[1px] hover:bg-secondary"
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

/**
 * Resizable is a container with two panels separated by a handle.
 */
export const Resizable: React.FC<{
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultRatio?: number; // 0 to 100
  className?: string;
}> = ({ leftPanel, rightPanel, defaultRatio = 50, className }) => {
  const [ratio, setRatio] = useState(defaultRatio);

  return (
    <div className={clsx("flex w-full h-full border rounded-md overflow-hidden", className)}>
      <div style={{ width: `${ratio}%` }} className="h-full overflow-auto">
        {leftPanel}
      </div>
      <div
        className="w-1.5 h-full bg-border hover:bg-primary/50 cursor-col-resize shrink-0 transition-colors"
        onMouseDown={(e) => {
          const handleMove = (moveEvent: MouseEvent) => {
            const containerWidth = e.currentTarget.parentElement?.clientWidth || 1;
            const newRatio = (moveEvent.clientX / containerWidth) * 100;
            if (newRatio > 10 && newRatio < 90) setRatio(newRatio);
          };
          const handleUp = () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
          };
          window.addEventListener("mousemove", handleMove);
          window.addEventListener("mouseup", handleUp);
        }}
      />
      <div style={{ width: `${100 - ratio}%` }} className="h-full overflow-auto">
        {rightPanel}
      </div>
    </div>
  );
};

/**
 * CommandPalette represents a dashboard shortcut console dialogue overlay.
 */
export interface CommandItem {
  id: string;
  label: string;
  action: () => void;
}

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}> = ({ isOpen, onClose, items, placeholder = "Type a command..." }) => {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md p-sm gap-sm">
        <div className="flex items-center gap-xs border-b pb-sm">
          <Terminal className="h-4 w-4 text-muted-foreground ml-2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="border-none focus-visible:ring-0 shadow-none h-9 pl-0"
          />
        </div>
        <div className="flex flex-col max-h-64 overflow-auto">
          {filteredItems.length === 0 && (
            <div className="py-xl text-center text-xs text-muted-foreground">No matches found.</div>
          )}
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.action();
                onClose();
                setSearch("");
              }}
              className="w-full text-left rtl:text-right px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:bg-accent"
            >
              {item.label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * CopyButton copies target string variables to user clipboard.
 */
export interface CopyButtonProps {
  value: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ value, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={clsx("h-8 w-8 p-0 rounded-md", className)}
      onClick={handleCopy}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
};
