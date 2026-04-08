import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import { Button } from "@/core/components/ui/Button";
import type { DrilldownNode } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewLevel = {
  data: DrilldownNode[];
  title: string;
  parentId: string | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the ratio of "Sim" answers (the BAD outcome).
 * High rate = high non-compliance.
 */
function simRate(node: DrilldownNode) {
  const total = node.counts.sim + node.counts.nao;
  return total === 0 ? 0 : node.counts.sim / total;
}

/**
 * Risk level based on Sim rate (Sim = bad).
 * Uses the design-system palette:
 *   - Adequado → accent  (green)
 *   - Atenção  → primary (blue)
 *   - Crítico  → destructive (red)
 */
function riskLevel(rate: number): {
  label: string;
  color: string;
  bg: string;
  ring: string;
  badgeBg: string;
  badgeText: string;
} {
  if (rate <= 0.2)
    return {
      label: "Adequado",
      color: "text-accent",
      bg: "bg-accent",
      ring: "ring-accent-soft",
      badgeBg: "bg-accent-soft",
      badgeText: "text-accent-foreground",
    };
  if (rate <= 0.5)
    return {
      label: "Atenção",
      color: "text-primary",
      bg: "bg-primary",
      ring: "ring-primary-soft",
      badgeBg: "bg-primary-soft",
      badgeText: "text-primary",
    };
  return {
    label: "Crítico",
    color: "text-destructive",
    bg: "bg-destructive",
    ring: "ring-destructive/20",
    badgeBg: "bg-destructive/10",
    badgeText: "text-destructive",
  };
}

function overallStats(data: DrilldownNode[]) {
  const totSim = data.reduce((s, n) => s + n.counts.sim, 0);
  const totNao = data.reduce((s, n) => s + n.counts.nao, 0);
  const total = totSim + totNao;
  const rate = total === 0 ? 0 : totSim / total;
  return { totSim, totNao, total, rate };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Thin animated bar — fills proportional to Sim (bad) rate */
function ComplianceBar({ rate, colorBg }: { rate: number; colorBg: string }) {
  return (
    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorBg}`}
        style={{ width: `${(rate * 100).toFixed(1)}%` }}
      />
    </div>
  );
}

/** Summary pill shown in the header */
function StatPill({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center px-3 py-1.5 rounded-lg border text-xs gap-0.5 ${
        highlight
          ? "border-primary/20 bg-primary-soft"
          : "border-border bg-muted"
      }`}
    >
      <span
        className={`font-semibold text-sm ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

// ─── Domain overview row ──────────────────────────────────────────────────────

function DomainRow({
  node,
  onClick,
  isCompact,
}: {
  node: DrilldownNode;
  onClick: () => void;
  isCompact: boolean;
}) {
  const rate = simRate(node);
  const risk = riskLevel(rate);
  const total = node.counts.sim + node.counts.nao;
  const hasChildren = !!node.children?.length;

  return (
    <button
      onClick={onClick}
      disabled={!hasChildren}
      className={`w-full text-left rounded-xl border transition-all duration-150 group
        ${
          hasChildren
            ? "cursor-pointer hover:border-primary/40 hover:shadow-sm hover:bg-primary-soft/30"
            : "cursor-default"
        }
        border-border bg-card ${isCompact ? "p-3" : "p-4"}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Risk dot */}
        <span
          className={`shrink-0 w-2.5 h-2.5 rounded-full ${risk.bg} ring-2 ${risk.ring}`}
        />

        {/* Label + bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <span
              className={`font-medium text-foreground truncate ${isCompact ? "text-xs" : "text-sm"}`}
            >
              {node.label}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-semibold ${risk.color}`}>
                {(rate * 100).toFixed(0)}%
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {node.counts.sim}/{total}
              </span>
            </div>
          </div>
          <ComplianceBar rate={rate} colorBg={risk.bg} />
        </div>

        {/* Drill arrow */}
        {hasChildren && (
          <span className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors text-sm">
            →
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Question (leaf) row ──────────────────────────────────────────────────────

function QuestionRow({
  node,
  rank,
  isCompact,
}: {
  node: DrilldownNode;
  rank: number;
  isCompact: boolean;
}) {
  const rate = simRate(node);
  const risk = riskLevel(rate);
  const total = node.counts.sim + node.counts.nao;

  return (
    <div
      className={`w-full rounded-xl border border-border bg-card transition-all duration-150 ${
        isCompact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Rank badge */}
        <span className="shrink-0 w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center font-medium mt-0.5">
          {rank}
        </span>

        <div className="flex-1 min-w-0">
          {/* Question label */}
          <p
            className={`text-foreground font-medium leading-snug mb-2 ${isCompact ? "text-xs" : "text-sm"}`}
          >
            {node.label}
          </p>

          {/* Dual progress bar — Sim (bad/destructive) | Não (good/accent) */}
          <div className="flex h-3 rounded-full overflow-hidden bg-muted gap-px">
            {total > 0 && (
              <>
                <div
                  className="bg-destructive transition-all duration-500"
                  style={{ width: `${(node.counts.sim / total) * 100}%` }}
                  title={`Sim: ${node.counts.sim}`}
                />
                <div
                  className="bg-accent transition-all duration-500"
                  style={{ width: `${(node.counts.nao / total) * 100}%` }}
                  title={`Não: ${node.counts.nao}`}
                />
              </>
            )}
          </div>

          {/* Counts row */}
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              {/* Sim = bad = destructive */}
              <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
              Sim: <b className="text-foreground">{node.counts.sim}</b>
            </span>
            <span className="flex items-center gap-1">
              {/* Não = good = accent */}
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              Não: <b className="text-foreground">{node.counts.nao}</b>
            </span>
            <span className={`ml-auto font-semibold ${risk.color}`}>
              {(rate * 100).toFixed(0)}% indicam fragilidade
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DomainDrilldownBars({
  fullData,
  isCompact = false,
}: {
  fullData: DrilldownNode[];
  isCompact?: boolean;
}) {
  const [history, setHistory] = useState<ViewLevel[]>([
    { data: fullData, title: "Visão Geral por Domínio", parentId: null },
  ]);
  const [search, setSearch] = useState("");

  const currentView = history[history.length - 1];
  const isTopLevel = history.length === 1;

  const isQuestionsView =
    !isTopLevel &&
    currentView.data.every((n) => !n.children || n.children.length === 0);

  const stats = useMemo(() => overallStats(currentView.data), [currentView]);

  const processedData = useMemo(() => {
    let list = [...currentView.data];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.label.toLowerCase().includes(q));
    }

    return list;
  }, [currentView, search]);

  const handleDrillDown = (node: DrilldownNode) => {
    if (!node.children?.length) return;
    setHistory((prev) => [
      ...prev,
      { data: node.children!, title: `${node.label}`, parentId: node.id },
    ]);
    setSearch("");
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
      setSearch("");
    }
  };

  const overallRisk = riskLevel(stats.rate);

  return (
    <Card
      className={`group relative flex flex-col overflow-hidden border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        isCompact ? "h-95" : "h-125"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/70" />

      {/* ── Header ── */}
      <CardHeader className="shrink-0 pb-2 pt-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {history.map((level, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs">
              {i > 0 && <span className="text-muted-foreground/40">/</span>}
              <button
                onClick={() => {
                  if (i < history.length - 1) {
                    setHistory((prev) => prev.slice(0, i + 1));
                    setSearch("");
                  }
                }}
                className={`${
                  i === history.length - 1
                    ? "text-foreground font-semibold cursor-default"
                    : "text-primary hover:underline cursor-pointer"
                }`}
              >
                {i === 0 ? "Domínios" : level.title}
              </button>
            </span>
          ))}
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-2">
          <StatPill
            label="Indicam Fragilidade"
            value={`${(stats.rate * 100).toFixed(1)}%`}
            highlight
          />
          <StatPill label="Sim" value={String(stats.totSim)} />
          <StatPill label="Não" value={String(stats.totNao)} />
          <StatPill label="Total" value={String(stats.total)} />
          <span
            className={`ml-auto self-center text-xs font-semibold px-2.5 py-1 rounded-full
              ${overallRisk.badgeBg} ${overallRisk.badgeText}`}
          >
            {overallRisk.label}
          </span>
        </div>
      </CardHeader>

      {/* ── Content ── */}
      <CardContent className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
        {processedData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 text-sm text-muted-foreground">
            Nenhum resultado encontrado.
          </div>
        ) : isQuestionsView ? (
          <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-2">
            {processedData.map((node, i) => (
              <QuestionRow
                key={node.id}
                node={node}
                rank={i + 1}
                isCompact={isCompact}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-2">
            {processedData.map((node) => (
              <DomainRow
                key={node.id}
                node={node}
                onClick={() => handleDrillDown(node)}
                isCompact={isCompact}
              />
            ))}
          </div>
        )}
      </CardContent>

      {/* ── Footer back button ── */}
      {history.length > 1 && (
        <div className="shrink-0 border-t border-border/70 px-4 pb-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="text-xs"
          >
            ← Voltar
          </Button>
        </div>
      )}
    </Card>
  );
}
