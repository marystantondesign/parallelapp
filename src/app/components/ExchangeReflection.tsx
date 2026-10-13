import { useNavigate, useParams } from "react-router";
import { PostSessionReflection } from "./shared/PostSessionReflection";
import type { ReflectionData } from "./shared/PostSessionReflection";

export function ExchangeReflection() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSaveExperience = (data: ReflectionData) => {
    const reflection = {
      id: Date.now().toString(),
      parallelId: id,
      date: new Date().toISOString(),
      duration: 15,
      hasAudio: data.hasAudio,
      audioLength: data.audioLength,
      notes: data.notes.trim(),
      jungianAnalysis: data.jungianAnalysis,
    };

    const existingReflections = JSON.parse(localStorage.getItem("exchangeReflections") || "{}");
    if (!existingReflections[id || ""]) existingReflections[id || ""] = [];
    existingReflections[id || ""].push(reflection);
    localStorage.setItem("exchangeReflections", JSON.stringify(existingReflections));

    navigate(`/profile/${id}`);
  };

  const handleSkip = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <PostSessionReflection
      heading="Exchange Complete"
      subheading={`You have returned to your original reality. Take a moment to reflect on the experience you just had with Mila — Twin #${id}.`}
      notesPlaceholder="Write about your experience..."
      scheme="dark"
      bgClassName="bg-purple-950"
      stickyBgClass="bg-gradient-to-t from-purple-950 via-purple-950/90 to-transparent"
      onSave={handleSaveExperience}
      onSkip={handleSkip}
    />
  );
}
