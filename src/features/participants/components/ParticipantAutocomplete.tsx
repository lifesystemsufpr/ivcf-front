import { Autocomplete, Input } from "@/core/components/ui";
import { useSearchParticipants } from "../hooks/useSearchParticipants";
import type { Participant } from "../types";
import { useCallback, useEffect, useRef, useState } from "react";

interface ParticipantAutocompleteProps {
  onChange?: (value: Participant | null) => void;
  onInitialResolve?: (value: Participant | null) => void;
  initialId?: string | null;
  initialValue?: Participant | null;
  className?: string;
}

export default function ParticipantAutocomplete({
  onChange,
  onInitialResolve,
  initialId,
  initialValue,
  className,
}: ParticipantAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(initialValue?.fullName ?? "");
  const [value, setValue] = useState<Participant | null>(initialValue ?? null);

  const { participants, isLoading } = useSearchParticipants({
    searchTerm,
  });

  const hasInitializedRef = useRef(false);

  // Sincronizar com initialId/initialValue
  useEffect(() => {
    if (hasInitializedRef.current) return;

    if (initialValue) {
      setValue(initialValue);
      setInputValue(initialValue.fullName);

      onInitialResolve?.(initialValue);
      hasInitializedRef.current = true;
    } else if (initialId && participants.length > 0) {
      const found = participants.find((p) => p.id === initialId);

      if (found) {
        setValue(found);
        setInputValue(found.fullName);

        onInitialResolve?.(found);
        hasInitializedRef.current = true;
      }
    }
  }, [initialId, initialValue, participants, onInitialResolve]);

  const handleInputChange = useCallback((newInputValue: string) => {
    setInputValue(newInputValue);
    setSearchTerm(newInputValue);
  }, []);

  const handleChange = useCallback(
    (selectedParticipant: Participant | null) => {
      setValue(selectedParticipant);
      if (selectedParticipant) {
        setInputValue(selectedParticipant.fullName);
        setSearchTerm("");
      } else {
        setInputValue("");
      }
      onChange?.(selectedParticipant);
    },
    [onChange],
  );

  return (
    <Autocomplete<Participant>
      options={participants}
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      loading={isLoading}
      getOptionLabel={(option) => option.fullName}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      renderInput={(params) => (
        <Input
          {...params}
          placeholder="Pesquise um participante por nome..."
          disabled={params.disabled}
        />
      )}
      renderOption={(option) => (
        <div className="flex flex-col">
          <span className="font-medium">{option.fullName}</span>
          <span className="text-xs text-muted-foreground">{option.email}</span>
        </div>
      )}
      noOptionsText="Nenhum participante encontrado"
      loadingText="Buscando participantes..."
      className={className}
    />
  );
}
