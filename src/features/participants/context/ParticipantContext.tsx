import { createContext, useContext, useMemo } from "react";
import type { Participant } from "../types";
import { useListParticipants } from "../hooks/useListParticipants";
import { parseParticipantResponse } from "../utils";

export interface ParticipantContextValue {
  participants: Participant[];
}

export interface ParticipantProviderProps {
  children: React.ReactNode;
}

export const ParticipantContext = createContext<
  ParticipantContextValue | undefined
>(undefined);

export function ParticipantProvider({ children }: ParticipantProviderProps) {
  const { data } = useListParticipants({
    pageSize: 15,
  });

  const participants: Participant[] = useMemo(() => {
    if (!data) return [];
    return data.data.map((item) => parseParticipantResponse(item));
  }, [data]);

  const value: ParticipantContextValue = {
    participants,
  };

  return (
    <ParticipantContext.Provider value={value}>
      {children}
    </ParticipantContext.Provider>
  );
}

export function useParticipantContext() {
  const context = useContext(ParticipantContext);
  if (context === undefined) {
    throw new Error("useParticipant must be used within a ParticipantProvider");
  }
  return context;
}
