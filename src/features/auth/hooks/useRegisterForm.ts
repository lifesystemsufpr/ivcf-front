import { useState } from "react";

import {
  validateRegisterForm,
  type RegisterFormData,
  type RegisterFormErrors,
} from "../validations/register.schema";

import { isEmptyObject } from "@/core/utils/isEmptyObject";

export function useRegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    ocupacao: "",
    password: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }

  function validate() {
    const validationErrors = validateRegisterForm(formData);

    setErrors(validationErrors);

    return isEmptyObject(validationErrors);
  }

  return {
    formData,
    errors,
    handleChange,
    validate,
    setErrors,
  };
}
