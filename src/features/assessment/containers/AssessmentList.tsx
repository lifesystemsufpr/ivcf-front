import { Box, Button, Separator, Typography } from "@/core/components/ui";
import AssesmentCard from "../components/AssesmentCard";
import { useAssessmentList } from "../contexts/AssessmentListContext";

export default function AssessmentList() {
  const {
    filteredAssessments,
    isLoading,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
  } = useAssessmentList();

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  return (
    <Box display="flex" direction="column" gap={4} my={4}>
      <Separator className="w-full" />

      {isLoading && (
        <Typography variant="h3" color="secondary">
          Carregando avaliações...
        </Typography>
      )}

      {!isLoading && filteredAssessments.length === 0 && (
        <Typography variant="h3" color="secondary">
          Nenhuma avaliação encontrada.
        </Typography>
      )}

      {filteredAssessments.length > 0 && (
        <Box display="flex" direction="column" gap={4}>
          <div className="space-y-3">
            {filteredAssessments.map((assessment) => (
              <AssesmentCard key={assessment.id} assessment={assessment} />
            ))}
          </div>

          <Separator className="w-full" />

          {/* Paginação */}
          <Box
            display="flex"
            direction="row"
            justify="space-between"
            align="center"
            gap={4}
            className="pt-2"
          >
            <Typography variant="small" color="secondary">
              Mostrando {start} - {end} de {totalItems}
            </Typography>

            <Box display="flex" direction="row" align="center" gap={2}>
              <Button
                variant="ghost"
                size="sm"
                disabled={!canPrevious}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>

              <Typography variant="caption" color="secondary" className="px-3">
                Página {page} de {totalPages}
              </Typography>

              <Button
                variant="ghost"
                size="sm"
                disabled={!canNext}
                onClick={() => setPage(page + 1)}
              >
                Próxima
              </Button>

              <div className="flex items-center gap-2 ml-4">
                <label
                  htmlFor="pageSize"
                  className="text-xs text-muted-foreground"
                >
                  Itens/pág
                </label>
                <select
                  id="pageSize"
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {[5, 10, 15, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
