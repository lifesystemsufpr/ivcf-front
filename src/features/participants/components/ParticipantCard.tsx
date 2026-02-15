import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Typography,
} from "@/core/components/ui";
import type { Participant } from "../types";
import { Pencil, PlusCircle, Trash } from "lucide-react";
import { useState, type MouseEvent } from "react";

interface ParticipantCardProps {
  participant: Participant;
}

export default function ParticipantCard({ participant }: ParticipantCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Confirmar exclusao", participant.fullName);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Card
        onClick={() => {
          console.log("Clicou");
        }}
        variant={"elevated"}
      >
        <CardContent className="p-3 flex flex-row justify-between align-center">
          <Box display="flex" direction="column" gap={1}>
            <Typography>{participant.fullName}</Typography>
            <Box display="flex" direction="row" gap={5} align="center">
              <Typography variant="caption">{participant.birthDate}</Typography>
              <Typography variant="caption">
                · CPF: {participant.cpf}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" direction="row" gap={8} align="center">
            <Button
              variant="default"
              size="sm"
              className=" radius-full"
              onClick={(event) => event.stopPropagation()}
            >
              <Pencil size={16} />
            </Button>

            <Button
              variant="default"
              size="sm"
              className="radius-full"
              onClick={(event) => event.stopPropagation()}
            >
              <PlusCircle size={16} />
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className=" radius-full"
              onClick={handleDeleteClick}
            >
              <Trash size={16} />
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Excluir participante"
        description={`Tem certeza que deseja excluir ${participant.fullName}?`}
      >
        <div className="flex w-full justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </div>
      </Dialog>
    </>
  );
}
