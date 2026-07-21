import type { Participant } from "../../types";

export type ParticipantFormValues = Omit<Participant, "height" | "weight"> & {
  height: string;
  weight: string;
};

export type AddressFieldKey = keyof ParticipantFormValues["address"];
export type FormErrorKey =
  | keyof ParticipantFormValues
  | `address.${AddressFieldKey}`;
export type FormErrors = Partial<Record<FormErrorKey, string>>;
