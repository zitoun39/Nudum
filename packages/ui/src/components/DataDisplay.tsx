import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { ChevronDown, X } from "lucide-react";
import clsx from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "destructive" | "info";
}

/**
 * Badge component displays small metadata labels.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "primary", className, ...props }, ref) => {
    const variantClasses = {
      primary: "bg-primary/10 text-primary border-primary/20",
      secondary: "bg-secondary text-secondary-foreground border-border",
      success: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      destructive: "bg-destructive/10 text-destructive border-destructive/20",
      info: "bg-info/10 text-info border-info/20"
    };

    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    src?: string;
    fallback: string;
  }
>(({ className, src, fallback, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={clsx(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border",
      className
    )}
    {...props}
  >
    <AvatarPrimitive.Image src={src} className="aspect-square h-full w-full object-cover" />
    <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-sm text-muted-foreground select-none">
      {fallback}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));
Avatar.displayName = "Avatar";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Card is a simple, structured block layout container.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-md border bg-card text-card-foreground shadow-sm p-lg flex flex-col gap-md",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("flex flex-col space-y-1.5", className)} {...props} />
);
CardHeader.displayName = "CardHeader";

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={clsx("text-base font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);
CardTitle.displayName = "CardTitle";

export const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clsx("text-sm text-muted-foreground", className)} {...props} />
);
CardDescription.displayName = "CardDescription";

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("text-sm leading-relaxed", className)} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("flex items-center gap-sm", className)} {...props} />
);
CardFooter.displayName = "CardFooter";

/**
 * Divider represents a subtle visual separator.
 */
export const Divider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return <div className={clsx("h-[1px] w-full bg-border my-md", className)} {...props} />;
};

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={clsx("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={clsx(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={clsx(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

/**
 * Collapse provides a simple show/hide panel toggle.
 */
export interface CollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const Collapse: React.FC<CollapseProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return <div className="animate-in fade-in zoom-in-95">{children}</div>;
};

/**
 * List is a vertical list item display wrapper.
 */
export const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={clsx("flex flex-col gap-sm list-none p-0 m-0", className)}
      {...props}
    />
  )
);
List.displayName = "List";

export const ListItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={clsx("text-sm leading-relaxed border-b pb-sm", className)}
      {...props}
    />
  )
);
ListItem.displayName = "ListItem";

/**
 * Timeline shows chronological events.
 */
export interface TimelineItemProps {
  title: string;
  time: string;
  description?: string;
}

export const Timeline: React.FC<{ items: TimelineItemProps[]; className?: string }> = ({
  items,
  className
}) => {
  return (
    <div className={clsx("relative border-l border-border pl-4 flex flex-col gap-md", className)}>
      {items.map((item, idx) => (
        <div key={idx} className="relative">
          <span className="absolute -left-[21px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
          <div className="flex flex-col gap-xs">
            <span className="text-xs text-muted-foreground">{item.time}</span>
            <h5 className="font-semibold text-sm leading-none text-foreground">{item.title}</h5>
            {item.description && (
              <p className="text-xs text-muted-foreground leading-normal">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Tag outputs interactive badges.
 */
export interface TagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ label, onRemove, className }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-xs rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground select-none",
        className
      )}
    >
      {label}
      {onRemove && (
        <X className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100" onClick={onRemove} />
      )}
    </span>
  );
};
