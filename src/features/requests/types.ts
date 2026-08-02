import type { SuccessResponse } from "@/core/types";

export type ShareRequestRole = "owner" | "requester";

export type ShareRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface ListShareRequestsQuery {
  as: ShareRequestRole;
  status?: ShareRequestStatus;
  page?: number;
  limit?: number;
}

export interface ShareRequestItem {
  id: string;
  status: ShareRequestStatus;
  participantId: string;
  participantName: string;
  ownerProfessionalId: string;
  ownerName: string;
  requesterProfessionalId: string;
  requesterName: string;
  sourceHistoricoBaseId: string;
  targetHistoricoBaseId?: string;
  snapshotAt: string;
  requestedAt: string;
  respondedAt?: string;
}

export interface ListShareRequestsResponse extends SuccessResponse<
  ListShareRequestsQuery[]
> {}

export interface CreateShareRequestDto {
  participantId: string;
  sourceHistoricoBaseIds: string[];
}
