import { createContext, useContext } from "react";
import type { Participant } from "../types";
import { participantsMock } from "../mocks";

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
  const participants: Participant[] = participantsMock;

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
