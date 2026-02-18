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
    </div>
  );
}
