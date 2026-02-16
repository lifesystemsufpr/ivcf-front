import { useParams } from "react-router-dom";
import { participantsMock } from "../mocks";
import ParticipantHeader from "../components/ParticipantHeader";

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();

  const participant = participantsMock.find((p) => p.id === id);

  if (!participant) {
    return null;
  }

  return <ParticipantHeader participant={participant} />;
}
