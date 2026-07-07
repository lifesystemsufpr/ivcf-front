import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import type { LucideIcon } from "lucide-react";
import { applyMask, onlyDigits, type InputMaskType } from "@/core/utils/mask";

const inputWrapperVariants = cva(
  [
    "flex items-center w-full rounded-lg border bg-background",
    "transition-shadow duration-150",
    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0",
    "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-xs gap-1.5",
        md: "h-10 px-3 text-sm gap-2",
        lg: "h-12 px-4 text-base gap-2.5",
      },
      status: {
        default: "border-input hover:border-border-strong",
        error:
          "border-destructive hover:border-destructive focus-within:ring-destructive/30",
        success:
          "border-success hover:border-success focus-within:ring-success/30",
        warning:
          "border-warning hover:border-warning focus-within:ring-warning/30",
      },
    },
    defaultVariants: {
      size: "md",
      status: "default",
    },
  },
);

function normalizeDate(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";

  // Date object or numeric timestamp
  if (value instanceof Date || typeof value === "number") {
    const d = new Date(value as never);
    return isNaN(d.getTime()) ? "" : toYMD(d);
  }

  if (typeof value !== "string") return String(value);

  const raw = value.trim();
  if (!raw) return "";

  // Already yyyy-MM-dd (optionally followed by time / timezone we can ignore)
  const isoFull = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ].*)?$/);
  if (isoFull) {
    const [, y, m, d] = isoFull;
    return `${y}-${m}-${d}`;
  }

  // MM/DD/YYYY or DD/MM/YYYY (slash-separated)
  const slashParts = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashParts) {
    return resolveAmbiguousDMY(slashParts[1], slashParts[2], slashParts[3]);
  }

  // DD.MM.YYYY (dot-separated — common in PT-BR / DE / RU)
  const dotParts = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotParts) {
    // Dot notation is unambiguously DD.MM.YYYY
    return buildYMD(dotParts[3], dotParts[2], dotParts[1]);
  }

  // DD-MM-YYYY (dash-separated when first part > 12 — otherwise falls through)
  const dashParts = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dashParts) {
    return resolveAmbiguousDMY(dashParts[1], dashParts[2], dashParts[3]);
  }

  // Last resort: let the JS Date parser try (handles RFC 2822, locale strings, etc.)
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return toYMD(d);

  // Unparseable — return as-is so the developer sees the original warning
  return raw;
}

function resolveAmbiguousDMY(a: string, b: string, year: string): string {
  const numA = parseInt(a, 10);
  const numB = parseInt(b, 10);
  if (numA > 12) return buildYMD(year, b, a); // must be DD/MM/YYYY
  if (numB > 12) return buildYMD(year, a, b); // must be MM/DD/YYYY
  return buildYMD(year, a, b); // ambiguous → MM/DD/YYYY default
}

