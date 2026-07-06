import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Box, Button, Typography } from "@/core/components/ui";
import type { Participant, ParticipantRequest } from "../types";
import ParticipantFormStepOne from "../components/participant-form/ParticipantFormStepOne";
import ParticipantFormStepTwo from "../components/participant-form/ParticipantFormStepTwo";
import {
  validateStepOne,
  validateStepTwo,
  parseNumber,
} from "../components/participant-form/validation";
import type {
  AddressFieldKey,
  FormErrorKey,
  FormErrors,
  ParticipantFormValues,
} from "../components/participant-form/types";
import { useCreateParticipant } from "../hooks/useCreateParticipant";
import { toast } from "react-toastify";
import { useUpdateParticipant } from "../hooks/useUpdateParticipant";

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

export default function ParticipantForm({
  initialValues,
  title,
  onCancel,
}: ParticipantFormProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ParticipantFormValues>(() =>
    buildInitialValues(initialValues),
  );
  const [errors, setErrors] = useState<FormErrors>(errorState);

  const createParticipant = useCreateParticipant();
  const updateParticipant = useUpdateParticipant();

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

  const setFieldError = (key: keyof ParticipantFormValues, message: string) => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const updateAddressField = (key: AddressFieldKey, value: string) => {
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

  const handleAddressResolved = (address: ParticipantFormValues["address"]) => {
    setValues((prev) => ({ ...prev, address }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLastStep) {
      const stepOneErrors = validateStepOne(values);
      if (Object.keys(stepOneErrors).length > 0) {
        setErrors(stepOneErrors);
        return;
      }

      setStep(1);
      return;
    }

    const stepTwoErrors = validateStepTwo(values);
    const stepOneErrors = validateStepOne(values);
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

    if (initialValues?.id) {
      updateParticipant.mutate(
        { id: initialValues.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Participante atualizado com sucesso.");
            if (onCancel) onCancel();
          },
          onError: (error) => {
            const message =
              error.message ||
              "Erro ao atualizar participante. Tente novamente.";

            toast.error(message);
          },
        },
      );
      return;
    }

    createParticipant.mutate(payload, {
      onSuccess: () => {
        if (onCancel) onCancel();
      },
      onError: (error) => {
        const isUniqueConstraintError =
          error instanceof Error &&
          error.message.includes("Unique constraint failed");
        console.log(isUniqueConstraintError, error.message);

        if (isUniqueConstraintError) {
          toast.error(
            "Já existe um participante com este e-mail. Tente outro.",
          );
          return;
        }

        const message =
          error.message || "Erro ao criar participante. Tente novamente.";

        toast.error(message, {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      },
    });
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
        <ParticipantFormStepOne
          values={values}
          errors={errors}
          onFieldChange={updateField}
          onFieldError={setFieldError}
        />
      )}

      {step === 1 && (
        <ParticipantFormStepTwo
          values={values}
          errors={errors}
          onAddressFieldChange={updateAddressField}
          onAddressResolved={handleAddressResolved}
        />
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
          <Button
            type="submit"
            disabled={createParticipant.isPending}
            loading={createParticipant.isPending}
          >
            {isLastStep ? "Salvar" : "Proxima etapa"}
          </Button>
        </div>
      </Box>
    </form>
  );
}
