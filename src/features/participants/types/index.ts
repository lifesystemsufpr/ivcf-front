import type { SystemRole } from "@/core/types";

export type ParticipantDetailTabs = "details" | "indicators" | "assessments";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Participant {
  id: string;
  fullName: string;
  birthDate: string;
  address: Address;
  email: string;
  phone: string;
  gender: Gender;
  height: number;
  weight: number;
  password?: string;

  updatedAt?: string;
  createdAt?: string;
}

export interface ParticipantRequest {
  birthday: string;
  scholarship: string;
  socio_economic_level: string;
  weight: number;
  height: number;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
    gender: Gender;
    active: boolean;
  };
}

export interface ParticipantResponse {
  id: string;
  birthday: string;
  weight: number;
  height: number;

  zipCode: string;
  street: string;
  number: string;
  complement?: string;

  city: string;
  state: string;
  neighborhood: string;

  active: boolean;

  createdAt: string;
  updatedAt: string;

  email: string;
  fullName: string;
  fullName_normalized: string;

  gender: Gender;
  role: SystemRole;

  phone: string;

  hasRelations: boolean;
}
