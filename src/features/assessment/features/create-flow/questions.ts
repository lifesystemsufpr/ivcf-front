export interface IvcfOption {
  id: string;
  label: string;
  score: number;
}

export interface IvcfQuestion {
  id: string;
  order: number;
  statement: string;
  required: boolean;
  options: IvcfOption[];
}

export const IVCF_TOTAL_QUESTIONS = 20;

export const ivcfQuestions: IvcfQuestion[] = [
  {
    id: "q1",
    order: 1,
    statement: "Qual é a sua idade?",
    required: true,
    options: [
      { id: "q1o1", label: "60 a 74 anos", score: 0 },
      { id: "q1o2", label: "75 a 84 anos", score: 1 },
      { id: "q1o3", label: "≥ 85 anos", score: 3 },
    ],
  },
  {
    id: "q2",
    order: 2,
    statement:
      "Em geral, comparando com outras pessoas de sua idade, você diria que sua saúde é:",
    required: true,
    options: [
      { id: "q2o1", label: "Excelente, muito boa ou boa", score: 0 },
      { id: "q2o2", label: "Regular ou ruim", score: 1 },
    ],
  },
  {
    id: "q3",
    order: 3,
    statement:
      "Por causa de sua saúde ou condição física, você deixou de fazer compras?",
    required: true,
    options: [
      { id: "q3o1", label: "Sim", score: 4 },
      {
        id: "q3o2",
        label: "Não ou não faz compras por outros motivos que não a saúde",
        score: 0,
      },
    ],
  },
  {
    id: "q4",
    order: 4,
    statement:
      "Por causa de sua saúde ou condição física, você deixou de controlar seu dinheiro, gastos ou pagar as contas de sua casa?",
    required: true,
    options: [
      { id: "q4o1", label: "Sim", score: 4 },
      {
        id: "q4o2",
        label:
          "Não ou não controla o dinheiro por outros motivos que não a saúde",
        score: 0,
      },
    ],
  },
  {
    id: "q5",
    order: 5,
    statement:
      "Por causa de sua saúde ou condição física, você deixou de realizar pequenos trabalhos domésticos, como lavar louça, arrumar a casa ou fazer limpeza leve?",
    required: true,
    options: [
      { id: "q5o1", label: "Sim", score: 4 },
      {
        id: "q5o2",
        label:
          "Não ou não faz mais pequenos trabalhos domésticos por outros motivos que não a saúde",
        score: 0,
      },
    ],
  },
  {
    id: "q6",
    order: 6,
    statement:
      "Por causa de sua saúde ou condição física, você deixou de tomar banho sozinho?",
    required: true,
    options: [
      { id: "q6o1", label: "Sim", score: 6 },
      { id: "q6o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q7",
    order: 7,
    statement: "Algum familiar ou amigo falou que você está ficando esquecido?",
    required: true,
    options: [
      { id: "q7o1", label: "Sim", score: 1 },
      { id: "q7o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q8",
    order: 8,
    statement: "Este esquecimento está piorando nos últimos meses?",
    required: true,
    options: [
      { id: "q8o1", label: "Sim", score: 1 },
      { id: "q8o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q9",
    order: 9,
    statement:
      "Este esquecimento está impedindo a realização de alguma atividade do cotidiano?",
    required: true,
    options: [
      { id: "q9o1", label: "Sim", score: 2 },
      { id: "q9o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q10",
    order: 10,
    statement:
      "No último mês, você ficou com desânimo, tristeza ou desesperança?",
    required: true,
    options: [
      { id: "q10o1", label: "Sim", score: 2 },
      { id: "q10o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q11",
    order: 11,
    statement:
      "No último mês, você perdeu o interesse ou prazer em atividades anteriormente prazerosas?",
    required: true,
    options: [
      { id: "q11o1", label: "Sim", score: 2 },
      { id: "q11o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q12",
    order: 12,
    statement: "Você é incapaz de elevar os braços acima do nível do ombro?",
    required: true,
    options: [
      { id: "q12o1", label: "Sim", score: 1 },
      { id: "q12o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q13",
    order: 13,
    statement: "Você é incapaz de manusear ou segurar pequenos objetos?",
    required: true,
    options: [
      { id: "q13o1", label: "Sim", score: 1 },
      { id: "q13o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q14",
    order: 14,
    statement:
      "Você tem alguma das quatro condições: Perda de peso não intencional; IMC < 22kg/m²; Circunferência da panturrilha < 31cm; ou Velocidade da marcha > 5 segundos?",
    required: true,
    options: [
      { id: "q14o1", label: "Sim", score: 2 },
      { id: "q14o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q15",
    order: 15,
    statement:
      "Você tem dificuldade para caminhar capaz de impedir a realização de alguma atividade do cotidiano?",
    required: true,
    options: [
      { id: "q15o1", label: "Sim", score: 2 },
      { id: "q15o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q16",
    order: 16,
    statement: "Você teve duas ou mais quedas no último ano?",
    required: true,
    options: [
      { id: "q16o1", label: "Sim", score: 2 },
      { id: "q16o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q17",
    order: 17,
    statement: "Você perde urina ou fezes, sem querer, em algum momento?",
    required: true,
    options: [
      { id: "q17o1", label: "Sim", score: 2 },
      { id: "q17o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q18",
    order: 18,
    statement:
      "Você tem problemas de visão capazes de impedir a realização de alguma atividade do cotidiano? (É permitido o uso de óculos ou lentes)",
    required: true,
    options: [
      { id: "q18o1", label: "Sim", score: 2 },
      { id: "q18o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q19",
    order: 19,
    statement:
      "Você tem problemas de audição capazes de impedir a realização de alguma atividade do cotidiano? (É permitido o uso de aparelhos)",
    required: true,
    options: [
      { id: "q19o1", label: "Sim", score: 2 },
      { id: "q19o2", label: "Não", score: 0 },
    ],
  },
  {
    id: "q20",
    order: 20,
    statement:
      "Você tem alguma das três condições: Cinco ou mais doenças crônicas; Uso regular de cinco ou mais medicamentos; ou Internação recente (últimos 6 meses)?",
    required: true,
    options: [
      { id: "q20o1", label: "Sim", score: 4 },
      { id: "q20o2", label: "Não", score: 0 },
    ],
  },
];
