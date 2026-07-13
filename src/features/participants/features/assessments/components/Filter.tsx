import { Autocomplete, Box, Button, Input, Label } from "@/core/components/ui";
import {
  frailtyClassificationList,
  type FrailtyClassification,
} from "@/core/types";
import { useState } from "react";
import type { AssessmentFilters } from "../hooks/useFetchAssessments";

interface FilterProps {
  onApply: (filters: AssessmentFilters) => void;
}

export default function Filter({ onApply }: FilterProps) {
  const [selectedClassification, setSelectedClassification] =
    useState<FrailtyClassification | null>("Todos");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleClearFilters = () => {
    setSelectedClassification("Todos");
    setStartDate("");
    setEndDate("");
    onApply({});
  };

  const handleApplyFilters = () => {
    onApply({
      classification:
        selectedClassification && selectedClassification !== "Todos"
          ? selectedClassification
          : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  return (
    <Box display="flex" direction="column" gap={12}>
      <Box display="flex" gap={4} direction="row">
        <Box display="flex" direction="column" gap={2} className="flex-1">
          <Label>Filtrar por Fragilidade</Label>
          <Autocomplete
            options={frailtyClassificationList}
            renderInput={(params) => (
              <Input {...params} placeholder="Pesquise uma fragilidade" />
            )}
            onChange={(value: FrailtyClassification | null) => {
              setSelectedClassification(value);
            }}
            inputValue={selectedClassification || ""}
            getOptionLabel={(option) => option}
            value={selectedClassification}
          />
        </Box>
        <Box display="flex" direction="column" gap={2} className="flex-1">
          <Label>Filtrar por Data</Label>
          <Box display="flex" direction="row" gap={4}>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Box>
        </Box>
      </Box>
      <Box>
        <Button variant="outline" className="mr-2" onClick={handleClearFilters}>
          Limpar Filtros
        </Button>
        <Button variant="secondary" onClick={handleApplyFilters}>
          Aplicar Filtros
        </Button>
      </Box>
    </Box>
  );
}
