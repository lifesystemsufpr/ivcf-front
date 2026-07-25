import { cn } from "@/core/utils";
import { RiskDetailListItem } from "./RiskDetailListItem";
import type { DetailChartResponse } from "../../types";

type RiskDetailListProps = {
  items: DetailChartResponse[];
  isFetching?: boolean;
  onSelect: (participantId: string) => void;
};

export function RiskDetailList({
  items,
  isFetching = false,
  onSelect,
}: RiskDetailListProps) {
  return (
    <ul
      className={cn(
        "flex flex-col gap-2 transition-opacity duration-150",
        isFetching && "pointer-events-none opacity-60",
      )}
      aria-busy={isFetching}
    >
      {items.map((participant) => (
        <li key={participant.participantId}>
          <RiskDetailListItem participant={participant} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}
