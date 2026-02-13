import { Box, Drawer, Typography } from "./ui";

export interface NavBarProps {
  open: boolean;
  onClose: () => void;
}

export default function NavBar({ open, onClose }: NavBarProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      size="md"
      title="IVCF-20"
    >
      <Box>
        <Typography variant="h2" className="mb-4">
          Navigation
        </Typography>
      </Box>
    </Drawer>
  );
}
