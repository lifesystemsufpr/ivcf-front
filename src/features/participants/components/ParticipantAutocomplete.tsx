import { Autocomplete, Input } from "@/core/components/ui";
import { useParticipantContext } from "../context/ParticipantContext";
import type { Participant } from "../types";

interface ParticipantAutocompleteProps {
  onChange?: (value: Participant | null) => void;
  initialId?: string | null;
  className?: string;
}

export default function ParticipantAutocomplete({
  onChange,
  initialId,
  className,
}: ParticipantAutocompleteProps) {
  const { participants } = useParticipantContext();
  const value = participants.find((p) => p.id === initialId) || null;

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
      value={value}
      className={className}
    />
  );
}
