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
