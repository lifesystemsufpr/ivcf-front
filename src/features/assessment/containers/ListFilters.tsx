import { Box, Button } from "@/core/components/ui";
import { useAssessmentList } from "../contexts/AssessmentListContext";
import ParticipantAutocomplete from "@/features/participants/components/ParticipantAutocomplete";
import { ParticipantProvider } from "@/features/participants/context/ParticipantContext";
import DateFilter from "../components/DateFilter";

export default function ListFilters() {
  const {
    setStartDate,
    setEndDate,
    startDate,
    endDate,
    setParticipantName,
    onSubmitFilters,
  } = useAssessmentList();

  return (
    <Box display="flex" direction="column" gap={10}>
      <Box display="flex" direction="row" gap={20} my={4} align="center">
        <ParticipantProvider>
          <Box
            display="flex"
            direction="row"
            gap={4}
            align="center"
            className="w-full"
          >
            <ParticipantAutocomplete
              className="w-full"
              onChange={(participant) => {
                setParticipantName(participant?.fullName || "");
              }}
            />
          </Box>
        </ParticipantProvider>

        <Box
          display="flex"
          direction="row"
          gap={10}
          align="center"
          className="flex w-full"
        >
          <DateFilter
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
            }}
          />
          <DateFilter
            value={endDate}
            onChange={(date) => {
              setEndDate(date);
            }}
          />
        </Box>
      </Box>

      <Box>
        <Button
          variant="outline"
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setParticipantName("");
            onSubmitFilters();
          }}
        >
          Limpar filtros
        </Button>

        <Button onClick={onSubmitFilters} className="ml-2">
          Aplicar filtros
        </Button>
      </Box>
    </Box>
  );
}
