import { type ChangeEvent } from "react";
import { Box } from "@/core/components/ui/Box";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { Label } from "@/core/components/ui/Label";
import { Typography } from "@/core/components/ui/Typography";
import type {
  AggregationDimension,
  FragilityFilters,
  PatientFragility,
} from "../types";
import { exportCsv } from "../utils/transforms";

type FilterToolbarProps = {
  filters: FragilityFilters;
  setFilter: (
    key: keyof FragilityFilters,
    value: FragilityFilters[keyof FragilityFilters],
  ) => void;
  stratification: AggregationDimension;
  setStratification: (value: AggregationDimension) => void;
  trendBySex: boolean;
  setTrendBySex: (value: boolean) => void;
  ageBounds: { min: number; max: number };
  filteredData: PatientFragility[];
};

export function FilterToolbar({
  filters,
  setFilter,
  stratification,
  setStratification,
  trendBySex,
  setTrendBySex,
  ageBounds,
  filteredData,
}: FilterToolbarProps) {
  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const value = Number(e.target.value);
    const current = filters.ageRange ?? [ageBounds.min, ageBounds.max];
    const next: [number, number] =
      index === 0 ? [value, current[1]] : [current[0], value];
    setFilter("ageRange", next);
  };

  return (
    <Box className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        <Box className="space-y-1" display="flex" direction="column">
          <Label htmlFor="sexo">Sexo</Label>
          <select
            id="sexo"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={filters.sex ?? "all"}
            onChange={(e) =>
              setFilter("sex", e.target.value as FragilityFilters["sex"])
            }
          >
            <option value="all">Todos</option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
          </select>
        </Box>

        <Box className="space-y-1" display="flex" direction="column">
          <Label>Idade (mín - máx)</Label>
          <Box display="flex" align="center" gap={2}>
            <Input
              type="number"
              className="w-20"
              min={ageBounds.min}
              max={ageBounds.max}
              value={(filters.ageRange ?? [ageBounds.min, ageBounds.max])[0]}
              onChange={(e) => handleAgeChange(e, 0)}
            />
            <span className="text-sm text-muted-foreground">até</span>
            <Input
              type="number"
              className="w-20"
              min={ageBounds.min}
              max={ageBounds.max}
              value={(filters.ageRange ?? [ageBounds.min, ageBounds.max])[1]}
              onChange={(e) => handleAgeChange(e, 1)}
            />
          </Box>
        </Box>

        <Box className="space-y-1" display="flex" direction="column">
          <Label>Período</Label>
          <Box display="flex" align="center" gap={2}>
            <Input
              type="date"
              value={filters.period?.start ?? ""}
              onChange={(e) =>
                setFilter("period", {
                  ...(filters.period ?? {}),
                  start: e.target.value,
                })
              }
            />
            <span className="text-sm text-muted-foreground">até</span>
            <Input
              type="date"
              value={filters.period?.end ?? ""}
              onChange={(e) =>
                setFilter("period", {
                  ...(filters.period ?? {}),
                  end: e.target.value,
                })
              }
            />
          </Box>
        </Box>

        <Box className="space-y-1" display="flex" direction="column">
          <Label htmlFor="estratificacao">Estratificar por</Label>
          <select
            id="estratificacao"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={stratification}
            onChange={(e) =>
              setStratification(e.target.value as AggregationDimension)
            }
          >
            <option value="sex">Sexo</option>
            <option value="ageGroup">Faixa etária</option>
          </select>
        </Box>

        <Box className="space-y-1" display="flex" direction="column">
          <Label>Modo linha temporal</Label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={trendBySex}
                onChange={(e) => setTrendBySex(e.target.checked)}
              />
              <span>Separar por sexo</span>
            </label>
          </div>
        </Box>

        <div className="flex flex-1 justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("ageRange", undefined)}
          >
            Reset idade
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("period", undefined)}
          >
            Reset período
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportCsv(filteredData, "ivcf_fragilidade_filtrado")}
          >
            Exportar CSV
          </Button>
        </div>
      </div>
      <Typography variant="caption" className="mt-2 block">
        Dica clínica: mantenha a mesma escala de scores entre gráficos para
        leitura consistente.
      </Typography>
    </Box>
  );
}
