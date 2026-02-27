import * as React from "react";
import { cn } from "@/core/utils";
import { useAutocomplete, type UseAutocompleteProps } from "./useAutocomplete";

interface AutocompleteProps<T> extends UseAutocompleteProps<T> {
  renderInput: (props: any) => React.ReactNode;
  renderOption?: (option: T, state: { active: boolean }) => React.ReactNode;
  loadingText?: string;
  noOptionsText?: string;
  menuClassName?: string;
  optionClassName?: string;
  className?: string;
}

export function Autocomplete<T>({
  renderInput,
  renderOption,
  loadingText = "Carregando...",
  noOptionsText = "Nenhum resultado",
  menuClassName,
  optionClassName,
  className,
  ...hookProps
}: AutocompleteProps<T>) {
  const {
    id,
    rootRef,
    listRef,
    inputValue,
    open,
    activeIndex,
    loading,
    disabled,
    setInputValue,
    setOpen,
    setActiveIndex,
    handleKeyDown,
    handleScroll,
    selectOption,
    filteredOptions,
    getOptionLabel,
  } = useAutocomplete(hookProps);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {renderInput({
        role: "combobox",
        "aria-expanded": open,
        "aria-controls": `${id}-listbox`,
        "aria-autocomplete": "list",
        "aria-activedescendant":
          activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined,
        value: inputValue,
        disabled,
        onChange: (e: any) => {
          setInputValue(e.target.value);
          setOpen(true);
        },
        onKeyDown: handleKeyDown,
        onFocus: () => setOpen(true),
      })}

      <div
        className={cn(
          "absolute left-0 right-0 z-50 mt-1 origin-top rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-xl",
          "transition-all duration-150 ease-out",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
          menuClassName,
        )}
      >
        <ul
          id={`${id}-listbox`}
          ref={listRef}
          role="listbox"
          onScroll={handleScroll}
          className="max-h-60 overflow-y-auto py-1"
        >
          {loading && (
            <li className="px-3 py-2 text-sm text-[hsl(var(--muted-foreground))]">
              {loadingText}
            </li>
          )}

          {!loading && filteredOptions.length === 0 && (
            <li className="px-3 py-2 text-sm text-[hsl(var(--muted-foreground))]">
              {noOptionsText}
            </li>
          )}

          {!loading &&
            filteredOptions.map((option, index) => {
              const active = index === activeIndex;
              const content = renderOption
                ? renderOption(option, { active })
                : getOptionLabel(option);

              return (
                <li key={index} className="w-full">
                  <button
                    type="button"
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectOption(option)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors cursor-pointer",
                      active
                        ? "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
                        : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]",
                      optionClassName,
                    )}
                  >
                    {content}
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
