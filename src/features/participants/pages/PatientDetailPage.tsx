import { Link as RouterLink, useParams } from "react-router-dom";
import { participantsMock } from "../mocks";
import ParticipantHeader from "../components/ParticipantHeader";
import {
  Box,
  Breadcrumbs,
  Link,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@/core/components/ui";
import { clientRoutes } from "@/core/configs/client.routes";
import { useState } from "react";
import ParticipantDetailContent from "../components/ParticipantDetailContent";

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string | number>("details");

  const participant = participantsMock.find((p) => p.id === id);

  if (!participant) {
    return null;
  }

  return (
    <Box display="flex" direction="column" gap={3}>
      <Breadcrumbs>
        <Link as={RouterLink} to={clientRoutes.PARTICIPANTS.LIST}>
          Pacientes
        </Link>
        <Typography as="span" variant="small" className="text-foreground">
          {participant.fullName}
        </Typography>
      </Breadcrumbs>
      <ParticipantHeader participant={participant} />

      <Tabs
        value={activeTab}
        onChange={(value) => {
          setActiveTab(value);
        }}
      >
        <TabList className="w-full">
          <Tab value="details">Detalhes</Tab>
          <Tab value="history">Histórico</Tab>
        </TabList>

        <TabPanel value="details">
          <ParticipantDetailContent participant={participant} />
        </TabPanel>
        <TabPanel value="history">
          <Typography>Conteúdo do histórico do paciente...</Typography>
        </TabPanel>
      </Tabs>
    </Box>
  );
}
