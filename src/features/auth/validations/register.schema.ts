import { FULL_NAME_REGEX, OCCUPATION_REGEX } from "./regex";

import { validationMessages } from "./messages";

export interface RegisterFormData {
  name: string;
  email: string;
  ocupacao: string;
  password: string;
}

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  ocupacao?: string;
  password?: string;
}

export function validateRegisterForm(
  data: RegisterFormData,
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (data.password.length < 6) {
    errors.password = validationMessages.passwordMin;
  }

  if (!FULL_NAME_REGEX.test(data.name.trim())) {
    errors.name = validationMessages.fullName;
  }

  if (!OCCUPATION_REGEX.test(data.ocupacao.trim())) {
    errors.ocupacao = validationMessages.occupation;
  }

  return errors;
}
