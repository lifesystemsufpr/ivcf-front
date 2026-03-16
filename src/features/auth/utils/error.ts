export const errorMap: { [key: string]: string } = {
  "user.gender should not be empty": "O gênero é obrigatório",
  "user.gender must be one of the following values: MALE, FEMALE, OTHER":
    "O gênero deve ser Masculino, Feminino ou Outro",
};

export function getErrorMessage(error: any) {
  console.error("Error details:", error?.message?.[0]); // Log completo do erro para depuração
  const messageError = (error?.message?.[0] as string) || "";

  if (errorMap[messageError]) {
    return errorMap[messageError];
  }
  return "";
}
