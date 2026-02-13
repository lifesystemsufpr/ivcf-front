import * as React from "react";
import { cn } from "../../utils";

type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

type AlignItems = "flex-start" | "flex-end" | "center" | "stretch" | "baseline";

type BoxOwnProps = {
  as?: React.ElementType;
  className?: string;

  /* Layout */
  display?: React.CSSProperties["display"];
  direction?: FlexDirection;
  justify?: JustifyContent;
  align?: AlignItems;
  gap?: React.CSSProperties["gap"];

  /* Spacing */
  p?: React.CSSProperties["padding"];
  px?: React.CSSProperties["paddingInline"];
  py?: React.CSSProperties["paddingBlock"];
  m?: React.CSSProperties["margin"];
  mx?: React.CSSProperties["marginInline"];
  my?: React.CSSProperties["marginBlock"];
};

type BoxProps<T extends React.ElementType> = BoxOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof BoxOwnProps>;

export function Box<T extends React.ElementType = "div">({
  as,
  className,
  display,
  direction,
  justify,
  align,
  gap,
  p,
  px,
  py,
  m,
  mx,
  my,
  style,
  ...rest
}: BoxProps<T>) {
  const Component = as || "div";

  const computedStyle: React.CSSProperties = {
    display,
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    gap,

    padding: p,
    paddingInline: px,
    paddingBlock: py,

    margin: m,
    marginInline: mx,
    marginBlock: my,

    ...style,
  };

  return (
    <Component className={cn(className)} style={computedStyle} {...rest} />
  );
}
