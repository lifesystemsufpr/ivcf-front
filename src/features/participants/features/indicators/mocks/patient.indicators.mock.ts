import type { PatientEvolutionData } from "../types";

export const MOCK_EVOLUTION_DATA: PatientEvolutionData = {
  patientId: "part-001",
  patientName: "João Lucas",
  assessments: [
    {
      id: "eval-1",
      date: "2023-05-15T10:00:00Z",
      totalScore: 5,
      riskLevel: "Robusto",
      domains: {
        age: 1,
        selfPerception: 1,
        functionalCapacity: 0,
        cognition: 0,
        mood: 1,
        mobility: 1,
        communication: 0,
        comorbidities: 1,
      },
      rawResponses: { q1: "Sim", q2: "Não" /* ... */ },
    },
    {
      id: "eval-2",
      date: "2023-11-20T14:30:00Z",
      totalScore: 12,
      riskLevel: "Pre-Fragil",
      domains: {
        age: 2,
        selfPerception: 3,
        functionalCapacity: 1,
        cognition: 1,
        mood: 2,
        mobility: 1,
        communication: 0,
        comorbidities: 2,
      },
      rawResponses: { q1: "Não", q2: "Sim" /* ... */ },
    },
    {
      id: "eval-3",
      date: "2024-05-10T09:15:00Z",
      totalScore: 18,
      riskLevel: "Fragil",
      domains: {
        age: 2,
        selfPerception: 4,
        functionalCapacity: 3,
        cognition: 2,
        mood: 2,
        mobility: 2,
        communication: 1,
        comorbidities: 2,
      },
      rawResponses: { q1: "Não", q2: "Não" /* ... */ },
    },
  ],
};
