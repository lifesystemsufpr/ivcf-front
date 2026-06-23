# processo-IA — ivcf-front

> Como aplicar **testes com IA, code review com IA e automação** neste repositório.
> Documento de orientação (o "como"). **Não contém código.** Task: [86e1tmk1q](https://app.clickup.com/t/86e1tmk1q).

## 1. Contexto do repo

- **Stack:** Vite + React 19 (SPA, TypeScript) · **Package manager:** npm.
- **Teste hoje:** Vitest 4 + `@testing-library/react` (jsdom) **já configurados** (`vitest.config.ts`,
  setup em `src/test/setup.ts`). **2 testes** existem na branch `test/ai-component-tests`
  (`src/core/utils/index.test.ts`, `src/core/components/ui/Button.test.tsx`).
- **Scripts:** `test` (`vitest run`), `test:cov` (`vitest run --coverage`), `lint` (`eslint .`),
  `build` (`tsc -b && vite build` — typecheck embutido).
- **Cobertura:** provider v8, `include: src/core/**`. Threshold-alvo do produto: **40%** (frontends, em
  [`repos.config.ts`](https://github.com/lifesystemsufpr/devops-hub/blob/main/scripts/repos.config.ts)).
- **CI:** **não há** `.github/workflows/` no repo ainda.

## 2. Testes unitários / de componente com IA

Framework: **Vitest + Testing Library** (jsdom já ativo). Gerar testes com a skill
[`generate-tests`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/skills/generate-tests.md) seguindo **AAA + adversarial**
(regra [`60-testing`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/rules/60-testing.md)) e **queries acessíveis por papel/rótulo**
(regra `30-frontend-react`) — importante para o público idoso.

**Alvos prioritários:**

| Prioridade | Alvo | Como testar |
|---|---|---|
| 1 | `src/core/utils/` (`cn`, `formatDate`, `formatDateTime`) | Já iniciado — puro; datas inválidas, locale pt-BR. |
| 2 | `src/core/components/ui/*` (Button feito; Card, Dialog, etc.) | Render por `getByRole`/`getByText`; estados disabled/loading; handlers com `vi.fn()`. |
| 3 | `src/features/assessment/features/create-flow/screens/` (Quiz, Result) | Fluxo de seleção→resultado; navegação entre telas; render do score. |
| 4 (sensível) | `core/consts/ivcf.consts.ts` + `create-flow/context/CreateAssessmentContext.tsx` | **Cálculo IVCF-20** — ver guard-rail (§5). |

**Validação de runtime (navegador) — ver [validacoes-automaticas.md](https://github.com/lifesystemsufpr/devops-hub/blob/main/docs/processo-ia/validacoes-automaticas.md):**
- **Camada 1 (gate e2e determinístico):** specs `@playwright/test` dos fluxos centrais no CI (bloqueiam merge).
- **Camada 2 (nav-check por LLM):** skill [`nav-check`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/skills/nav-check.md) sobe
  `npm run dev` (`http://localhost:5173`) e varre as rotas reais (de `core/configs/client.routes.ts`):
  `/login`, `/register`, `/forgot-password`, `/dashboard`, `/participants`, `/ivcf/new/instructions`,
  `/ivcf/new/assessment`, `/ivcf/result/:id`, `/admin/reports`, `/profile`.
- **POC já feito:** [nav-check-ivcf-front.md](https://github.com/lifesystemsufpr/devops-hub/blob/main/docs/processo-ia/nav-check-ivcf-front.md)
  (0 erros de console; 4 achados: 404 em branco, link "esqueci senha" morto, título genérico, rótulos de form)
  → converter em backlog + asserções e2e e ligar o `nav-check.yml`.

## 3. Code review com IA

- Skill [`review-pr`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/skills/review-pr.md) + regra
  [`75-code-review`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/rules/75-code-review.md): foco em correção, **acessibilidade do
  idoso**, contrato com `auth-service`, e presença de testes.
- **Revisão humana obrigatória:** qualquer toque na **lógica de pontuação IVCF-20** →
  [`review-clinical-change`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/skills/review-clinical-change.md).

## 4. Automação / CI

- **Falta CI:** aplicar o reutilizável **`ci-node-frontend.yml`** via bootstrap do `devops-hub`
  (documentar o passo; **não executar** sem OK). Jobs: Lint / Typecheck / Unit tests / Build.
- **Gate pré-PR local:** skill [`pre-pr-gate`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/skills/pre-pr-gate.md)
  (`lint` + `build` + `test:cov`).
- A branch `test/ai-component-tests` já existe — fechar o ciclo via PR para `main` (com OK humano).

## 5. Guard-rails específicos (clínico)

- **IVCF-20 é instrumento clínico validado.** Os `IVCF_DOMAIN_MAX` (total 40) e as classificações
  (Frágil / Pré-frágil / Robusto) **não mudam sem aprovação clínica documentada**.
- Testes que tocam o score devem ser de **fronteira/rigorosos** (limites de cada domínio, soma máxima,
  transições de classificação), **sem alterar a lógica**.
- Dado de saúde/PII nunca em fixture, log ou URL.

## 6. Passo a passo "como fazer"

1. Completar `generate-tests` nos utils e componentes UI (prioridades 1–2) → validar local.
2. Avançar para o fluxo de assessment (prioridade 3).
3. Para o score IVCF-20 (prioridade 4): só **testes de fronteira**, marcando PR como `area:clinical` → revisão humana.
4. Rodar `nav-check` nas rotas; salvar relatório + screenshots para o ClickUp.
5. Documentar/abrir bootstrap do `ci-node-frontend` (com OK) para o repo ganhar CI.
6. `pre-pr-gate` → PR → `review-pr`; **merge só com OK humano**.
