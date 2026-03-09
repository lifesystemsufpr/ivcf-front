import {
  IVCF_SECTIONS,
  ivcfQuestions,
} from "../features/create-flow/questions";
import type { Answer, AssessmentResponse } from "../types";

interface GroupNode {
  id: string;
  label: string;
  total: number;
  rawTotal: number;
  answers: Answer[];
  subgroups: GroupNode[];
}

const SECTION_ORDER = [
  IVCF_SECTIONS.AGE.id,
  IVCF_SECTIONS.SELF_PERCEPTION.id,
  IVCF_SECTIONS.ADL.id,
  IVCF_SECTIONS.COGNITION.id,
  IVCF_SECTIONS.MOOD.id,
  IVCF_SECTIONS.MOBILITY.id,
  IVCF_SECTIONS.COMMUNICATION.id,
  IVCF_SECTIONS.COMORBIDITIES.id,
];

const subgroupCaps: Record<string, number> = {
  [IVCF_SECTIONS.ADL.subgroups.INSTRUMENTAL.id]: 4,
};

const groupCaps: Record<string, number> = {
  [IVCF_SECTIONS.MOBILITY.id]: 2,
};

function getSectionLabel(sectionId: string | undefined | null) {
  if (!sectionId) return "Outros";
  const match = Object.values(IVCF_SECTIONS).find(
    (section: any) => section.id === sectionId,
  );
  return match?.label ?? "Outros";
}

function getSubLabel(
  sectionId: string | undefined | null,
  subId: string | undefined | null,
) {
  if (!sectionId || !subId) return null;
  const section = Object.values(IVCF_SECTIONS).find(
    (s: any) => s.id === sectionId,
  ) as any;
  if (!section?.subgroups) return null;
  const sub = Object.values(section.subgroups).find(
    (sg: any) => sg.id === subId,
  ) as any;
  return sub?.label ?? null;
}

const questionMapByOrder = new Map(ivcfQuestions.map((q) => [q.order, q]));

export function buildGroupedTree(assessment: AssessmentResponse): GroupNode[] {
  const groups = new Map<string, GroupNode>();

  const ensureGroup = (id: string, label: string): GroupNode => {
    const existing = groups.get(id);
    if (existing) return existing;
    const node: GroupNode = {
      id,
      label,
      total: 0,
      rawTotal: 0,
      answers: [],
      subgroups: [],
    };
    groups.set(id, node);
    return node;
  };

  assessment.answers.forEach((answer) => {
    // Use order to map to the correct local question metadata
    const meta = questionMapByOrder.get(answer.question.order);
    const sectionId = meta?.groupId ?? "ungrouped";
    const subId = meta?.subGroupId ?? null;
    const sectionLabel = getSectionLabel(sectionId);
    const subgroupLabel = getSubLabel(sectionId, subId);

    const group = ensureGroup(sectionId, sectionLabel);

    if (subId && subgroupLabel) {
      let subgroup = group.subgroups.find((sg) => sg.id === subId);
      if (!subgroup) {
        subgroup = {
          id: subId,
          label: subgroupLabel,
          total: 0,
          rawTotal: 0,
          answers: [],
          subgroups: [],
        };
        group.subgroups.push(subgroup);
      }
      subgroup.answers.push(answer);
    } else {
      group.answers.push(answer);
    }
  });

  // compute totals with caps
  groups.forEach((group) => {
    group.subgroups.forEach((sub) => {
      const subtotal = sub.answers.reduce(
        (sum, ans) => sum + (ans.selectedOption?.score ?? 0),
        0,
      );
      sub.rawTotal = subtotal;
      sub.total = Math.min(subtotal, subgroupCaps[sub.id] ?? subtotal);
    });

    const directTotal = group.answers.reduce(
      (sum, ans) => sum + (ans.selectedOption?.score ?? 0),
      0,
    );

    const subgroupsTotal = group.subgroups.reduce(
      (sum, sg) => sum + sg.total,
      0,
    );
    const rawSubgroupsTotal = group.subgroups.reduce(
      (sum, sg) => sum + sg.rawTotal,
      0,
    );

    const rawTotal = directTotal + rawSubgroupsTotal;
    const uncappedTotal = directTotal + subgroupsTotal;
    group.rawTotal = rawTotal;
    group.total = Math.min(uncappedTotal, groupCaps[group.id] ?? uncappedTotal);
  });

  // order groups using SECTION_ORDER
  const ordered = Array.from(groups.values()).sort((a, b) => {
    const ia = SECTION_ORDER.indexOf(a.id);
    const ib = SECTION_ORDER.indexOf(b.id);
    if (ia === -1 && ib === -1) return a.label.localeCompare(b.label);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  ordered.forEach((g) => {
    g.subgroups.sort((a, b) => a.label.localeCompare(b.label));
  });

  return ordered;
}
