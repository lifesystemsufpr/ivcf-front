import { Autocomplete, Input } from "@/core/components/ui";
import { participantsMock } from "../mocks";
import type { Participant } from "../types";

export default function ParticipantAutocomplete() {
  const participantes: Participant[] = participantsMock;

  return (
    <Autocomplete
      options={participantes}
      renderInput={(params) => (
        <Input {...params} placeholder="Selecione um participante" />
      )}
      getOptionLabel={(option) => option.fullName}
    />
  );
}
