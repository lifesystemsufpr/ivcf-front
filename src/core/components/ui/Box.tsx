import * as React from "react";
import { cn } from "../../utils";

type BoxProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

export function Box<T extends React.ElementType = "div">({
  as,
  className,
  ...props
}: BoxProps<T>) {
  const Component = as || "div";

  return <Component className={cn(className)} {...props} />;
}
