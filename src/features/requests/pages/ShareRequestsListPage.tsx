import { useState } from "react";
import {
  Box,
  Separator,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@/core/components/ui";
import { ShareRequestsList } from "../containers/ShareRequestsList";
import type { ShareRequestRole } from "../types";

export function ShareRequestsListPage() {
  const [activeTab, setActiveTab] = useState<ShareRequestRole>("owner");

  return (
    <Box type="screen" className="flex flex-col">
      <Typography variant="h1">Solicitações de compartilhamento</Typography>
      <Typography variant="small" className="mt-1">
        Gerencie os pedidos de acesso às bases de histórico dos participantes.
      </Typography>

      <Separator className="mt-3 mb-3" />

      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value as ShareRequestRole)}
      >
        <TabList className="w-full">
          <Tab value="owner">Recebidas</Tab>
          <Tab value="requester">Enviadas</Tab>
        </TabList>

        <TabPanel value="owner">
          <ShareRequestsList role="owner" />
        </TabPanel>
        <TabPanel value="requester">
          <ShareRequestsList role="requester" />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
