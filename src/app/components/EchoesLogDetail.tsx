import { Link, useParams } from "react-router";
import { ChevronLeft, Play, Pause, Mic, FileText, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface EchoesSession {
  id: string;
  date: number;
  notes: string;
  recordings: { duration: number }[];
  jungianAnalysis?: string | null;
}

export function EchoesLogDetail() {
  const { id } = useParams();
  const [session, setSession] = useState<EchoesSession | null>(null);
  const [playingRecordingIndex, setPlayingRecordingIndex] = useState<number | null>(null);
  const [analysisExpanded, setAnalysisExpanded] = useState(false);

  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem("echoesSessions") || "[]");
    const found = storedSessions.find((s: EchoesSession) => s.id === id);
    setSession(found || null);
  }, [id]);

  const handleGenerateAnalysis = () => {
    if (!session) return;

    const analysis = `This session reveals several significant archetypal patterns. The initial settling into darkness suggests a descent into the unconscious, reminiscent of the night sea journey archetype. Your experience during the meditation may reflect an encounter with the Shadow—those aspects of the self that remain hidden from conscious awareness.

The recorded reflections point toward a liminal state, where the boundaries between conscious and unconscious become permeable. This aligns with Jung's concept of active imagination, where symbolic material from the collective unconscious emerges into awareness.

Notable themes include transformation, as indicated by the willingness to enter into meditative practice. The cyclical nature of the session—beginning, deepening, and emerging—mirrors the death-rebirth motif common in individuation processes.

Consider what symbols or feelings arose during your session. These may represent aspects of the anima/animus seeking integration, or compensatory images from the psyche attempting to restore balance to consciousness.`;

    // Update session with analysis
    const storedSessions = JSON.parse(localStorage.getItem("echoesSessions") || "[]");
    const updatedSessions = storedSessions.map((s: EchoesSession) =>
      s.id === session.id ? { ...s, jungianAnalysis: analysis } : s
    );
    localStorage.setItem("echoesSessions", JSON.stringify(updatedSessions));

    setSession({ ...session, jungianAnalysis: analysis });
    setAnalysisExpanded(true);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;

    return `${month} ${day}, ${year} at ${hours}:${minutesStr} ${ampm}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!session) {
    return (
      <div>
        <div className="app-subheader">
          <Link to="/echoes/log" className="app-subheader-back">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h2 className="app-subheader-title">Session Details</h2>
        </div>
        <div className="px-4 py-12 text-center text-t-text-muted">
          Session not found
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="app-subheader">
        <Link to="/echoes/log" className="app-subheader-back">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="app-subheader-title">Session Details</h2>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Date/Time */}
        <div className="mb-6">
          <h3 className="text-xl text-t-text-primary mb-1">Echoes Session</h3>
          <div className="text-sm text-t-text-muted">{formatDate(session.date)}</div>
        </div>

        {/* Audio Recordings */}
        {session.recordings.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-t-text-secondary">
              <Mic className="w-4 h-4" />
              <h4 className="font-medium">Audio Reflections</h4>
            </div>
            <div className="space-y-3">
              {session.recordings.map((recording, index) => (
                <div
                  key={index}
                  className="p-3 border border-t-border-subtle rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      className="p-2 text-t-text-tertiary active:text-t-text-primary"
                      onClick={() => setPlayingRecordingIndex(playingRecordingIndex === index ? null : index)}
                    >
                      {playingRecordingIndex === index ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <div className="flex-1 text-t-text-primary text-sm">
                      Recording {index + 1} — {formatTime(recording.duration)}
                    </div>
                  </div>
                  {/* Playback Progress Bar */}
                  {playingRecordingIndex === index && (
                    <div className="flex items-center gap-2 px-2">
                      <span className="app-caption w-10">0:00</span>
                      <div className="flex-1 h-1 bg-t-avatar-bg rounded-full overflow-hidden">
                        <motion.div
                          key={`playback-${index}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: recording.duration, ease: "linear" }}
                          className="h-full bg-blue-500"
                          onAnimationComplete={() => setPlayingRecordingIndex(null)}
                        />
                      </div>
                      <span className="app-caption w-10 text-right">
                        {formatTime(recording.duration)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {session.notes && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-t-text-secondary">
              <FileText className="w-4 h-4" />
              <h4 className="font-medium">Notes</h4>
            </div>
            <div className="p-4 bg-t-surface-subtle border border-t-border-subtle rounded-lg">
              <p className="app-body whitespace-pre-wrap">{session.notes}</p>
            </div>
          </div>
        )}

        {/* Jungian Analysis Accordion */}
        {session.jungianAnalysis && (
          <div className="mb-6">
            <button
              onClick={() => setAnalysisExpanded(!analysisExpanded)}
              className="w-full flex items-center justify-between p-3 bg-t-surface-subtle border border-t-border-subtle rounded-lg active:bg-t-surface-subtle"
            >
              <div className="flex items-center gap-2 text-t-text-secondary">
                <Lightbulb className="w-4 h-4" />
                <h4 className="font-medium">Jungian Interpretation</h4>
              </div>
              {analysisExpanded ? (
                <ChevronUp className="w-5 h-5 text-t-text-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-t-text-muted" />
              )}
            </button>
            {analysisExpanded && (
              <div className="p-4 border-x border-b border-t-border-subtle rounded-b-lg">
                <p className="app-body whitespace-pre-wrap">
                  {session.jungianAnalysis}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Philosophical Analysis Button - for sessions without analysis */}
        {!session.jungianAnalysis && (session.recordings.length > 0 || session.notes) && (
          <div className="mb-6">
            <button
              onClick={handleGenerateAnalysis}
              className="app-btn-secondary active:opacity-70"
            >
              Philosophical Analysis
            </button>
            <p className="app-caption mt-2 text-center px-4">
              Analyze audio recording and/or written notes through the lens of the brilliant philosopher Carl Jung.
            </p>
          </div>
        )}

        {/* Empty State */}
        {session.recordings.length === 0 && !session.notes && !session.jungianAnalysis && (
          <div className="text-center py-8 text-t-text-muted">
            No reflections saved for this session
          </div>
        )}
      </div>
    </div>
  );
}
