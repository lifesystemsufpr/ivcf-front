import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CardFooter,
  Separator,
  Typography,
} from "@/core/components/ui";
import { cn, formatDateTime } from "@/core/utils";
import {
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Circle,
  ClipboardList,
} from "lucide-react";
import type { Base, BaseOrigin } from "../types";

const originLabels: Record<BaseOrigin, string> = {
  FROM_SCRATCH: "Criada do zero",
  COPIED: "Copiada de outra base",
};

interface HistoricoBaseCardProps {
  base: Base;
  selectable?: boolean;
  selected?: boolean;
  onClick?: (baseId: string) => void;
}

export function HistoricoBaseCard({
  base,
  selectable,
  selected,
  onClick,
}: HistoricoBaseCardProps) {
  return (
    <Card
      className={cn(
        "w-full p-4 border-l-8",
        base.isCurrentUserOwner ? "border-l-primary" : "border-l-border",
        selected && "ring-2 ring-primary",
      )}
      onClick={onClick ? () => onClick(base.id) : undefined}
      aria-pressed={selectable ? !!selected : undefined}
    >
      <CardContent className="p-1">
        <Box
          display="flex"
          direction="row"
          justify="space-between"
          align="flex-start"
          gap={16}
        >
          <Box display="flex" direction="row" align="center" gap={12}>
            <Avatar
              name={base.owner.name}
              size="sm"
              color={base.isCurrentUserOwner ? "primary" : "neutral"}
            />
            <Box display="flex" direction="column" gap={2}>
              <Typography variant="h4" className="font-bold">
                {base.owner.name}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {base.owner.specialty}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" direction="row" align="center" gap={8}>
            {base.isCurrentUserOwner && <Badge>Sua base</Badge>}
            <Badge variant="outline">{originLabels[base.origin]}</Badge>
            {selectable ? (
              selected ? (
                <CircleCheck className="text-primary" size={20} />
              ) : (
                <Circle className="text-gray-400" size={20} />
              )
            ) : (
              onClick && <ChevronRight className="text-gray-400" size={20} />
            )}
          </Box>
        </Box>
        <Separator className="mt-3" />
      </CardContent>

      <CardFooter className="p-1 pt-3">
        <Box display="flex" direction="row" align="center" gap={16}>
          <Box display="flex" direction="row" align="center" gap={6}>
            <ClipboardList className="text-gray-500" size={14} />
            <Typography variant="caption" className="text-gray-500">
              {base.responsesCount === 1
                ? "1 resposta"
                : `${base.responsesCount} respostas`}
            </Typography>
          </Box>

          <Box display="flex" direction="row" align="center" gap={6}>
            <CalendarDays className="text-gray-500" size={14} />
            <Typography variant="caption" className="text-gray-500">
              Criada em {formatDateTime(base.createdAt)}
            </Typography>
          </Box>
        </Box>
      </CardFooter>
    </Card>
  );
}
