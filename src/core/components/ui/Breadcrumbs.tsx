import * as React from "react";
import { cn } from "../../utils";

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
  ariaLabel?: string;
  listClassName?: string;
}

export function Breadcrumbs({
  separator = "/",
  ariaLabel = "breadcrumb",
  className,
  listClassName,
  children,
  ...props
}: BreadcrumbsProps) {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <nav aria-label={ariaLabel} className={cn("text-sm", className)} {...props}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1 text-muted-foreground",
          listClassName,
        )}
      >
        {items.map((child, index) => (
          <React.Fragment key={`breadcrumb-item-${index}`}>
            <li className="inline-flex items-center">{child}</li>
            {index < items.length - 1 && (
              <li className="mx-1 text-muted-foreground" aria-hidden="true">
                {separator}
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
