import { Box, Input, Label, Select } from "@/core/components/ui";
import type { Participant } from "../../types";
import { getAgeFromDate, isCompleteDate, MAX_AGE, MIN_AGE } from "./validation";
import type { FormErrors, ParticipantFormValues } from "./types";

type ParticipantFormStepOneProps = {
  values: ParticipantFormValues;
  errors: FormErrors;
  onFieldChange: <K extends keyof ParticipantFormValues>(
    key: K,
    value: ParticipantFormValues[K],
  ) => void;
  onFieldError: (key: keyof ParticipantFormValues, message: string) => void;
};

export default function ParticipantFormStepOne({
  values,
  errors,
  onFieldChange,
  onFieldError,
}: ParticipantFormStepOneProps) {
  return (
    <Box display="flex" direction="column" gap={4}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            errorMessage={errors.email}
            placeholder="email@exemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            value={values.fullName}
            onChange={(e) => onFieldChange("fullName", e.target.value)}
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
              onFieldChange("birthDate", e.target.value);
            }}
            onBlur={(e) => {
              const value = e.target.value;

              if (!value || !isCompleteDate(value)) return;

              const age = getAgeFromDate(value);
              if (age === null || age < MIN_AGE || age > MAX_AGE) {
                onFieldError(
                  "birthDate",
                  `A idade deve estar entre ${MIN_AGE} e ${MAX_AGE} anos`,
                );
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
              onFieldChange("gender", e.target.value as Participant["gender"])
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
            onChange={(e) => onFieldChange("height", e.target.value)}
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
            onChange={(e) => onFieldChange("weight", e.target.value)}
            placeholder="70"
            errorMessage={errors.weight}
          />
        </div>
      </div>
    </Box>
  );
}
