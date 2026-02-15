import * as React from "react";

export interface UseAutocompleteProps<T> {
  options: T[];

  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null) => void;

  inputValue?: string;
  onInputChange?: (value: string) => void;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  getOptionLabel?: (option: T) => string;
  isOptionEqualToValue?: (a: T, b: T) => boolean;

  loading?: boolean;

  onEndReached?: () => void;
  endReachedThreshold?: number;

  disabled?: boolean;
}

export function useAutocomplete<T>({
  options,
  value: controlledValue,
  defaultValue = null,
  onChange,

  inputValue: controlledInputValue,
  onInputChange,

  open: controlledOpen,
  onOpenChange,

  getOptionLabel = (o) => String(o),
  isOptionEqualToValue = (a, b) => a === b,

  loading = false,
  onEndReached,
  endReachedThreshold = 0.8,
  disabled = false,
}: UseAutocompleteProps<T>) {
  const id = React.useId();

  const isValueControlled = controlledValue !== undefined;
  const isInputControlled = controlledInputValue !== undefined;
  const isOpenControlled = controlledOpen !== undefined;

  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<T | null>(defaultValue);

  const [uncontrolledInputValue, setUncontrolledInputValue] =
    React.useState("");

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const listRef = React.useRef<HTMLUListElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const endReachedRef = React.useRef(false);

  const value = isValueControlled ? controlledValue : uncontrolledValue;
  const inputValue = isInputControlled
    ? controlledInputValue ?? ""
    : uncontrolledInputValue;
  const open = isOpenControlled ? controlledOpen : uncontrolledOpen;

  const setValue = (v: T | null) => {
    if (!isValueControlled) setUncontrolledValue(v);
    onChange?.(v);
  };

  const setInputValue = (v: string) => {
    if (!isInputControlled) setUncontrolledInputValue(v);
    onInputChange?.(v);
  };

  const setOpen = (o: boolean) => {
    if (!isOpenControlled) setUncontrolledOpen(o);
    onOpenChange?.(o);
  };

  const filteredOptions = options;

  const selectOption = (option: T) => {
    setValue(option);
    setInputValue(getOptionLabel(option));
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && e.key === "ArrowDown") {
      setOpen(true);
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const option = filteredOptions[activeIndex];
      if (option) selectOption(option);
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.children[activeIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    if (!onEndReached || loading) return;

    const el = event.currentTarget;
    const progress =
      (el.scrollTop + el.clientHeight) / el.scrollHeight;

    const reached = progress >= endReachedThreshold;

    if (reached && !endReachedRef.current) {
      endReachedRef.current = true;
      onEndReached();
    }

    if (!reached) {
      endReachedRef.current = false;
    }
  };

  React.useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (!rootRef.current) return;
    if (rootRef.current.contains(event.target as Node)) return;
    setOpen(false);
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, [setOpen]);

  return {
    id,
    rootRef,
    listRef,
    value,
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
    isOptionEqualToValue,
  };
}
