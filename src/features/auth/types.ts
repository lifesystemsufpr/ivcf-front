export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export interface JwtPayload {
  username: string;
  cpf: string;
  sub: string;
  role: "MANAGER" | "ADMIN" | "USER";
  iat: number;
  exp: number;
}
