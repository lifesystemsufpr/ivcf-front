import type { FormErrors, ParticipantFormValues } from "./types";

export const MIN_AGE = 60;
export const MAX_AGE = 110;
export const MIN_HEIGHT_CM = 100;
export const MAX_HEIGHT_CM = 280;
export const MIN_WEIGHT_KG = 20;
export const MAX_WEIGHT_KG = 400;

const FULL_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(\s[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;

export function parseNumber(value: string) {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function isCompleteDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function getAgeFromDate(dateString: string) {
  const birthDate = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

export function validateStepOne(values: ParticipantFormValues): FormErrors {
  const nextErrors: FormErrors = {};

  if (!values.email.trim()) {
    nextErrors.email = "Informe o email";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    nextErrors.email = "Informe um email valido";
  }

  if (!values.fullName.trim()) {
    nextErrors.fullName = "Informe o nome completo";
  } else if (!FULL_NAME_REGEX.test(values.fullName.trim())) {
    nextErrors.fullName =
      "Informe um nome valido (nome e sobrenome, sem numeros ou caracteres especiais)";
  }

  if (!values.birthDate) {
    nextErrors.birthDate = "Informe a data de nascimento";
  } else if (isCompleteDate(values.birthDate)) {
    const age = getAgeFromDate(values.birthDate);

    if (age === null || age < MIN_AGE || age > MAX_AGE) {
      nextErrors.birthDate = `A idade deve estar entre ${MIN_AGE} e ${MAX_AGE} anos`;
    }
  }

  if (!values.height.trim()) {
    nextErrors.height = "Informe a altura";
  } else if (parseNumber(values.height) < MIN_HEIGHT_CM) {
    nextErrors.height = `Altura inválida (mínima: ${MIN_HEIGHT_CM} cm)`;
  } else if (parseNumber(values.height) > MAX_HEIGHT_CM) {
    nextErrors.height = `Altura inválida (máxima: ${MAX_HEIGHT_CM} cm)`;
  }

  if (!values.weight.trim()) {
    nextErrors.weight = "Informe o peso";
  } else if (parseNumber(values.weight) < MIN_WEIGHT_KG) {
    nextErrors.weight = `Peso inválido (mínimo: ${MIN_WEIGHT_KG} kg)`;
  } else if (parseNumber(values.weight) > MAX_WEIGHT_KG) {
    nextErrors.weight = `Peso inválido (máximo: ${MAX_WEIGHT_KG} kg)`;
  }

  return nextErrors;
}

export function validateStepTwo(values: ParticipantFormValues): FormErrors {
  const nextErrors: FormErrors = {};

  if (!values.address.zipCode.trim()) {
    nextErrors["address.zipCode"] = "Informe o CEP";
  }

  if (!values.address.street.trim()) {
    nextErrors["address.street"] = "Informe a rua";
  }

  if (!values.address.number.trim()) {
    nextErrors["address.number"] = "Informe o numero";
  }

  if (!values.address.neighborhood.trim()) {
    nextErrors["address.neighborhood"] = "Informe o bairro";
  }

  if (!values.address.city.trim()) {
    nextErrors["address.city"] = "Informe a cidade";
  }

  if (!values.address.state.trim()) {
    nextErrors["address.state"] = "Informe o estado";
  }

  return nextErrors;
}

export function validateAll(values: ParticipantFormValues): FormErrors {
  return {
    ...validateStepOne(values),
    ...validateStepTwo(values),
  };
}
