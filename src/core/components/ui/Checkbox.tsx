import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import { CheckIcon, Minus as IndeterminateIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const checkboxWrapperVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded",
    "border bg-background",
    "transition-shadow duration-150",
    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0",
    // checked / indeterminate fill
    "has-[:checked]:bg-primary has-[:checked]:border-primary",
    "has-[input[data-indeterminate='true']]:bg-primary has-[input[data-indeterminate='true']]:border-primary",
    // disabled
    "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
    // hover (only when not disabled)
    "has-[:not(:disabled)]:hover:border-border-strong",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-3.5 w-3.5 rounded-[3px]",
        md: "h-4 w-4 rounded",
        lg: "h-5 w-5 rounded-[5px]",
      },
      status: {
        default: "border-input",
        error:
          "border-destructive hover:border-destructive focus-within:ring-destructive/30 has-[:checked]:bg-destructive has-[:checked]:border-destructive",
        success:
          "border-success hover:border-success focus-within:ring-success/30 has-[:checked]:bg-success has-[:checked]:border-success",
        warning:
          "border-warning hover:border-warning focus-within:ring-warning/30 has-[:checked]:bg-warning has-[:checked]:border-warning",
      },
    },
    defaultVariants: {
      size: "md",
      status: "default",
    },
  },
);

const labelTextVariants = cva("leading-none select-none text-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: { size: "md" },
});

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CheckboxProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof checkboxWrapperVariants> {
  /** Text label rendered beside the checkbox */
  label?: React.ReactNode;
  /** Subtle helper message below the label */
  helperText?: string;
  /** Validation error – also sets status to "error" */
  errorMessage?: string;
  /** Three-state indeterminate mode */
  indeterminate?: boolean;
  /** Extra class applied to the outermost <div> */
  wrapperClassName?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      wrapperClassName,
      size,
      status: statusProp,
      label,
      helperText,
      errorMessage,
      indeterminate = false,
      id,
      disabled,
      onChange,
      checked,
      defaultChecked,
      ...props
    },
    ref,
  ) => {
    // Mirror Input pattern: errorMessage wins over statusProp
    const status = errorMessage ? "error" : statusProp;

    const internalRef = React.useRef<HTMLInputElement>(null);

    // Merge forwarded ref + internal ref (needed to set indeterminate imperatively)
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        (
          internalRef as React.MutableRefObject<HTMLInputElement | null>
        ).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            node;
      },
      [ref],
    );

    // Keep the native indeterminate property in sync
    React.useEffect(() => {
      const el = internalRef.current;
      if (!el) return;
      el.indeterminate = indeterminate;
      el.dataset.indeterminate = String(indeterminate);
    }, [indeterminate]);

    const helperId = id ? `${id}-helper` : undefined;

    // Icon sizing map aligned with wrapper sizes
    const iconSize: Record<NonNullable<typeof size>, string> = {
      sm: "h-2.5 w-2.5",
      md: "h-3 w-3",
      lg: "h-3.5 w-3.5",
    };
    const currentIconSize = iconSize[size ?? "md"];

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {/* Row: box + label */}
        <label
          className={cn(
            "inline-flex items-center gap-2 group",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          )}
          htmlFor={id}
        >
          {/* Visual box */}
          <span
            className={cn(
              checkboxWrapperVariants({ size, status }),
              "relative",
            )}
          >
            {/* Hidden native input */}
            <input
              ref={setRefs}
              id={id}
              type="checkbox"
              disabled={disabled}
              checked={checked}
              defaultChecked={defaultChecked}
              aria-checked={indeterminate ? "mixed" : checked}
              aria-describedby={helperId}
              aria-invalid={status === "error" || undefined}
              onChange={onChange}
              className={cn(
                "absolute inset-0 opacity-0 w-full h-full cursor-pointer",
                "disabled:cursor-not-allowed",
                className,
              )}
              {...props}
            />

            {indeterminate ? (
              <IndeterminateIcon
                className={cn(
                  currentIconSize,
                  "text-primary-foreground pointer-events-none relative z-10",
                  "opacity-100",
                )}
              />
            ) : (
              <CheckIcon
                className={cn(
                  currentIconSize,
                  "text-primary-foreground pointer-events-none relative z-10",
                  "opacity-0 group-has-checked:opacity-100 transition-opacity duration-100",
                )}
              />
            )}
          </span>

          {/* Label text */}
          {label && (
            <span className={labelTextVariants({ size })}>{label}</span>
          )}
        </label>

        {/* Helper / error text */}
        {(errorMessage || helperText) && (
          <p
            id={helperId}
            className={cn(
              "text-xs leading-snug",
              size === "sm" ? "pl-5" : size === "lg" ? "pl-7" : "pl-6",
              errorMessage ? "text-destructive" : "text-foreground-muted",
            )}
          >
            {errorMessage ?? helperText}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
