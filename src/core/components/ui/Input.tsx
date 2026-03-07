import * as React from "react";
import { cn } from "../../utils";

type MaskType = "phone" | "none";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: MaskType;
}

const applyPhoneMask = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 11 dígitos
  const limited = numbers.slice(0, 11);

  // Aplica a máscara de acordo com o tamanho
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else if (limited.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  } else {
    // Celular: (XX) XXXXX-XXXX
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
  }
};

const applyMask = (value: string, maskType: MaskType): string => {
  switch (maskType) {
    case "phone":
      return applyPhoneMask(value);
    case "none":
    default:
      return value;
  }
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", mask = "none", onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (mask !== "none") {
        const maskedValue = applyMask(e.target.value, mask);
        e.target.value = maskedValue;
      }

      onChange?.(e);
    };

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onChange={handleChange}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
