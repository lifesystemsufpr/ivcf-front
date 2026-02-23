import { useMemo } from "react";
import { detailedAssessmentsMock } from "../mocks";
import { getStylesByClassification } from "../utils";
import {
  Badge,
  Box,
  Card,
  CardContent,
  Modal,
  Typography,
} from "@/core/components/ui";
import { buildGroupedTree } from "../utils/build-tree";
import GroupSection from "../components/GroupSection";

interface AssessmentDetailModalProps {
  assessmentId: string;
  open: boolean;
  onClose: () => void;
}

export function AssessmentDetailModal({
  assessmentId,
  open,
  onClose,
}: AssessmentDetailModalProps) {
  const assessment = useMemo(
    () =>
      detailedAssessmentsMock.find((item) => item.id === assessmentId) ?? null,
    [assessmentId],
  );

  const grouped = useMemo(
    () => (assessment ? buildGroupedTree(assessment) : []),
    [assessment],
  );

  if (!assessment) {
    return (
      <Modal open={open} onClose={onClose} title="Detalhes da avaliação">
        <Typography>
          Não foi possível localizar os detalhes desta avaliação.
        </Typography>
      </Modal>
    );
  }

  const styles = getStylesByClassification(assessment.classification);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      hideCloseButton
      className="h-[90vh]"
    >
      <Box className="space-y-4">
        <Card className="border">
          <CardContent className="flex flex-col gap-2 p-4">
            <Box
              className="flex flex-wrap items-center"
              justify="space-between"
              align="center"
              gap={8}
            >
              <Box display="flex" direction="row" gap={1} align="center">
                <Typography variant="h3" className="font-semibold">
                  {assessment.participantName}
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  {new Date(assessment.date).toLocaleDateString("pt-BR")} Total:{" "}
                  {assessment.totalScore} pontos
                </Typography>
              </Box>
              <Badge
                className={`${styles.bg} ${styles.border} ${styles.text} border px-3 py-1`}
              >
                {assessment.classification}
              </Badge>
            </Box>
          </CardContent>
        </Card>

        <Box className="space-y-3  overflow-y-auto pr-1">
          {grouped.map((group) => (
            <GroupSection key={group.id} group={group} />
          ))}
        </Box>
      </Box>
    </Modal>
  );
}
