import {
  Box,
  Card,
  CardContent,
  CardFooter,
  Separator,
  Typography,
} from "@/core/components/ui";
import type { Assessment } from "../types";
import { getStylesByClassification } from "../utils";
import Classification from "./Classification";
import { formatDateTime } from "@/core/utils";
import { useState } from "react";
import { AssessmentDetailModal } from "../containers/AssessmentDetailModal";

interface AssesmentCardProps {
  assessment: Assessment;
}

export default function AssesmentCard({ assessment }: AssesmentCardProps) {
  const styles = getStylesByClassification(assessment.classification);
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <>
      <Card
        className={`w-full p-4 border-l-8 ${styles.border}`}
        onClick={() => setOpenDetail(true)}
        role="button"
        tabIndex={0}
      >
        <CardContent className="p-1">
          <Box
            display="flex"
            direction="row"
            justify="space-between"
            align="flex-start"
            gap={4}
          >
            <Box display="flex" direction="column" gap={1}>
              <Typography variant="h4" className="font-bold">
                {assessment.participantName}
              </Typography>
              <Typography
                variant={`${assessment.participantName ? "caption" : "body"}`}
                className={`${assessment.participantName ? "text-gray-500" : "font-bold"}`}
              >
                Pontuação total: {assessment.totalScore}
              </Typography>
            </Box>
            <Classification classification={assessment.classification} />
          </Box>
          <Separator className="mt-2" />
        </CardContent>
        <CardFooter className="p-1">
          <Typography variant="caption" className="text-gray-500">
            Data da avaliação: {formatDateTime(assessment.date)}
          </Typography>
        </CardFooter>
      </Card>

      <AssessmentDetailModal
        assessmentId={assessment.id}
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      />
    </>
  );
}
