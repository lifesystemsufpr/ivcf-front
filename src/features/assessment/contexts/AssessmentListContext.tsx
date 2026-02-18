import { useContext, createContext, useState } from "react";
import { assessmentsListMock } from "../mocks";
import type { Assessment } from "../types";

export interface AssessmentListProviderValue {
  filteredAssessments: Assessment[];
  participantName: string;
  setParticipantName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onSubmitFilters: () => void;
}

export const AssessmentListContext = createContext<
  AssessmentListProviderValue | undefined
>(undefined);

export function AssessmentListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const assessmentsList = assessmentsListMock;

  const [participantName, setParticipantName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredAssessments, setFilteredAssessments] =
    useState(assessmentsList);

  const onSubmitFilters = () => {
    const filtered = assessmentsList.filter((assessment) => {
      const matchesName = assessment.participantName
        .toLowerCase()
        .includes(participantName.toLowerCase());
      const matchesStartDate = startDate
        ? new Date(assessment.date) >= new Date(startDate)
        : true;
      const matchesEndDate = endDate
        ? new Date(assessment.date) <= new Date(endDate)
        : true;

      return matchesName && matchesStartDate && matchesEndDate;
    });

    setFilteredAssessments(filtered);
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
