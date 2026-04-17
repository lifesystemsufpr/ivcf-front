import type { Answer, AssessmentResponse, Question } from "../types";

export interface QuestionPresentationNode {
  question: Question;
  answers: Answer[];
  totalScore: number;
}

export interface GroupNode {
  id: string;
  label: string;
  total: number;
  rawTotal: number;
  questions: QuestionPresentationNode[];
  subgroups: GroupNode[];
}

// Statically structure domains specifically for presentation,
// decoupled from form creation components to minimize frontend dependency when plotting responses
const SECTIONS = {
  IDADE: { id: "sec_idade", label: "Idade" },
  PERCEPCAO: { id: "sec_percep", label: "Auto-percepção da Saúde" },
  AVD: { id: "sec_avd", label: "Atividades de Vida Diária" },
  COGNICAO: { id: "sec_cog", label: "Cognição" },
  HUMOR: { id: "sec_humor", label: "Humor" },
  MOBILIDADE: { id: "sec_mob", label: "Mobilidade" },
  ESFINCT: { id: "sec_esfinct", label: "Continência Esfincteriana" },
  COMUNICACAO: { id: "sec_comun", label: "Comunicação" },
  COMORB: { id: "sec_comorb", label: "Comorbidades Múltiplas" },
};

const SUBSECTIONS = {
  AVD_INST: { id: "sub_avd_inst", label: "AVD Instrumental" },
  AVD_BASICA: { id: "sub_avd_basica", label: "AVD Básica" },
  MOB_ALCANCE: { id: "sub_mob_alcance", label: "Alcance, preensão e pinça" },
  MOB_AEROBICA: {
    id: "sub_mob_aerobica",
    label: "Capacidade aeróbica e/ou muscular",
  },
  MOB_MARCHA: { id: "sub_mob_marcha", label: "Marcha" },
  MOB_ESFINCT: { id: "sub_mob_esfinct", label: "Continência Esfincteriana" },
  COMUN_VISAO: { id: "sub_comun_visao", label: "Visão" },
  COMUN_AUD: { id: "sub_comun_aud", label: "Audição" },
};

const ORDER_MAP: Record<
  number,
  {
    section: { id: string; label: string };
    subSection?: { id: string; label: string };
  }
> = {
  1: { section: SECTIONS.IDADE },
  2: { section: SECTIONS.PERCEPCAO },
  3: { section: SECTIONS.AVD, subSection: SUBSECTIONS.AVD_INST },
  4: { section: SECTIONS.AVD, subSection: SUBSECTIONS.AVD_INST },
  5: { section: SECTIONS.AVD, subSection: SUBSECTIONS.AVD_INST },
  6: { section: SECTIONS.AVD, subSection: SUBSECTIONS.AVD_BASICA },
  7: { section: SECTIONS.COGNICAO },
  8: { section: SECTIONS.COGNICAO },
  9: { section: SECTIONS.COGNICAO },
  10: { section: SECTIONS.HUMOR },
  11: { section: SECTIONS.HUMOR },
  12: { section: SECTIONS.MOBILIDADE, subSection: SUBSECTIONS.MOB_ALCANCE },
  13: { section: SECTIONS.MOBILIDADE, subSection: SUBSECTIONS.MOB_ALCANCE },
  14: { section: SECTIONS.MOBILIDADE, subSection: SUBSECTIONS.MOB_AEROBICA },
  15: { section: SECTIONS.MOBILIDADE, subSection: SUBSECTIONS.MOB_MARCHA },
  16: { section: SECTIONS.MOBILIDADE, subSection: SUBSECTIONS.MOB_MARCHA },
  17: { section: SECTIONS.MOBILIDADE, subSection: SUBSECTIONS.MOB_ESFINCT },
  18: { section: SECTIONS.COMUNICACAO, subSection: SUBSECTIONS.COMUN_VISAO },
  19: { section: SECTIONS.COMUNICACAO, subSection: SUBSECTIONS.COMUN_AUD },
  20: { section: SECTIONS.COMORB },
};

const SECTION_ORDER = Object.values(SECTIONS).map((s) => s.id);

const subgroupCaps: Record<string, number> = {
  [SUBSECTIONS.AVD_INST.id]: 4,
  [SUBSECTIONS.MOB_AEROBICA.id]: 2, // Q14 max 2 points
};

const groupCaps: Record<string, number> = {
  [SECTIONS.COMORB.id]: 4, // Q20 max 4 points
};

export function buildGroupedTree(assessment: AssessmentResponse): GroupNode[] {
  const groups = new Map<string, GroupNode>();

  const ensureGroup = (id: string, label: string): GroupNode => {
    let existing = groups.get(id);
    if (!existing) {
      existing = {
        id,
        label,
        total: 0,
        rawTotal: 0,
        questions: [],
        subgroups: [],
      };
      groups.set(id, existing);
    }
    return existing;
  };

  const getQuestionNode = (
    container: GroupNode,
    question: Question,
  ): QuestionPresentationNode => {
    let qNode = container.questions.find((q) => q.question.id === question.id);
    if (!qNode) {
      qNode = { question, answers: [], totalScore: 0 };
      container.questions.push(qNode);
    }
    return qNode;
  };

  assessment.answers.forEach((answer) => {
    const order = answer.question.order;
    const mapping = ORDER_MAP[order] || {
      section: { id: "outros", label: "Outros" },
    };

    const group = ensureGroup(mapping.section.id, mapping.section.label);

    if (mapping.subSection) {
      let subgroup = group.subgroups.find(
        (sg) => sg.id === mapping.subSection!.id,
      );
      if (!subgroup) {
        subgroup = {
          id: mapping.subSection!.id,
          label: mapping.subSection!.label,
          total: 0,
          rawTotal: 0,
          questions: [],
          subgroups: [],
        };
        group.subgroups.push(subgroup);
      }
      const qNode = getQuestionNode(subgroup, answer.question);
      qNode.answers.push(answer);
      qNode.totalScore += answer.selectedOption?.score ?? 0;
    } else {
      const qNode = getQuestionNode(group, answer.question);
      qNode.answers.push(answer);
      qNode.totalScore += answer.selectedOption?.score ?? 0;
    }
  });

  // Calculate totals and apply caps
  groups.forEach((group) => {
    let rawSubgroupsTotal = 0;
    let subgroupsTotal = 0;

    group.subgroups.forEach((sub) => {
      let subRaw = 0;
      sub.questions.forEach((q) => {
        subRaw += q.totalScore;
      });
      sub.rawTotal = subRaw;
      sub.total = Math.min(subRaw, subgroupCaps[sub.id] ?? subRaw);
      rawSubgroupsTotal += sub.rawTotal;
      subgroupsTotal += sub.total;
    });

    let directRaw = 0;
    group.questions.forEach((q) => {
      directRaw += q.totalScore;
    });

    group.rawTotal = directRaw + rawSubgroupsTotal;
    const uncappedTotal = directRaw + subgroupsTotal;
    group.total = Math.min(uncappedTotal, groupCaps[group.id] ?? uncappedTotal);

    // Sort questions inside groups/subgroups by order
    group.questions.sort((a, b) => a.question.order - b.question.order);
    group.subgroups.forEach((sg) => {
      sg.questions.sort((a, b) => a.question.order - b.question.order);
    });
  });

  // Sort groups based on definition order
  const ordered = Array.from(groups.values()).sort((a, b) => {
    const ia = SECTION_ORDER.indexOf(a.id);
    const ib = SECTION_ORDER.indexOf(b.id);
    if (ia === -1 && ib === -1) return a.label.localeCompare(b.label);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return ordered;
}
