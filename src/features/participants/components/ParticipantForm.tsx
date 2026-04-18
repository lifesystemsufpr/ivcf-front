import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Input,
  Label,
  Select,
  Typography,
} from "@/core/components/ui";
import type { Participant, ParticipantRequest } from "../types";
import { fetchAddressByCep } from "@/core/utils";
import { mapStateToUF } from "../utils";

type ParticipantFormValues = Omit<Participant, "height" | "weight"> & {
  height: string;
  weight: string;
};

type AddressFieldKey = keyof ParticipantFormValues["address"];
type FormErrorKey = keyof ParticipantFormValues | `address.${AddressFieldKey}`;
type FormErrors = Partial<Record<FormErrorKey, string>>;

type ParticipantFormProps = {
  initialValues?: Partial<Participant>;
  title?: string;
  onSubmit?: (data: ParticipantRequest) => void;
  onCancel?: () => void;
};

const defaultValues: ParticipantFormValues = {
  id: "",
  fullName: "",
  birthDate: "",
  email: "",
  gender: "MALE",
  height: "",
  weight: "",
  address: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  },
};

const errorState: FormErrors = {};

const MIN_AGE = 60;
const MAX_AGE = 110;

function normalizeDateForInput(value?: string) {
  if (!value) return "";

  // Accepts both yyyy-MM-dd and ISO date-time strings.
  const datePrefixMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (datePrefixMatch) return datePrefixMatch[1];

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().slice(0, 10);
}

function buildInitialValues(initialValues?: Partial<Participant>) {
  const base: ParticipantFormValues = {
    ...defaultValues,
    address: { ...defaultValues.address },
  };

  if (!initialValues) return base;

  return {
    ...base,
    ...initialValues,
    address: {
      ...base.address,
      ...initialValues.address,
    },
    birthDate: normalizeDateForInput(initialValues.birthDate),
    height:
      initialValues.height !== undefined
        ? String(initialValues.height)
        : defaultValues.height,
    weight:
      initialValues.weight !== undefined
        ? String(initialValues.weight)
        : defaultValues.weight,
  } as ParticipantFormValues;
}

