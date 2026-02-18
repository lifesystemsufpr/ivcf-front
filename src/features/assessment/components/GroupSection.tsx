import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Typography,
  Separator,
} from "@/core/components/ui";
import type { Answer } from "../types";

interface GroupNode {
  id: string;
  label: string;
  total: number;
  rawTotal: number;
  answers: Answer[];
  subgroups: GroupNode[];
}

function QuestionRow({ answer }: { answer: Answer }) {
  return (
    <Box className="flex flex-col gap-1 rounded-md border border-muted px-3 py-2 ">
      <Typography className="font-medium">
        {answer.question.statement}
      </Typography>
      <Box className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{answer.selectedOption?.label}</span>
        <span className="font-semibold text-foreground">
          +{answer.selectedOption?.score ?? 0} pts
        </span>
      </Box>
    </Box>
  );
}

function SubgroupSection({ subgroup }: { subgroup: GroupNode }) {
  return (
    <Card className="border bg-muted/30">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-base">{subgroup.label}</CardTitle>
        <Typography variant="small" className="font-semibold">
          {subgroup.total} pts{" "}
          {subgroup.total !== subgroup.rawTotal
            ? `(bruto ${subgroup.rawTotal})`
            : ""}
        </Typography>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        {subgroup.answers.map((answer) => (
          <QuestionRow key={answer.id} answer={answer} />
        ))}
      </CardContent>
    </Card>
  );
}

export default function GroupSection({ group }: { group: GroupNode }) {
  return (
    <details className="rounded-lg border border-border shadow-sm">
      <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3">
        <span className="font-semibold">{group.label}</span>
        <Typography variant="small" className="text-muted-foreground">
          {group.total} pts{" "}
          {group.total !== group.rawTotal ? `(bruto ${group.rawTotal})` : ""}
        </Typography>
      </summary>
      <Separator className="my-2" />
      <div className="space-y-3 px-4 pb-4">
        {group.subgroups.length > 0 && (
          <Box className="space-y-3">
            {group.subgroups.map((sg) => (
              <SubgroupSection key={sg.id} subgroup={sg} />
            ))}
          </Box>
        )}
        {group.answers.length > 0 && (
          <Box className="space-y-2">
            {group.answers.map((answer) => (
              <QuestionRow key={answer.id} answer={answer} />
            ))}
          </Box>
        )}
      </div>
    </details>
  );
}
