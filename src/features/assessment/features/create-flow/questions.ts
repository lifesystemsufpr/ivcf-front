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
      { id: "q1o1", label: "Menos de 70 anos", score: 0 },
      { id: "q1o2", label: "Entre 70 e 79 anos", score: 1 },
      { id: "q1o3", label: "80 anos ou mais", score: 2 },
    ],
  },
  {
    id: "q2",
    order: 2,
    statement: "Precisa de ajuda para atividades básicas (banho, vestir)?",
    required: true,
    options: [
      { id: "q2o1", label: "Não preciso de ajuda", score: 0 },
      { id: "q2o2", label: "Preciso de ajuda parcial", score: 1 },
      { id: "q2o3", label: "Preciso de ajuda para tudo", score: 2 },
    ],
  },
  {
    id: "q3",
    order: 3,
    statement: "Tem cuidador principal?",
    required: true,
    options: [
      { id: "q3o1", label: "Não tenho cuidador", score: 0 },
      { id: "q3o2", label: "Tenho cuidador eventual", score: 1 },
      { id: "q3o3", label: "Tenho cuidador diário", score: 2 },
    ],
  },
  {
    id: "q4",
    order: 4,
    statement: "Teve perda de peso não intencional nos últimos 6 meses?",
    required: true,
    options: [
      { id: "q4o1", label: "Não", score: 0 },
      { id: "q4o2", label: "Perdi até 5 kg", score: 1 },
      { id: "q4o3", label: "Perdi mais de 5 kg", score: 2 },
    ],
  },
  {
    id: "q5",
    order: 5,
    statement: "Como avalia a sua memória no dia a dia?",
    required: true,
    options: [
      { id: "q5o1", label: "Boa, não esqueço compromissos", score: 0 },
      { id: "q5o2", label: "Alguns esquecimentos leves", score: 1 },
      { id: "q5o3", label: "Esqueço frequentemente ou dependo de ajuda", score: 2 },
    ],
  },
  {
    id: "q6",
    order: 6,
    statement: "Apresenta humor deprimido ou falta de interesse?",
    required: true,
    options: [
      { id: "q6o1", label: "Não", score: 0 },
      { id: "q6o2", label: "Às vezes", score: 1 },
      { id: "q6o3", label: "Com frequência", score: 2 },
    ],
  },
  {
    id: "q7",
    order: 7,
    statement: "Teve quedas no último ano?",
    required: true,
    options: [
      { id: "q7o1", label: "Nenhuma queda", score: 0 },
      { id: "q7o2", label: "1 queda", score: 1 },
      { id: "q7o3", label: "2 ou mais quedas", score: 2 },
    ],
  },
  {
    id: "q8",
    order: 8,
    statement: "Consegue sair de casa e caminhar uma quadra?",
    required: true,
    options: [
      { id: "q8o1", label: "Sem dificuldade", score: 0 },
      { id: "q8o2", label: "Com alguma dificuldade", score: 1 },
      { id: "q8o3", label: "Não consigo sem ajuda", score: 2 },
    ],
  },
  {
    id: "q9",
    order: 9,
    statement: "Usa cinco ou mais medicamentos diariamente?",
    required: true,
    options: [
      { id: "q9o1", label: "Não", score: 0 },
      { id: "q9o2", label: "Sim, exatamente cinco", score: 1 },
      { id: "q9o3", label: "Sim, mais de cinco", score: 2 },
    ],
  },
  {
    id: "q10",
    order: 10,
    statement: "Precisa de ajuda para lidar com dinheiro e contas?",
    required: true,
    options: [
      { id: "q10o1", label: "Não preciso", score: 0 },
      { id: "q10o2", label: "Às vezes preciso", score: 1 },
      { id: "q10o3", label: "Sempre preciso", score: 2 },
    ],
  },
  {
    id: "q11",
    order: 11,
    statement: "Consegue subir um lance de escadas?",
    required: true,
    options: [
      { id: "q11o1", label: "Sem apoio", score: 0 },
      { id: "q11o2", label: "Com apoio ou corrimão", score: 1 },
      { id: "q11o3", label: "Não consigo", score: 2 },
    ],
  },
  {
    id: "q12",
    order: 12,
    statement: "Tem incontinência urinária ou fecal?",
    required: true,
    options: [
      { id: "q12o1", label: "Não", score: 0 },
      { id: "q12o2", label: "Ocasional", score: 1 },
      { id: "q12o3", label: "Frequente", score: 2 },
    ],
  },
  {
    id: "q13",
    order: 13,
    statement: "Dormiu mal ou acordou cansado na última semana?",
    required: true,
    options: [
      { id: "q13o1", label: "Quase nunca", score: 0 },
      { id: "q13o2", label: "Algumas noites", score: 1 },
      { id: "q13o3", label: "Quase todas as noites", score: 2 },
    ],
  },
  {
    id: "q14",
    order: 14,
    statement: "Tem visão que atrapalha atividades diárias?",
    required: true,
    options: [
      { id: "q14o1", label: "Vejo bem", score: 0 },
      { id: "q14o2", label: "Alguma dificuldade", score: 1 },
      { id: "q14o3", label: "Muita dificuldade", score: 2 },
    ],
  },
  {
    id: "q15",
    order: 15,
    statement: "Tem audição que atrapalha conversas?",
    required: true,
    options: [
      { id: "q15o1", label: "Ouço bem", score: 0 },
      { id: "q15o2", label: "Preciso de repetição às vezes", score: 1 },
      { id: "q15o3", label: "Quase sempre peço para repetir", score: 2 },
    ],
  },
  {
    id: "q16",
    order: 16,
    statement: "Sente falta de companhia ou apoio social?",
    required: true,
    options: [
      { id: "q16o1", label: "Tenho boa rede de apoio", score: 0 },
      { id: "q16o2", label: "Rede moderada", score: 1 },
      { id: "q16o3", label: "Me sinto só ou sem apoio", score: 2 },
    ],
  },
  {
    id: "q17",
    order: 17,
    statement: "Consegue preparar suas refeições?",
    required: true,
    options: [
      { id: "q17o1", label: "Sim, sozinho", score: 0 },
      { id: "q17o2", label: "Com alguma ajuda", score: 1 },
      { id: "q17o3", label: "Não consigo preparar", score: 2 },
    ],
  },
  {
    id: "q18",
    order: 18,
    statement: "Tem doenças crônicas descompensadas (ex.: cardiopatia)?",
    required: true,
    options: [
      { id: "q18o1", label: "Não", score: 0 },
      { id: "q18o2", label: "Sim, controladas", score: 1 },
      { id: "q18o3", label: "Sim, descompensadas", score: 2 },
    ],
  },
  {
    id: "q19",
    order: 19,
    statement: "Teve internação hospitalar nos últimos 6 meses?",
    required: true,
    options: [
      { id: "q19o1", label: "Não", score: 0 },
      { id: "q19o2", label: "1 internação", score: 1 },
      { id: "q19o3", label: "2 ou mais internações", score: 2 },
    ],
  },
  {
    id: "q20",
    order: 20,
    statement: "Como avalia sua saúde em geral?",
    required: true,
    options: [
      { id: "q20o1", label: "Excelente ou muito boa", score: 0 },
      { id: "q20o2", label: "Regular", score: 1 },
      { id: "q20o3", label: "Ruim", score: 2 },
    ],
  },
];
