import * as React from "react";
import { cn } from "../../utils";

// 1. Adicionamos "cep" ao tipo
type MaskType = "phone" | "cep" | "none";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: MaskType;
}

const applyPhoneMask = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  const limited = numbers.slice(0, 11);

  if (limited.length <= 2) return limited;
  if (limited.length <= 6)
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  if (limited.length <= 10) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  }
  return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
};

// 2. Criamos a função para o CEP
const applyCepMask = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  const limited = numbers.slice(0, 8); // CEP tem 8 dígitos

  if (limited.length <= 5) {
    return limited;
  }
  return `${limited.slice(0, 5)}-${limited.slice(5)}`;
};

const applyMask = (value: string, maskType: MaskType): string => {
  switch (maskType) {
    case "phone":
      return applyPhoneMask(value);
    case "cep":
      return applyCepMask(value);
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
        // Atualiza o valor do input manualmente para refletir a máscara
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
