import { IconButton } from "@/core/components/ui";
import { clientRoutes } from "@/core/configs/client.routes";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewAssessment() {
  const router = useNavigate();

  return (
    <IconButton
      icon={Plus}
      ariaLabel="Nova avaliação"
      onClick={() => router(clientRoutes.IVCF.INSTRUCTIONS)}
      variant="accent"
    />
  );
}
