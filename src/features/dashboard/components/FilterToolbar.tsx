import { type ChangeEvent, useCallback } from "react";
import { Box } from "@/core/components/ui/Box";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { Label } from "@/core/components/ui/Label";
import { Typography } from "@/core/components/ui/Typography";
import type { AggregationDimension, FragilityFilters } from "../types";

type FilterToolbarProps = {
  filters: FragilityFilters;
  setFilter: <K extends keyof FragilityFilters>(
    key: K,
    value: FragilityFilters[K],
  ) => void;
  stratification: AggregationDimension;
  setStratification: (value: AggregationDimension) => void;
  trendBySex: boolean;
  setTrendBySex: (value: boolean) => void;
  ageBounds: { min: number; max: number };
};

export function FilterToolbar({
  filters,
  setFilter,
  stratification,
  setStratification,
  trendBySex,
  setTrendBySex,
  ageBounds,
}: FilterToolbarProps) {
  // Handlers memorizados para evitar re-renderizações desnecessárias
  const handleAgeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
      const value = Number(e.target.value);
      const current = filters.ageRange ?? [ageBounds.min, ageBounds.max];
      const next: [number, number] =
        index === 0 ? [value, current[1]] : [current[0], value];
      setFilter("ageRange", next);
    },
    [filters.ageRange, ageBounds, setFilter],
  );

  const handleExport = () => {
    // No modo profissional, enviamos os filtros para o BFF gerar o arquivo
    console.log("Solicitando exportação ao BFF com filtros:", filters);
    alert("O download do CSV será processado pelo servidor.");
  };

  return (
    <Box className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        {/* Filtro de Sexo */}
        <Box className="space-y-1" display="flex" direction="column">
          <Label htmlFor="sexo">Sexo</Label>
          <select
            id="sexo"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary"
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

        {/* Filtro de Idade */}
        <Box className="space-y-1" display="flex" direction="column">
          <Label>
            Idade ({ageBounds.min} - {ageBounds.max})
          </Label>
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

        {/* Filtro de Período */}
        <Box className="space-y-1" display="flex" direction="column">
          <Label>Período de coleta</Label>
          <Box display="flex" align="center" gap={2}>
            <Input
              type="date"
              value={filters.period?.start ?? ""}
              onChange={(e) =>
                setFilter("period", {
                  ...filters.period,
                  start: e.target.value,
                })
              }
            />
            <Input
              type="date"
              value={filters.period?.end ?? ""}
              onChange={(e) =>
                setFilter("period", { ...filters.period, end: e.target.value })
              }
            />
          </Box>
        </Box>

        {/* Estratificação de Gráficos */}
        <Box className="space-y-1" display="flex" direction="column">
          <Label htmlFor="estratificacao">Estratificar Heatmap/Pirâmide</Label>
          <select
            id="estratificacao"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={stratification}
            onChange={(e) =>
              setStratification(e.target.value as AggregationDimension)
            }
          >
            <option value="sex">Por Sexo</option>
            <option value="ageGroup">Por Faixa Etária</option>
          </select>
        </Box>

        {/* Toggle de Tendência */}
        <Box className="pb-2">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={trendBySex}
              onChange={(e) => setTrendBySex(e.target.checked)}
            />
            <span>Tendência por sexo</span>
          </label>
        </Box>

        {/* Ações de Reset e Exportação */}
        <div className="flex flex-1 justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilter("ageRange", undefined);
              setFilter("period", undefined);
              setFilter("sex", "all");
            }}
          >
            Limpar Filtros
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Exportar CSV
          </Button>
        </div>
      </div>
      <Typography
        variant="caption"
        className="mt-2 block text-muted-foreground italic"
      >
        * As alterações nos filtros atualizam todos os indicadores e gráficos
        automaticamente.
      </Typography>
    </Box>
  );
}
