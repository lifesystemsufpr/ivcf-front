export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

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
  cpf: string;
  birthDate: string;
  address: Address;
  email: string;
  phone: string;
  gender: Gender;
  height: number;
  weight: number;
  password: string;

  updatedAt?: string;
  createdAt?: string;
}
