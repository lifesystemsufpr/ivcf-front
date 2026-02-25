import type { DrilldownNode } from "../types";

/**
 * Constrói a estrutura de drill-down respeitando fielmente a hierarquia
 * de Domínios, Subdomínios e Questões do PDF IVCF-20.
 */
export function buildDrilldown(total: number): DrilldownNode[] {
  const calc = (pct: number) => Math.round(total * pct);

  return [
    // 1️⃣ IDADE
    {
      id: "dominio_idade",
      label: "Idade",
      counts: { sim: calc(0.35), nao: total - calc(0.35) },
      children: [
        {
          id: "q1",
          label: "Q1 – Idade igual ou superior a 75 anos",
          counts: { sim: calc(0.35), nao: total - calc(0.35) },
        },
      ],
    },

    // 2️⃣ AUTO-PERCEPÇÃO DA SAÚDE
    {
      id: "dominio_autopercepcao",
      label: "Auto-percepção da Saúde",
      counts: { sim: calc(0.25), nao: total - calc(0.25) },
      children: [
        {
          id: "q2",
          label: "Q2 – Saúde regular ou ruim (comparada a outros)",
          counts: { sim: calc(0.25), nao: total - calc(0.25) },
        },
      ],
    },

    // 3️⃣ ATIVIDADES DE VIDA DIÁRIA (AVD)
    {
      id: "dominio_avd",
      label: "Atividades de Vida Diária",
      counts: { sim: calc(0.42), nao: total - calc(0.42) },
      children: [
        {
          id: "sub_avd_instrumental",
          label: "AVD Instrumental",
          counts: { sim: calc(0.38), nao: total - calc(0.38) },
          children: [
            {
              id: "q3",
              label: "Q3 – Deixou de fazer compras",
              counts: { sim: calc(0.28), nao: total - calc(0.28) },
            },
            {
              id: "q4",
              label: "Q4 – Deixou de controlar dinheiro/contas",
              counts: { sim: calc(0.15), nao: total - calc(0.15) },
            },
            {
              id: "q5",
              label: "Q5 – Deixou de fazer limpeza leve",
              counts: { sim: calc(0.32), nao: total - calc(0.32) },
            },
          ],
        },
        {
          id: "sub_avd_basica",
          label: "AVD Básica",
          counts: { sim: calc(0.12), nao: total - calc(0.12) },
          children: [
            {
              id: "q6",
              label: "Q6 – Deixou de tomar banho sozinho",
              counts: { sim: calc(0.12), nao: total - calc(0.12) },
            },
          ],
        },
      ],
    },

    // 4️⃣ COGNIÇÃO
    {
      id: "dominio_cognicao",
      label: "Cognição",
      counts: { sim: calc(0.3), nao: total - calc(0.3) },
      children: [
        {
          id: "q7",
          label: "Q7 – Relato de esquecimento",
          counts: { sim: calc(0.3), nao: total - calc(0.3) },
        },
        {
          id: "q8",
          label: "Q8 – Esquecimento piorando",
          counts: { sim: calc(0.18), nao: total - calc(0.18) },
        },
        {
          id: "q9",
          label: "Q9 – Esquecimento impede atividades",
          counts: { sim: calc(0.12), nao: total - calc(0.12) },
        },
      ],
    },

    // 5️⃣ HUMOR
    {
      id: "dominio_humor",
      label: "Humor",
      counts: { sim: calc(0.28), nao: total - calc(0.28) },
      children: [
        {
          id: "q10",
          label: "Q10 – Desânimo, tristeza ou desesperança",
          counts: { sim: calc(0.25), nao: total - calc(0.25) },
        },
        {
          id: "q11",
          label: "Q11 – Perda de interesse ou prazer",
          counts: { sim: calc(0.22), nao: total - calc(0.22) },
        },
      ],
    },

    // 6️⃣ MOBILIDADE
    {
      id: "dominio_mobilidade",
      label: "Mobilidade",
      counts: { sim: calc(0.5), nao: total - calc(0.5) },
      children: [
        {
          id: "sub_alcance",
          label: "Alcance, Preensão e Pinça",
          counts: { sim: calc(0.22), nao: total - calc(0.22) },
          children: [
            {
              id: "q12",
              label: "Q12 – Incapaz de elevar braços (ombro)",
              counts: { sim: calc(0.18), nao: total - calc(0.18) },
            },
            {
              id: "q13",
              label: "Q13 – Incapaz de manusear pequenos objetos",
              counts: { sim: calc(0.1), nao: total - calc(0.1) },
            },
          ],
        },
        {
          id: "sub_aerobica",
          label: "Capacidade Aeróbica e Força",
          counts: { sim: calc(0.3), nao: total - calc(0.3) },
          children: [
            {
              id: "q14",
              label: "Q14 – Perda peso / IMC baixo / Marcha lenta",
              counts: { sim: calc(0.3), nao: total - calc(0.3) },
            },
          ],
        },
        {
          id: "sub_marcha",
          label: "Marcha",
          counts: { sim: calc(0.35), nao: total - calc(0.35) },
          children: [
            {
              id: "q15",
              label: "Q15 – Dificuldade de caminhar (cotidiano)",
              counts: { sim: calc(0.28), nao: total - calc(0.28) },
            },
            {
              id: "q16",
              label: "Q16 – Duas ou mais quedas no último ano",
              counts: { sim: calc(0.2), nao: total - calc(0.2) },
            },
          ],
        },
      ],
    },

    // 7️⃣ CONTINÊNCIA ESFINCTERIANA
    {
      id: "dominio_continencia",
      label: "Continência Esfincteriana",
      counts: { sim: calc(0.24), nao: total - calc(0.24) },
      children: [
        {
          id: "q17",
          label: "Q17 – Perda involuntária de urina ou fezes",
          counts: { sim: calc(0.24), nao: total - calc(0.24) },
        },
      ],
    },

    // 8️⃣ COMUNICAÇÃO
    {
      id: "dominio_comunicacao",
      label: "Comunicação",
      counts: { sim: calc(0.32), nao: total - calc(0.32) },
      children: [
        {
          id: "sub_visao",
          label: "Visão",
          counts: { sim: calc(0.26), nao: total - calc(0.26) },
          children: [
            {
              id: "q18",
              label: "Q18 – Problemas de visão (impede atividades)",
              counts: { sim: calc(0.26), nao: total - calc(0.26) },
            },
          ],
        },
        {
          id: "sub_audicao",
          label: "Audição",
          counts: { sim: calc(0.15), nao: total - calc(0.15) },
          children: [
            {
              id: "q19",
              label: "Q19 – Problemas de audição (impede atividades)",
              counts: { sim: calc(0.15), nao: total - calc(0.15) },
            },
          ],
        },
      ],
    },

    // 9️⃣ COMORBIDADES MÚLTIPLAS
    {
      id: "dominio_comorbidades",
      label: "Comorbidades Múltiplas",
      counts: { sim: calc(0.55), nao: total - calc(0.55) },
      children: [
        {
          id: "q20",
          label: "Q20 – Polipatologia / Polifarmácia / Internação",
          counts: { sim: calc(0.55), nao: total - calc(0.55) },
        },
      ],
    },
  ];
}
