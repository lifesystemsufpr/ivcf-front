import { Box, Button, Typography, Label } from "@/core/components/ui";
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
    clearFilters,
  } = useAssessmentList();

  return (
    <Box
      className="rounded-lg border bg-card p-4 shadow-md"
      display="flex"
      direction="column"
      gap={4}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Typography variant="h4">Filtros de avaliação</Typography>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={clearFilters}>
            <Typography variant="small" color="accent">
              Limpar filtros
            </Typography>
          </Button>

          <Button onClick={onSubmitFilters} variant="secondary">
            <Typography variant="small" color="primary">
              Aplicar filtros
            </Typography>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ParticipantProvider>
          <div className="space-y-1 md:col-span-1">
            <Label>Participante</Label>
            <ParticipantAutocomplete
              className="w-full"
              onChange={(participant) => {
                setParticipantName(participant?.fullName || "");
              }}
            />
          </div>
        </ParticipantProvider>

        <div className="space-y-1">
          <Label htmlFor="start-date">Data inicial</Label>
          <DateFilter
            id="start-date"
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
            }}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="end-date">Data final</Label>
          <DateFilter
            id="end-date"
            value={endDate}
            onChange={(date) => {
              setEndDate(date);
            }}
          />
        </div>
      </div>
    </Box>
  );
}
