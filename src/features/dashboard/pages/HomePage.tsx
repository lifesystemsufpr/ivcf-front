import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@/core/components/ui";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <Box>
        <Typography variant="h1">Bem-vindo ao Dashboard</Typography>
        <Typography variant="small">
          Gerencie seus dados com eficiência e leveza.
        </Typography>
      </Box>

      <Box>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Typography variant="h3">Performance</Typography>
              <Badge variant="secondary">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Typography variant="body" className="mb-4">
              Seu projeto está rodando com componentes atômicos e Tailwind CSS.
            </Typography>
            <Button className="w-full">Ver Detalhes</Button>
            <Alert className="mt-4">
              Atenção: Verifique as métricas de desempenho regularmente.
            </Alert>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
