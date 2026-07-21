import type { SystemRole } from "@/core/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refreshToken?: string;
};

export interface JwtPayload {
  username: string;
  email: string;
  sub: string;
  role: "MANAGER" | "ADMIN" | "USER";
  iat: number;
  exp: number;
}

export type Gender = "MALE" | "FEMALE";

export interface RegisterPayload {
  speciality: string;
  user: {
    fullName: string;
    email: string;
    password: string;
  };
}

export interface RegisterResponse {
  id: string;
  email: string;
  fullName: string;
  fullName_normalized: string;
  active: boolean;
  gender: Gender;
  role: SystemRole;
  phone: string;
  createdAt: string;
  updatedAt: string;
  speciality: string;
  speciality_normalized: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
