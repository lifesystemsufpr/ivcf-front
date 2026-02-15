import { useMemo, useState, type FormEvent } from "react";
import { Box, Button, Input, Label, Typography } from "@/core/components/ui";
import type { Participant } from "../types";

type ParticipantFormValues = Omit<Participant, "height" | "weight"> & {
  height: string;
  weight: string;
};

type ParticipantFormProps = {
  initialValues?: Partial<Participant>;
  onSubmit?: (data: Participant) => void;
  onCancel?: () => void;
};

const defaultValues: ParticipantFormValues = {
  fullName: "",
  cpf: "",
  birthDate: "",
  email: "",
  phone: "",
  gender: "OTHER",
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

function buildInitialValues(initialValues?: Partial<Participant>) {
  const base: ParticipantFormValues = {
    ...defaultValues,
    address: {
      ...defaultValues.address,
    },
  };

  if (!initialValues) return base;

  return {
    ...base,
    ...initialValues,
    address: {
      ...base.address,
      ...initialValues.address,
    },
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
  onSubmit,
  onCancel,
}: ParticipantFormProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ParticipantFormValues>(() =>
    buildInitialValues(initialValues),
  );

  const isLastStep = step === 1;
  const stepLabel = useMemo(
    () => (step === 0 ? "Dados pessoais" : "Endereco e medidas"),
    [step],
  );

  const updateField = <K extends keyof ParticipantFormValues>(
    key: K,
    value: ParticipantFormValues[K],
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateAddressField = (
    key: keyof ParticipantFormValues["address"],
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [key]: value,
      },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLastStep) {
      setStep(1);
      return;
    }

    const payload: Participant = {
      ...values,
      height: parseNumber(values.height),
      weight: parseNumber(values.weight),
    };

    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Box display="flex" direction="column" gap={2}>
        <Typography variant="h4">Novo participante</Typography>
        <Typography variant="caption">
          Etapa {step + 1} de 2 - {stepLabel}
        </Typography>
      </Box>

      {step === 0 && (
        <Box display="flex" direction="column" gap={4}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                value={values.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={values.cpf}
                onChange={(event) => updateField("cpf", event.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={values.birthDate}
                onChange={(event) =>
                  updateField("birthDate", event.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Genero</Label>
              <select
                id="gender"
                value={values.gender}
                onChange={(event) =>
                  updateField(
                    "gender",
                    event.target.value as Participant["gender"],
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="(00) 00000-0000"
              />
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
                onChange={(event) =>
                  updateAddressField("zipCode", event.target.value)
                }
                placeholder="00000-000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={values.address.street}
                onChange={(event) =>
                  updateAddressField("street", event.target.value)
                }
                placeholder="Nome da rua"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Numero</Label>
              <Input
                id="number"
                value={values.address.number}
                onChange={(event) =>
                  updateAddressField("number", event.target.value)
                }
                placeholder="000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={values.address.complement ?? ""}
                onChange={(event) =>
                  updateAddressField("complement", event.target.value)
                }
                placeholder="Apto, bloco, casa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={values.address.neighborhood}
                onChange={(event) =>
                  updateAddressField("neighborhood", event.target.value)
                }
                placeholder="Nome do bairro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={values.address.city}
                onChange={(event) =>
                  updateAddressField("city", event.target.value)
                }
                placeholder="Cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={values.address.state}
                onChange={(event) =>
                  updateAddressField("state", event.target.value)
                }
                placeholder="UF"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={values.height}
                onChange={(event) => updateField("height", event.target.value)}
                placeholder="170"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={values.weight}
                onChange={(event) => updateField("weight", event.target.value)}
                placeholder="70"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
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
