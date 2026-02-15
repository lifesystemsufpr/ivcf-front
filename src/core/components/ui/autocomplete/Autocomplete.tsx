import * as React from "react";
import { useAutocomplete, type UseAutocompleteProps } from "./useAutocomplete";

interface AutocompleteProps<T> extends UseAutocompleteProps<T> {
  renderInput: (props: any) => React.ReactNode;
}

export function Autocomplete<T>({
  renderInput,
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
    <div ref={rootRef} style={{ position: "relative" }}>
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

      {open && (
        <ul
          id={`${id}-listbox`}
          ref={listRef}
          role="listbox"
          onScroll={handleScroll}
          style={{
            position: "absolute",
            width: "100%",
            maxHeight: 240,
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ddd",
            zIndex: 1000,
          }}
        >
          {filteredOptions.map((option, index) => {
            const active = index === activeIndex;

            return (
              <li
                key={index}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={active}
                style={{
                  padding: 8,
                  background: active ? "#eee" : undefined,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(option)}
              >
                {getOptionLabel(option)}
              </li>
            );
          })}

          {loading && <li style={{ padding: 8 }}>Loading...</li>}
        </ul>
      )}
    </div>
  );
}
