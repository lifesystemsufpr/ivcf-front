import { describe, it, expect } from "vitest";
import { cn, formatDate, formatDateTime } from "./index";

describe("cn (merge de classes Tailwind)", () => {
  it("junta classes e remove falsy", () => {
    expect(cn("a", false, "b", undefined, "c")).toBe("a b c");
  });

  it("a última classe conflitante vence (twMerge)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("formatDate (pt-BR)", () => {
  it("formata uma data ISO no padrão dd/mm/aaaa", () => {
    expect(formatDate("2026-06-14T00:00:00")).toBe("14/06/2026");
  });

  // Adversarial: data inválida não pode lançar; vira "Invalid Date".
  it("não lança para data inválida", () => {
    expect(() => formatDate("nao-e-data")).not.toThrow();
    expect(formatDate("nao-e-data")).toContain("Invalid");
  });
});

describe("formatDateTime", () => {
  it("inclui dia, mês por extenso e horário", () => {
    const out = formatDateTime("2026-06-14T09:30:00");
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/09:30|9:30/);
  });
});
