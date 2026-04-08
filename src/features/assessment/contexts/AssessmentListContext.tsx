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
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  totalItems: number;
  onSubmitFilters: () => void;
  clearFilters: () => void;
  isLoading: boolean;
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [appliedFilters, setAppliedFilters] = useState({
    participantName: "",
    startDate: "",
    endDate: "",
  });

  const { data, isLoading } = useListAssessments({
    page,
    pageSize,
    participantName: appliedFilters.participantName || undefined,
    startDate: appliedFilters.startDate || undefined,
    endDate: appliedFilters.endDate || undefined,
  });

  const filteredAssessments = useMemo<Assessment[]>(() => {
    if (!data) return [];
    return data.items.map((assessment) => mapperDomainToUI(assessment));
  }, [data]);

  const totalPages = data?.meta?.totalPages ?? 0;
  const totalItems = data?.meta?.total ?? 0;

  const onSubmitFilters = () => {
    setPage(1);
    setAppliedFilters({
      participantName,
      startDate,
      endDate,
    });
  };

  const clearFilters = () => {
    setPage(1);
    setParticipantName("");
    setStartDate("");
    setEndDate("");
    setAppliedFilters({
      participantName: "",
      startDate: "",
      endDate: "",
    });
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
        page,
        setPage,
        pageSize,
        setPageSize,
        totalPages,
        totalItems,
        onSubmitFilters,
        clearFilters,
        isLoading,
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
