import { Box } from "@/core/components/ui";
import type { FrailtyClassification } from "../types";
import { getStylesByClassification } from "../utils";

export default function Classification({
  classification,
}: {
  classification: FrailtyClassification;
}) {
  const styles = getStylesByClassification(classification);
  return (
    <Box className={`px-2 py-1 rounded ${styles.bg} ${styles.border}`}>
      <span className={`px-2 py-1 rounded ${styles.text}`}>
        {classification}
      </span>
    </Box>
  );
}
