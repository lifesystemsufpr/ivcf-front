import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@/core/components/ui";
import type { Participant } from "../types";
import {
  calculateAge,
  calculateIMC,
  formatGender,
  getIMCClassification,
} from "../utils";
import { formatDate, formatPhone } from "@/core/utils";
import DataRow from "./DataRow";

interface ParticipantDetailContentProps {
  participant: Participant;
}

export default function ParticipantDetailContent({
  participant,
}: ParticipantDetailContentProps) {
  const age = calculateAge(participant.birthDate);
  const imc = parseFloat(calculateIMC(participant.weight, participant.height));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card variant="default" padding="none">
        <CardHeader>
          <CardTitle className="text-lg">Informações Pessoais</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-2 gap-4 pt-6">
          <DataRow label="Nome Completo" value={participant.fullName} />{" "}
          <DataRow
            label="Data de Nascimento"
            value={formatDate(participant.birthDate)}
          />
          <DataRow label="Idade" value={`${age} anos`} />
          <DataRow label="Sexo" value={formatGender(participant.gender)} />
        </CardContent>
      </Card>

      <Card variant="default" padding="none">
        <CardHeader>
          <CardTitle className="text-lg">Contato</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-1 gap-4 pt-6">
          <DataRow label="E-mail" value={participant.email} />
          <DataRow label="Telefone" value={formatPhone(participant.phone)} />
        </CardContent>
      </Card>

      <Card variant="default" padding="none">
        <CardHeader>
          <CardTitle className="text-lg">Endereço</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-2 gap-4 pt-6">
          <DataRow
            label="Logradouro"
            value={`${participant.address.street}, ${participant.address.number}`}
          />
          {participant.address.complement && (
            <DataRow
              label="Complemento"
              value={participant.address.complement}
            />
          )}
          <DataRow label="Bairro" value={participant.address.neighborhood} />
          <DataRow
            label="Cidade/Estado"
            value={`${participant.address.city} - ${participant.address.state}`}
          />
          <DataRow label="CEP" value={participant.address.zipCode} />
        </CardContent>
      </Card>

      <Card variant="default" padding="none">
        <CardHeader>
          <CardTitle className="text-lg">Dados Antropométricos</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-2 gap-4 pt-6">
          <DataRow label="Altura" value={`${participant.height} m`} />
          <DataRow label="Peso" value={`${participant.weight} kg`} />
          <DataRow label="IMC" value={imc} />
          <DataRow label="Classificação" value={getIMCClassification(imc)} />
        </CardContent>
      </Card>
    </div>
  );
}
