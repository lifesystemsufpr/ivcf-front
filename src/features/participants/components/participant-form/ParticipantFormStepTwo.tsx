import { Box, Input, Label } from "@/core/components/ui";
import { fetchAddressByCep } from "@/core/utils";
import { mapStateToUF } from "../../utils";
import type { AddressFieldKey, FormErrors, ParticipantFormValues } from "./types";

type ParticipantFormStepTwoProps = {
  values: ParticipantFormValues;
  errors: FormErrors;
  onAddressFieldChange: (key: AddressFieldKey, value: string) => void;
  onAddressResolved: (address: ParticipantFormValues["address"]) => void;
};

export default function ParticipantFormStepTwo({
  values,
  errors,
  onAddressFieldChange,
  onAddressResolved,
}: ParticipantFormStepTwoProps) {
  const handleFetchAddress = async (cep: string) => {
    if (cep.length < 9) return;

    try {
      const address = await fetchAddressByCep(cep);

      if (address) {
        onAddressResolved({
          ...values.address,
          street: address.logradouro,
          neighborhood: address.bairro,
          city: address.localidade,
          state: mapStateToUF(address.estado),
        });
      }
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
    }
  };

  return (
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

              onAddressFieldChange("zipCode", cep);

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
            onChange={(e) => onAddressFieldChange("street", e.target.value)}
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
              onAddressFieldChange("neighborhood", e.target.value)
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
            onChange={(e) => onAddressFieldChange("city", e.target.value)}
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
              onAddressFieldChange("complement", e.target.value)
            }
            placeholder="Apto, bloco, casa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Numero</Label>
          <Input
            id="number"
            value={values.address.number}
            onChange={(e) => onAddressFieldChange("number", e.target.value)}
            placeholder="000"
            errorMessage={errors["address.number"]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            value={values.address.state}
            onChange={(e) => onAddressFieldChange("state", e.target.value)}
            placeholder="UF"
            errorMessage={errors["address.state"]}
          />
        </div>
      </div>
    </Box>
  );
}