function buildYMD(year: string, month: string, day: string): string {
  const y = year.padStart(4, "0");
  const m = month.padStart(2, "0");
  const d = day.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toYMD(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function sanitizeNumberText(value: string): string {
  if (!value) return "";

  const normalized = value.replace(/,/g, ".").replace(/[^0-9.-]/g, "");

  if (!/[0-9]/.test(normalized)) return "";

  const isNegative = normalized.startsWith("-");
  const unsigned = normalized.replace(/-/g, "");

  const [integerPart = "", ...fractionParts] = unsigned.split(".");
  const fractionPart = fractionParts.join("");
  const hasDecimal = normalized.includes(".");

  const trimmedInteger = integerPart.replace(/^0+(?=\d)/, "");

  const signedInteger = isNegative ? `-${trimmedInteger}` : trimmedInteger;

  if (hasDecimal) {
    if (!trimmedInteger && !fractionPart) return "";
    return `${signedInteger || (isNegative ? "-" : "")}.${fractionPart}`;
  }

  return signedInteger;
}

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputWrapperVariants> {
  leftElement?: React.ReactNode | LucideIcon;
  rightElement?: React.ReactNode | LucideIcon;
  prefix?: string;
  suffix?: string;
  helperText?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  mask?: InputMaskType;
  unmask?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      type = "text",
      inputMode,
      pattern,
      size,
      status: statusProp,
      leftElement,
      rightElement,
      prefix,
      suffix,
      helperText,
      errorMessage,
      id,
      mask,
      unmask,
      onChange,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const status = errorMessage ? "error" : statusProp;
    const helperId = id ? `${id}-helper` : undefined;
    const isNumberInput = type === "number";
    const inputType = isNumberInput ? "text" : type;

    const [numberDisplay, setNumberDisplay] = React.useState<string>(() =>
      isNumberInput && value !== undefined && value !== ""
        ? sanitizeNumberText(String(value))
        : "",
    );

    // Normalize date values to avoid "does not conform to format yyyy-MM-dd" warnings.
    const normalizedValue =
      type === "date" && value !== undefined ? normalizeDate(value) : value;

    const normalizedDefaultValue =
      type === "date" && defaultValue !== undefined
        ? normalizeDate(defaultValue)
        : defaultValue;

    React.useEffect(() => {
      if (!isNumberInput) return;

      if (value === undefined || value === null || value === "") {
        setNumberDisplay("");
        return;
      }

      setNumberDisplay(sanitizeNumberText(String(value)));
    }, [isNumberInput, value]);

    const renderAddon = (el: React.ReactNode | LucideIcon) => {
      if (!el) return null;
      if (React.isValidElement(el)) return el;
      if (typeof el === "function" || (typeof el === "object" && el !== null)) {
        const Icon = el as React.ElementType;
        return (
          <Icon
            size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
            className="shrink-0 text-foreground-subtle"
            aria-hidden
          />
        );
      }
      return el;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isNumberInput) {
        const numericValue = sanitizeNumberText(e.target.value);

        // Update display — empty string is intentional (user is clearing)
        setNumberDisplay(numericValue);

        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: numericValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange?.(syntheticEvent);
        return;
      }

      if (!mask) {
        onChange?.(e);
        return;
      }

      let rawValue = e.target.value;

      if (
        mask === "cpf" ||
        mask === "cnpj" ||
        mask === "phone" ||
        mask === "currency"
      ) {
        rawValue = onlyDigits(rawValue);
      }

      if (mask === "plate") {
        rawValue = rawValue.replace(/[^a-zA-Z0-9]/g, "");
      }

      const formatted = applyMask(rawValue, mask);
      e.target.value = formatted;

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: unmask ? rawValue : formatted,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isNumberInput && numberDisplay === "") {
        setNumberDisplay("0");

        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: "0" },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        onChange?.(syntheticEvent);
      }

      props.onBlur?.(e);
    };

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", wrapperClassName)}>
        <div className={cn(inputWrapperVariants({ size, status }))}>
          {prefix && (
            <span className="shrink-0 text-foreground-subtle font-medium select-none">
              {prefix}
            </span>
          )}
          {leftElement && renderAddon(leftElement)}

          <input
            ref={ref}
            id={id}
            type={inputType}
            inputMode={isNumberInput ? (inputMode ?? "decimal") : inputMode}
            pattern={
              isNumberInput ? (pattern ?? "-?[0-9]*[.,]?[0-9]*") : pattern
            }
            aria-describedby={helperId}
            aria-invalid={status === "error" || undefined}
            className={cn(
              "flex-1 min-w-0 bg-transparent outline-none text-foreground",
              "placeholder:text-foreground-subtle",
              "disabled:cursor-not-allowed",
              className,
            )}
            value={isNumberInput ? numberDisplay : normalizedValue}
            defaultValue={isNumberInput ? undefined : normalizedDefaultValue}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
          />

          {rightElement && renderAddon(rightElement)}
          {suffix && (
            <span className="shrink-0 text-foreground-subtle font-medium select-none">
              {suffix}
            </span>
          )}
        </div>

        {(errorMessage || helperText) && (
          <p
            id={helperId}
            className={cn(
              "text-xs leading-snug",
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

Input.displayName = "Input";
