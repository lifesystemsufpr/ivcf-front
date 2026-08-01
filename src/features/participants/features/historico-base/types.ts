export interface GetBasesResponse {
  hasOwnBase: boolean;
  bases: Base[];
}

export interface Base {
  id: string;
  origin: BaseOrigin;
  createdAt: string; // ISO 8601
  responsesCount: number;
  isCurrentUserOwner: boolean;
  owner: BaseOwner;
}

export interface BaseOwner {
  id: string;
  name: string;
  specialty: string;
}

export type BaseOrigin = "FROM_SCRATCH";
