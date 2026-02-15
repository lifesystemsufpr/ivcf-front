import { Autocomplete, Input } from "@/core/components/ui";
import { useParticipantContext } from "../context/ParticipantContext";

export default function ParticipantAutocomplete() {
  const { participants } = useParticipantContext();

  return (
    <Autocomplete
      options={participants}
      renderInput={(params) => (
        <Input {...params} placeholder="Pesquise um participante" />
      )}
      getOptionLabel={(option) => option.fullName}
    />
  );
}
