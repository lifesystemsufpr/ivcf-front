import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Separator,
} from "@/core/components/ui";
import type { GroupNode, QuestionPresentationNode } from "../utils/build-tree";

function QuestionRow({ node }: { node: QuestionPresentationNode }) {
  const hasMultipleAnswers = node.answers.length > 1;

  return (
    <Box className="flex flex-col gap-2 rounded-md border border-muted px-3 py-2">
      <Typography className="font-medium">
        {node.question.order}. {node.question.statement}
      </Typography>
      <Box className="space-y-1">
        {node.answers.map((answer) => (
          <Box
            key={answer.id}
            className="flex items-center justify-between text-sm text-muted-foreground bg-muted/20 px-2 py-1.5 rounded"
          >
            <span>{answer.selectedOption?.label}</span>
            {!hasMultipleAnswers && (
              <span className="font-semibold text-foreground">
                {answer.selectedOption?.score ?? 0} pts
              </span>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SubgroupSection({ subgroup }: { subgroup: GroupNode }) {
  return (
    <Card className="border bg-muted/30 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <Typography
          variant="small"
          className="font-semibold uppercase text-muted-foreground"
        >
          {subgroup.label}{" "}
          {subgroup.total < subgroup.rawTotal &&
            "(Max: " + subgroup.total + " pts)"}
        </Typography>
        <Typography variant="small" className="font-semibold">
          {subgroup.total} pts{" "}
        </Typography>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        {subgroup.questions.map((qNode) => (
          <QuestionRow key={qNode.question.id} node={qNode} />
        ))}
      </CardContent>
    </Card>
  );
}

export default function GroupSection({ group }: { group: GroupNode }) {
  return (
    <details className="rounded-lg border border-border bg-card shadow-sm open:pb-4 group">
      <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-4 hover:bg-muted/30 transition-colors">
        <span className="font-semibold text-primary">{group.label}</span>
        <Box className="flex items-center gap-2">
          <Typography
            variant="small"
            className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md"
          >
            {group.total} pts
          </Typography>
          <Box className="text-muted-foreground group-open:rotate-180 transition-transform duration-200">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Box>
        </Box>
      </summary>
      <Separator className="mb-4" />
      <div className="space-y-4 px-4 overflow-hidden">
        {group.subgroups.length > 0 && (
          <Box className="space-y-4">
            {group.subgroups.map((sg) => (
              <SubgroupSection key={sg.id} subgroup={sg} />
            ))}
          </Box>
        )}
        {group.questions.length > 0 && (
          <Box className="space-y-3">
            {group.questions.map((qNode) => (
              <QuestionRow key={qNode.question.id} node={qNode} />
            ))}
          </Box>
        )}
      </div>
    </details>
  );
}
