import { Autocomplete, Input } from "@/core/components/ui";
import { useParticipantContext } from "../context/ParticipantContext";
import type { Participant } from "../types";

interface ParticipantAutocompleteProps {
  onChange?: (value: Participant | null) => void;
  className?: string;
}

export default function ParticipantAutocomplete({
  onChange,
  className,
}: ParticipantAutocompleteProps) {
  const { participants } = useParticipantContext();

  return (
    <Autocomplete
      options={participants}
      renderInput={(params) => (
        <Input {...params} placeholder="Pesquise um participante" />
      )}
      getOptionLabel={(option) => option.fullName}
      onChange={(value: Participant | null) => {
        onChange?.(value);
      }}
      className={className}
    />
  );
}
