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
  password: "",
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

  useEffect(() => {
    setValues(buildInitialValues(initialValues));
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
  };

  const updateAddressField = (
    key: keyof ParticipantFormValues["address"],
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLastStep) {
      setStep(1);
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={values.birthDate}
                onChange={(e) => updateField("birthDate", e.target.value)}
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
          </div>
        </Box>
      )}

      {step === 1 && (
        <Box display="flex" direction="column" gap={4}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={values.address.street}
                onChange={(e) => updateAddressField("street", e.target.value)}
                placeholder="Nome da rua"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Numero</Label>
              <Input
                id="number"
                value={values.address.number}
                onChange={(e) => updateAddressField("number", e.target.value)}
                placeholder="000"
              />
            </div>

            <div className="space-y-2">
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
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={values.address.neighborhood}
                onChange={(e) =>
                  updateAddressField("neighborhood", e.target.value)
                }
                placeholder="Nome do bairro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={values.address.city}
                onChange={(e) => updateAddressField("city", e.target.value)}
                placeholder="Cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={values.address.state}
                onChange={(e) => updateAddressField("state", e.target.value)}
                placeholder="UF"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={values.height}
                onChange={(e) => updateField("height", e.target.value)}
                placeholder="170"
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Defina uma senha"
                required
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
