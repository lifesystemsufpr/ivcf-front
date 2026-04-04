import { useNavigate } from "react-router-dom";
import { clientRoutes } from "../configs/client.routes";
import { Box, Button, Drawer, Separator } from "./ui";

export interface NavBarProps {
  open: boolean;
  onClose: () => void;
}

export default function NavBar({ open, onClose }: NavBarProps) {
  const router = useNavigate();
  const activeRoute = window.location.pathname;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      size="md"
      title="IVCF-20"
      className=" border-0"
    >
      <Separator />
      <Box display="flex" direction="column" gap={10} my={10}>
        <Button
          variant={activeRoute === "/" ? "secondary" : "default"}
          onClick={() => {
            router("/");
            onClose();
          }}
        >
          Home
        </Button>
        <Button
          variant={
            activeRoute === clientRoutes.PARTICIPANTS.LIST
              ? "secondary"
              : "default"
          }
          onClick={() => {
            router(clientRoutes.PARTICIPANTS.LIST);
            onClose();
          }}
        >
          Participantes
        </Button>
        <Button
          variant={
            activeRoute === clientRoutes.IVCF.LIST ? "secondary" : "default"
          }
          onClick={() => {
            router(clientRoutes.IVCF.LIST);
            onClose();
          }}
        >
          Avaliações
        </Button>
      </Box>
    </Drawer>
  );
}
