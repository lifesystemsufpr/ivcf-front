import { useContext, createContext, useMemo, useState } from "react";
import type { Assessment } from "../types";
import { useListAssessments } from "../hooks/useListAssessments";
import { mapperDomainToUI } from "../utils/mapper";

export interface AssessmentListProviderValue {
  filteredAssessments: Assessment[];
  participantName: string;
  setParticipantName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onSubmitFilters: () => void;
  clearFilters: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  loadMoreAssessments: () => void;
}

export const AssessmentListContext = createContext<
  AssessmentListProviderValue | undefined
>(undefined);

export function AssessmentListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [participantName, setParticipantName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    participantName: "",
    startDate: "",
    endDate: "",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useListAssessments({
      pageSize: 10,
      participantName: appliedFilters.participantName || undefined,
      startDate: appliedFilters.startDate || undefined,
      endDate: appliedFilters.endDate || undefined,
    });

  const filteredAssessments = useMemo<Assessment[]>(() => {
    if (!data) return [];
    const assessments = data.pages.flatMap((page) => page.items);
    return assessments.map((assessment) => mapperDomainToUI(assessment));
  }, [data]);

  const onSubmitFilters = () => {
    setAppliedFilters({
      participantName,
      startDate,
      endDate,
    });
  };

  const clearFilters = () => {
    setParticipantName("");
    setStartDate("");
    setEndDate("");
    setAppliedFilters({
      participantName: "",
      startDate: "",
      endDate: "",
    });
  };

  const loadMoreAssessments = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  };

  return (
    <AssessmentListContext.Provider
      value={{
        filteredAssessments,
        participantName,
        setParticipantName,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        onSubmitFilters,
        clearFilters,
        hasNextPage: !!hasNextPage,
        isFetchingNextPage,
        isLoading,
        loadMoreAssessments,
      }}
    >
      {children}
    </AssessmentListContext.Provider>
  );
}

export function useAssessmentList() {
  const context = useContext(AssessmentListContext);
  if (context === undefined) {
    throw new Error(
      "useAssessmentList must be used within an AssessmentListProvider",
    );
  }
  return context;
}
