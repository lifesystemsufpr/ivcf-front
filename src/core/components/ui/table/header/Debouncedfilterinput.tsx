import * as React from "react";

type DebouncedFilterInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

/**
 * Input de filtro com debounce.
 *
 * Mantém um estado local para o valor exibido — isso evita que o
 * re-render causado pelo server-side (filterState externo) roube o
 * foco do input a cada digitação.
 *
 * Só propaga a mudança para `onChange` após o usuário parar de digitar
 * por `debounceMs` milissegundos.
 */
export function DebouncedFilterInput({
  value: externalValue,
  onChange,
  placeholder = "Filtrar",
  debounceMs = 600,
}: DebouncedFilterInputProps) {
  const [localValue, setLocalValue] = React.useState(externalValue);

  // Sincroniza o valor externo → local apenas quando vier de fora
  // (ex: limpar filtros programaticamente), sem interferir na digitação
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Só atualiza o local se o valor externo realmente mudou por outro motivo
    setLocalValue(externalValue);
  }, [externalValue]);

  // Debounce: propaga para o pai após parar de digitar
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== externalValue) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
    />
  );
}
