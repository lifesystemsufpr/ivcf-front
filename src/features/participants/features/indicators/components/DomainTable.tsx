import { Badge, Table, Typography, createColumn } from "@/core/components/ui";
import { IVCF_DOMAIN_MAX } from "@/core/consts/ivcf.consts";
import { useMemo } from "react";
import type { IVCF_AssessmentWithDate, IVCF_DomainScores } from "../types";

type DomainKey = keyof IVCF_DomainScores;

export type DomainTableDomainDefinition = {
  key: DomainKey;
  label: string;
};

type DomainTableProps = {
  assessments: IVCF_AssessmentWithDate[];
  domains: DomainTableDomainDefinition[];
  selectedDomainKeys: DomainKey[];
};

type DomainTableRow = {
  domainKey: DomainKey;
  domainLabel: string;
  scoresByDate: Record<string, number | null>;
};

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function DomainTable({
  assessments,
  domains,
  selectedDomainKeys,
}: DomainTableProps) {
  const sortedAssessments = useMemo(
    () =>
      [...assessments].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [assessments],
  );

  const assessmentsByDate = useMemo(() => {
    const map = new Map<string, IVCF_AssessmentWithDate>();
    for (const assessment of sortedAssessments) {
      map.set(assessment.date, assessment);
    }
    return Array.from(map.values());
  }, [sortedAssessments]);

  const dateKeys = useMemo(
    () => assessmentsByDate.map((assessment) => assessment.date),
    [assessmentsByDate],
  );

  const rows = useMemo<DomainTableRow[]>(() => {
    const activeDomains = domains.filter((domain) =>
      selectedDomainKeys.includes(domain.key),
    );

    return activeDomains.map((domain) => {
      const scoresByDate: DomainTableRow["scoresByDate"] = {};

      for (const assessment of assessmentsByDate) {
        const score = assessment.domains[domain.key];
        scoresByDate[assessment.date] =
          typeof score === "number" ? score : null;
      }

      return {
        domainKey: domain.key,
        domainLabel: domain.label,
        scoresByDate,
      };
    });
  }, [domains, selectedDomainKeys, assessmentsByDate]);

  const columns = useMemo(() => {
    const baseColumn = createColumn<DomainTableRow>({
      id: "domain",
      field: "domainLabel",
      header: "Domínio",
      className: "font-medium",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <span>{row.domainLabel}</span>
          <Badge variant="outline" className="text-[10px]">
            máx {IVCF_DOMAIN_MAX[row.domainKey]}
          </Badge>
        </div>
      ),
    });

    const dateColumns = dateKeys.map((dateKey) =>
      createColumn<DomainTableRow>({
        id: dateKey,
        field: `scoresByDate.${dateKey}`,
        header: formatDateLabel(dateKey),
        align: "right",
        render: (value, row) => {
          const score =
            typeof value === "number"
              ? value
              : (row.scoresByDate[dateKey] ?? null);

          if (score == null) {
            return <span className="text-muted-foreground">-</span>;
          }

          return (
            <div className="text-left w-full inline-flex items-baseline gap-1">
              <span className="font-semibold">{score}</span>
              <span className="text-xs text-muted-foreground">
                /{IVCF_DOMAIN_MAX[row.domainKey]}
              </span>
            </div>
          );
        },
      }),
    );

    return [baseColumn, ...dateColumns];
  }, [dateKeys]);

  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="mb-4 space-y-1">
        <Typography as="h3" variant="h4">
          Tabela Comparativa de Domínios
        </Typography>
        <Typography variant="small">
          Linhas por domínio e colunas por data de avaliação.
        </Typography>
      </div>

      <Table.Root
        data={rows}
        columns={columns}
        pageSize={Math.max(rows.length, 1)}
        wrapperClassName="border-border"
      >
        <Table.Header />
        <Table.Body emptyMessage="Sem dados de domínio para exibir" />
      </Table.Root>
    </section>
  );
}