function parseNumber(value: string) {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getAgeFromDate(dateString: string) {
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

function isCompleteDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export default function ParticipantForm({
  initialValues,
  title,
  onSubmit,
  onCancel,
}: ParticipantFormProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ParticipantFormValues>(() =>
    buildInitialValues(initialValues),
  );
  const [errors, setErrors] = useState<FormErrors>(errorState);

  const isEditMode = Boolean(initialValues?.id);

  useEffect(() => {
    setValues(buildInitialValues(initialValues));
    setErrors(errorState);
    setStep(0);
  }, [initialValues]);

  const isLastStep = step === 1;
  const stepLabel = useMemo(
    () => (step === 0 ? "Dados pessoais" : "Endereco e medidas"),
    [step],
  );

  const updateField = <K extends keyof ParticipantFormValues>(
    key: K,
    value: ParticipantFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;

      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateAddressField = (
    key: keyof ParticipantFormValues["address"],
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));

    const errorKey = `address.${key}` as FormErrorKey;
    setErrors((prev) => {
      if (!prev[errorKey]) return prev;

      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  };

  const validateStepOne = () => {
    const nextErrors: FormErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = "Informe o email";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      nextErrors.email = "Informe um email valido";
    }

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Informe o nome completo";
    }

    if (!values.birthDate) {
      nextErrors.birthDate = "Informe a data de nascimento";
    } else if (isCompleteDate(values.birthDate)) {
      const age = getAgeFromDate(values.birthDate);

      if (age === null || age < MIN_AGE || age > MAX_AGE) {
        nextErrors.birthDate = `A idade deve estar entre ${MIN_AGE} e ${MAX_AGE} anos`;
      }
    }

    return nextErrors;
  };

  const validateStepTwo = () => {
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

    if (!values.height.trim()) {
      nextErrors.height = "Informe a altura";
    } else if (parseNumber(values.height) <= 0) {
      nextErrors.height = "Informe uma altura valida";
    }

    if (!values.weight.trim()) {
      nextErrors.weight = "Informe o peso";
    } else if (parseNumber(values.weight) <= 0) {
      nextErrors.weight = "Informe um peso valido";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLastStep) {
      const stepOneErrors = validateStepOne();
      if (Object.keys(stepOneErrors).length > 0) {
        setErrors(stepOneErrors);
        return;
      }

      setStep(1);
      return;
    }

    const stepTwoErrors = validateStepTwo();
    const stepOneErrors = validateStepOne();
    const mergedErrors = { ...stepOneErrors, ...stepTwoErrors };

    if (Object.keys(mergedErrors).length > 0) {
      setErrors(mergedErrors);
      return;
    }

    // --- MAPEAMENTO PARA PARTICIPANT REQUEST ---
    const payload: ParticipantRequest = {
      birthday: values.birthDate,
      scholarship: "HIGHER_EDUCATION_COMPLETE",
      socio_economic_level: "C",
      weight: parseNumber(values.weight),
      height: parseNumber(values.height),
      zipCode: values.address.zipCode,
      street: values.address.street,
      number: values.address.number,
      complement: values.address.complement,
      neighborhood: values.address.neighborhood,
      city: values.address.city,
      state: values.address.state,
      gender: values.gender,
      user: {
        fullName: values.fullName,
        email: values.email,
        active: true,
      },
    };

    onSubmit?.(payload);
  };

  const handleFetchAddress = async (cep: string) => {
    if (cep.length < 9) return;

    try {
      const address = await fetchAddressByCep(cep);

      if (address) {
        setValues((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            street: address.logradouro,
            neighborhood: address.bairro,
            city: address.localidade,
            state: mapStateToUF(address.estado),
          },
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Box display="flex" direction="column" gap={2}>
        <Typography variant="h4">{title ?? "Novo participante"}</Typography>
        <Typography variant="caption">
          Etapa {step + 1} de 2 - {stepLabel}
        </Typography>
      </Box>

      {step === 0 && (
        <Box display="flex" direction="column" gap={4}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => updateField("email", e.target.value)}
                errorMessage={errors.email}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                value={values.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Digite o nome completo"
                required
                errorMessage={errors.fullName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={values.birthDate}
                onChange={(e) => {
                  updateField("birthDate", e.target.value);
                }}
                onBlur={(e) => {
                  const value = e.target.value;

                  if (!value || !isCompleteDate(value)) return;

                  const age = getAgeFromDate(value);
                  if (age === null || age < MIN_AGE || age > MAX_AGE) {
                    setErrors((prev) => ({
                      ...prev,
                      birthDate: `A idade deve estar entre ${MIN_AGE} e ${MAX_AGE} anos`,
                    }));
                  }
                }}
                placeholder="dd/mm/aaaa"
                errorMessage={errors.birthDate}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <Select
                id="gender"
                value={values.gender}
                onChange={(e) =>
                  updateField("gender", e.target.value as Participant["gender"])
                }
              >
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={values.height}
                onChange={(e) => updateField("height", e.target.value)}
                placeholder="170"
                errorMessage={errors.height}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={values.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                placeholder="70"
                errorMessage={errors.weight}
              />
            </div>
          </div>
        </Box>
      )}

      {step === 1 && (
        <Box display="flex" direction="column" gap={4}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={values.address.zipCode}
                mask="cep"
                onChange={(e) => {
                  const cep = e.target.value;

                  updateAddressField("zipCode", cep);

                  if (cep.length >= 9) {
                    handleFetchAddress(cep);
                  }
                }}
                placeholder="00000-000"
                errorMessage={errors["address.zipCode"]}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={values.address.street}
                onChange={(e) => updateAddressField("street", e.target.value)}
                placeholder="Nome da rua"
                errorMessage={errors["address.street"]}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={values.address.neighborhood}
                onChange={(e) =>
                  updateAddressField("neighborhood", e.target.value)
                }
                placeholder="Nome do bairro"
                errorMessage={errors["address.neighborhood"]}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={values.address.city}
                onChange={(e) => updateAddressField("city", e.target.value)}
                placeholder="Cidade"
                errorMessage={errors["address.city"]}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={values.address.complement ?? ""}
                onChange={(e) =>
                  updateAddressField("complement", e.target.value)
                }
                placeholder="Apto, bloco, casa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Numero</Label>
              <Input
                id="number"
                value={values.address.number}
                onChange={(e) => updateAddressField("number", e.target.value)}
                placeholder="000"
                errorMessage={errors["address.number"]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={values.address.state}
                onChange={(e) => updateAddressField("state", e.target.value)}
                placeholder="UF"
                errorMessage={errors["address.state"]}
              />
            </div>
          </div>
        </Box>
      )}

      <Box display="flex" justify="space-between" align="center">
        <div className="flex gap-2">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={() => setStep(0)}>
              Voltar
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isLastStep ? "Salvar" : "Proxima etapa"}
          </Button>
        </div>
      </Box>
    </form>
  );
}
