import { type ChangeEvent, useState, useEffect } from "react";
import { Box } from "@/core/components/ui/Box";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { Label } from "@/core/components/ui/Label";
import type { AggregationDimension, FragilityFilters } from "../types";
import { apiRoutes } from "@/core/configs/api.routes";
import { client } from "@/core/services/client.service";

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

  const handlePeriodInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: "start" | "end",
  ) => {
    setLocalPeriod((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleExport = async () => {
    try {
      const endpoint = apiRoutes.ASSESSMENTS.EXPORT;

      const resp = await client(endpoint, {
        method: "GET",
        query: {
          sex: filters.sex,
          ageMin: filters.ageRange?.[0],
          ageMax: filters.ageRange?.[1],
        },
      });

      console.log("Resposta da exportação:", resp);

      const blob =
        resp instanceof Blob
          ? resp
          : new Blob([resp as unknown as BlobPart], {
              type: "text/csv;charset=utf-8;",
            });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "export.csv";
    } catch (error) {
      console.error("Erro ao solicitar exportação:", error);
    }
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilter("ageRange", undefined);
              setFilter("period", undefined);
              setFilter("sex", "all");
            }}
          >
            Limpar
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Exportar CSV
          </Button>
        </div>
      </div>
    </Box>
  );
}
