import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Box } from "@/core/components/ui/Box";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { Label } from "@/core/components/ui/Label";
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
  ageBounds,
}: FilterToolbarProps) {
  // 1. Estados Locais para inputs de texto/data (Buffer)
  const skipAgeSyncRef = useRef(false);
  const [localAge, setLocalAge] = useState<[number, number]>(
    filters.ageRange ?? [ageBounds.min, ageBounds.max],
  );
  const [localPeriod, setLocalPeriod] = useState({
    start: filters.period?.start ?? "",
    end: filters.period?.end ?? "",
  });

  useEffect(() => {
    setLocalAge(filters.ageRange ?? [ageBounds.min, ageBounds.max]);
    setLocalPeriod({
      start: filters.period?.start ?? "",
      end: filters.period?.end ?? "",
    });
  }, [filters.ageRange, filters.period, ageBounds]);

  useEffect(() => {
    if (skipAgeSyncRef.current) {
      skipAgeSyncRef.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (JSON.stringify(localAge) !== JSON.stringify(filters.ageRange)) {
        setFilter("ageRange", localAge);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localAge, setFilter, filters.ageRange]);

  // 4. Efeito de Debounce para Período
  useEffect(() => {
    const handler = setTimeout(() => {
      if (JSON.stringify(localPeriod) !== JSON.stringify(filters.period)) {
        setFilter("period", localPeriod);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localPeriod, setFilter, filters.period]);

  const handleAgeInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: 0 | 1,
  ) => {
    const value = Number(e.target.value);
    setLocalAge((prev) => {
      const next: [number, number] = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleClearFilters = () => {
    skipAgeSyncRef.current = true;
    setFilter("ageRange", undefined);
    setFilter("period", undefined);
    setFilter("sex", "all");
    setLocalAge([ageBounds.min, ageBounds.max]);
    setLocalPeriod({ start: "", end: "" });
  };

  const handlePeriodInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: "start" | "end",
  ) => {
    setLocalPeriod((prev) => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <Box className="group relative overflow-hidden rounded-lg border border-border/70 bg-card p-4 shadow-sm transition-all duration-300">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-muted" />
      <div className="flex flex-wrap items-end gap-4">
        {/* Sexo (Sem debounce, pois é clique único) */}
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

        {/* Idade com Debounce */}
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
              value={localAge[0]}
              onChange={(e) => handleAgeInputChange(e, 0)}
            />
            <span className="text-sm text-muted-foreground">até</span>
            <Input
              type="number"
              className="w-20"
              min={ageBounds.min}
              max={ageBounds.max}
              value={localAge[1]}
              onChange={(e) => handleAgeInputChange(e, 1)}
            />
          </Box>
        </Box>

        {/* Período com Debounce */}
        <Box className="space-y-1" display="flex" direction="column">
          <Label>Período de coleta</Label>
          <Box display="flex" align="center" gap={2}>
            <Input
              type="date"
              value={localPeriod.start}
              onChange={(e) => handlePeriodInputChange(e, "start")}
            />
            <Input
              type="date"
              value={localPeriod.end}
              onChange={(e) => handlePeriodInputChange(e, "end")}
            />
          </Box>
        </Box>

        {/* Estratificação */}
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
            <option value="ageGroup">Faixa Etária</option>
          </select>
        </Box>

        {/* Ações */}
        <div className="flex flex-1 justify-end gap-2">
          <Button variant="default" size="sm" onClick={handleClearFilters}>
            Limpar
          </Button>
        </div>
      </div>
    </Box>
  );
}
