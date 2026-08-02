import { Badge } from "@/core/components/ui";
import type { ShareRequestStatus } from "../types";

// O tema nao define tokens de success/warning, entao as cores de status usam a
// paleta padrao do Tailwind, como nos demais indicadores do projeto.
const statusStyles: Record<
  ShareRequestStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Pendente", className: "bg-amber-100 text-amber-800" },
  APPROVED: { label: "Aprovada", className: "bg-emerald-100 text-emerald-800" },
  REJECTED: { label: "Rejeitada", className: "bg-red-100 text-red-800" },
  CANCELLED: { label: "Cancelada", className: "bg-slate-200 text-slate-700" },
};

interface ShareRequestStatusBadgeProps {
  status: ShareRequestStatus;
}

export function ShareRequestStatusBadge({
  status,
}: ShareRequestStatusBadgeProps) {
  const style = statusStyles[status];

  return <Badge className={style.className}>{style.label}</Badge>;
}
