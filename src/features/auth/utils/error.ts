export const errorMap: { [key: string]: string } = {
  "user.gender should not be empty": "O gênero é obrigatório",
  "user.gender must be one of the following values: MALE, FEMALE, OTHER":
    "O gênero deve ser Masculino, Feminino ou Outro",
  "O e-mail fornecido já está em uso.": "O e-mail já está em uso.",
  "email must be an email": "O e-mail deve ser válido",
};

export function getErrorMessage(error: any) {
  const messageError = (error?.message as string) || "";

  if (errorMap[messageError]) {
    return errorMap[messageError];
  }
  return "";
}
