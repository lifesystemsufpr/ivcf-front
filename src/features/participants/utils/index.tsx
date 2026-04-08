import type { Participant, ParticipantResponse } from "../types";

export const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const formatGender = (gender: string) => {
  const genderMap: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Feminino",
    OTHER: "Outro",
  };
  return genderMap[gender] || gender;
};

export const calculateIMC = (weight: number, height: number) => {
  const imc = weight / (height * height);
  return imc.toFixed(1);
};

export const getIMCClassification = (imc: number) => {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  if (imc < 35) return "Obesidade Grau I";
  if (imc < 40) return "Obesidade Grau II";
  return "Obesidade Grau III";
};

export function parseParticipantResponse(
  data: ParticipantResponse,
): Participant {
  return {
    id: data.id,
    fullName: data.fullName,
    birthDate: data.birthday,
    email: data.email,
    gender: data.gender,
    height: Number(data.height),
    weight: Number(data.weight),
    address: {
      city: data.city,
      state: data.state,
      street: data.street,
      number: data.number,
      complement: data.complement,
      zipCode: data.zipCode,
      neighborhood: data.neighborhood,
    },
  };
}

export const mapStateToUF = (state: string) => {
  const statesMap: Record<string, string> = {
    Acre: "AC",
    Alagoas: "AL",
    Amapá: "AP",
    Amazonas: "AM",
    Bahia: "BA",
    Ceará: "CE",
    "Distrito Federal": "DF",
    "Espírito Santo": "ES",
    Goiás: "GO",
    Maranhão: "MA",
    "Mato Grosso": "MT",
    "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG",
    Pará: "PA",
    Paraíba: "PB",
    Paraná: "PR",
    Pernambuco: "PE",
    Piauí: "PI",
    "Rio de Janeiro": "RJ",
    "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS",
    Rondônia: "RO",
    Roraima: "RR",
    "Santa Catarina": "SC",
    "São Paulo": "SP",
    Sergipe: "SE",
    Tocantins: "TO",
  };
  return statesMap[state] || state;
};
