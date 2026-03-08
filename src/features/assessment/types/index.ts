export type FrailtyClassification = "Robusto" | "Pré-frágil" | "Frágil";

export type QuestionType = "MULTIPLE_CHOICE" | "TEXT" | "NUMBER";

export interface Assessment {
  id: string;
  date: string;
  totalScore: number;
  classification: FrailtyClassification;
  participantId: string;
  participantName: string;
}

export interface SelectedOption {
  id: string;
  label: string;
  score: number;
  order: number;
  questionId: string;
}

export interface Question {
  id: string;
  statement: string;
  order: number;
  type: QuestionType;
  required: boolean;
  groupId: string | null;
  subGroupId: string | null;
}

export interface Answer {
  id: string;
  questionnaireResponseId: string;
  questionId: string;
  selectedOptionId: string;
  valueText: string | null;
  question: Question;
  selectedOption: SelectedOption;
}

export interface AssessmentResponse {
  id: string;
  totalScore: number;
  classification: FrailtyClassification;
  date: string;
  participantId: string;
  participantName?: string;
  questionnaireId: string;
  createdAt: string;
  updatedAt: string;
  answers: Answer[];
  participant?: {
    user: {
      fullName: string;
    };
  };
  healthProfessionalId?: string;
  healthcareUnitId?: string;
}

export interface QuestionnaireListItem {
  id: string;
  date: string;
  totalScore: number;
  classification: FrailtyClassification;
  questionnaireTitle: string;
  questionnaireSlug: string;
  participantId: string;
  participantName: string;
  healthProfessionalId: string;
  healthProfessionalName: string;
  healthProfessionalSpeciality: string;
}
