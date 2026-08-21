import * as React from "react";
import { cn } from "@/core/utils";

type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
type AlignItems = "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
type AlignContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "stretch";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

type BoxOwnProps = {
  as?: React.ElementType;
  className?: string;

  type?: "screen";

  display?: React.CSSProperties["display"];
  direction?: FlexDirection;
  justify?: JustifyContent;
  align?: AlignItems;
  alignContent?: AlignContent;
  wrap?: FlexWrap;
  gap?: React.CSSProperties["gap"];
  rowGap?: React.CSSProperties["rowGap"];
  colGap?: React.CSSProperties["columnGap"];

  cols?: React.CSSProperties["gridTemplateColumns"];
  rows?: React.CSSProperties["gridTemplateRows"];

  w?: React.CSSProperties["width"];
  h?: React.CSSProperties["height"];
  minW?: React.CSSProperties["minWidth"];
  maxW?: React.CSSProperties["maxWidth"];
  minH?: React.CSSProperties["minHeight"];
  maxH?: React.CSSProperties["maxHeight"];

  p?: React.CSSProperties["padding"];
  px?: React.CSSProperties["paddingInline"];
  py?: React.CSSProperties["paddingBlock"];
  pt?: React.CSSProperties["paddingTop"];
  pb?: React.CSSProperties["paddingBottom"];
  pl?: React.CSSProperties["paddingLeft"];
  pr?: React.CSSProperties["paddingRight"];

  m?: React.CSSProperties["margin"];
  mx?: React.CSSProperties["marginInline"];
  my?: React.CSSProperties["marginBlock"];
  mt?: React.CSSProperties["marginTop"];
  mb?: React.CSSProperties["marginBottom"];
  ml?: React.CSSProperties["marginLeft"];
  mr?: React.CSSProperties["marginRight"];

  radius?: React.CSSProperties["borderRadius"];
  overflow?: React.CSSProperties["overflow"];
  overflowX?: React.CSSProperties["overflowX"];
  overflowY?: React.CSSProperties["overflowY"];
  position?: React.CSSProperties["position"];
  zIndex?: React.CSSProperties["zIndex"];
  opacity?: React.CSSProperties["opacity"];
  cursor?: React.CSSProperties["cursor"];
};

const toUnit = (value: string | number | undefined) => {
  if (typeof value === "number") return `${value}px`;
  return value;
};

export type BoxProps<T extends React.ElementType = "div"> = BoxOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof BoxOwnProps>;

export function Box<T extends React.ElementType = "div">({
  as,
  type,
  className,
  style,
  display,
  direction,
  justify,
  align,
  alignContent,
  wrap,
  gap,
  rowGap,
  colGap,
  cols,
  rows,
  w,
  h,
  minW,
  maxW,
  minH,
  maxH,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  radius,
  overflow,
  overflowX,
  overflowY,
  position,
  zIndex,
  opacity,
  cursor,
  ...rest
}: BoxProps<T>) {
  const Component = as ?? "div";

  const hasFlexProps =
    direction !== undefined ||
    justify !== undefined ||
    align !== undefined ||
    wrap !== undefined ||
    gap !== undefined ||
    rowGap !== undefined ||
    colGap !== undefined;

  const shouldFlex = display === undefined && hasFlexProps;
  const shouldGrid = display === undefined && (cols || rows);
  const resolvedDisplay =
    display ?? (shouldGrid ? "grid" : shouldFlex ? "flex" : undefined);

  const computedStyle: React.CSSProperties = {
    ...style,

    ...(resolvedDisplay && { display: resolvedDisplay }),

    ...(direction && { flexDirection: direction }),
    ...(justify && { justifyContent: justify }),
    ...(align && { alignItems: align }),
    ...(alignContent && { alignContent }),
    ...(wrap && { flexWrap: wrap }),

    ...(gap !== undefined && { gap: toUnit(gap) }),
    ...(rowGap !== undefined && { rowGap: toUnit(rowGap) }),
    ...(colGap !== undefined && { columnGap: toUnit(colGap) }),

    ...(cols && { gridTemplateColumns: cols }),
    ...(rows && { gridTemplateRows: rows }),

    ...(p !== undefined && { padding: toUnit(p) }),
    ...(px !== undefined && { paddingInline: toUnit(px) }),
    ...(py !== undefined && { paddingBlock: toUnit(py) }),
    ...(pt !== undefined && { paddingTop: toUnit(pt) }),
    ...(pb !== undefined && { paddingBottom: toUnit(pb) }),
    ...(pl !== undefined && { paddingLeft: toUnit(pl) }),
    ...(pr !== undefined && { paddingRight: toUnit(pr) }),

    ...(m !== undefined && { margin: toUnit(m) }),
    ...(mx !== undefined && { marginInline: toUnit(mx) }),
    ...(my !== undefined && { marginBlock: toUnit(my) }),
    ...(mt !== undefined && { marginTop: toUnit(mt) }),
    ...(mb !== undefined && { marginBottom: toUnit(mb) }),
    ...(ml !== undefined && { marginLeft: toUnit(ml) }),
    ...(mr !== undefined && { marginRight: toUnit(mr) }),

    ...(radius !== undefined && { borderRadius: radius }),
    ...(overflow && { overflow }),
    ...(overflowX && { overflowX }),
    ...(overflowY && { overflowY }),
    ...(position && { position }),
    ...(zIndex !== undefined && { zIndex }),
    ...(opacity !== undefined && { opacity }),
    ...(cursor && { cursor }),
  };

  return (
    <Component className={cn(className)} style={computedStyle} {...rest} />
  );
}
