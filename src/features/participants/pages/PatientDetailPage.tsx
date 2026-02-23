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
import type { ParticipantDetailTabs } from "../types";

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<ParticipantDetailTabs>("details");

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
        <Typography as="span" variant="small" className="text-primary">
          {participant.fullName}
        </Typography>
      </Breadcrumbs>
      <ParticipantHeader participant={participant} />

      <Tabs
        value={activeTab}
        onChange={(value) => {
          setActiveTab(value as ParticipantDetailTabs);
        }}
      >
        <TabList className="w-full">
          <Tab value="details">Detalhes</Tab>
          <Tab value="indicators">Indicadores</Tab>
          <Tab value="assessments">Avaliações</Tab>
        </TabList>

        <TabPanel value="details">
          <ParticipantDetailContent participant={participant} />
        </TabPanel>
        <TabPanel value="indicators">
          <Typography>Conteúdo dos indicadores do paciente...</Typography>
        </TabPanel>
        <TabPanel value="assessments">
          <Typography>Conteúdo das avaliações do paciente...</Typography>
        </TabPanel>
      </Tabs>
    </Box>
  );
}
