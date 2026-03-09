import { Box, Typography } from "@/core/components/ui";
import type { UIEvent } from "react";
import AssesmentCard from "../components/AssesmentCard";
import { useAssessmentList } from "../contexts/AssessmentListContext";

export default function AssessmentList() {
  const {
    filteredAssessments,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    loadMoreAssessments,
  } = useAssessmentList();

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const nearBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 64;

    if (nearBottom) {
      loadMoreAssessments();
    }
  };

  return (
    <Box
      display="flex"
      direction="column"
      gap={8}
      my={4}
      onScroll={handleScroll}
      className="h-[calc(100%-98px)] overflow-y-auto pr-2 scrollbar-thin 
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:bg-slate-300
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
    >
      {isLoading && (
        <Typography variant="small" color="secondary">
          Carregando avaliações...
        </Typography>
      )}

      {filteredAssessments.map((assessment) => (
        <AssesmentCard key={assessment.id} assessment={assessment} />
      ))}

      {!isLoading && filteredAssessments.length === 0 && (
        <Typography variant="small" color="secondary">
          Nenhuma avaliação encontrada.
        </Typography>
      )}

      {isFetchingNextPage && (
        <Typography variant="small" color="secondary">
          Carregando mais avaliações...
        </Typography>
      )}

      {!hasNextPage && filteredAssessments.length > 0 && (
        <Typography variant="small" color="secondary">
          Você chegou ao fim da lista.
        </Typography>
      )}
    </Box>
  );
}
