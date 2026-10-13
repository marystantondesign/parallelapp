import { Link } from "react-router";
import { ChevronLeft, Mic, FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface EchoesSession {
  id: string;
  date: number;
  notes: string;
  recordings: { duration: number }[];
  jungianAnalysis?: string | null;
}

export function EchoesLog() {
  const [sessions, setSessions] = useState<EchoesSession[]>([]);
  const [swipingId, setSwipingId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const storedSessions = JSON.parse(localStorage.getItem("echoesSessions") || "[]");
    // Sort by date, most recent first
    setSessions(storedSessions.sort((a: EchoesSession, b: EchoesSession) => b.date - a.date));
  };

  const handleDeleteSession = (id: string) => {
    const storedSessions = JSON.parse(localStorage.getItem("echoesSessions") || "[]");
    const updatedSessions = storedSessions.filter((s: EchoesSession) => s.id !== id);
    localStorage.setItem("echoesSessions", JSON.stringify(updatedSessions));
    loadSessions();
    setSwipingId(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;

    return {
      date: `${month} ${day}`,
      time: `${hours}:${minutesStr} ${ampm}`,
    };
  };

  const getPreview = (session: EchoesSession) => {
    if (session.recordings.length > 0 && session.notes) {
      return `${session.recordings.length} audio recording${session.recordings.length > 1 ? "s" : ""} + notes`;
    } else if (session.recordings.length > 0) {
      return `${session.recordings.length} audio recording${session.recordings.length > 1 ? "s" : ""}`;
    } else if (session.notes) {
      return session.notes.substring(0, 60) + (session.notes.length > 60 ? "..." : "");
    }
    return "No reflections saved";
  };

  const formatDuration = (session: EchoesSession) => {
    if (session.recordings.length === 0) return null;

    // Get total duration from all recordings
    const totalSeconds = session.recordings.reduce((sum, rec) => sum + rec.duration, 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div>
      {/* Sessions List */}
      <div className="divide-y divide-t-border-subtle">
        {sessions.length === 0 ? (
          <div className="px-4 py-12 text-center text-t-text-muted">
            <p>No Echoes sessions saved yet.</p>
            <p className="text-sm mt-2">Complete a session to see it here.</p>
          </div>
        ) : (
          sessions.map((session) => {
            const { date, time } = formatDate(session.date);
            return (
              <div key={session.id} className="relative overflow-hidden bg-t-surface-elevated">
                {/* Delete Trash Icon (appears on swipe) */}
                <div className="absolute right-4 top-0 bottom-0 flex items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                    className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center active:bg-red-600"
                    style={{
                      opacity: swipingId === session.id ? 1 : 0,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Swipeable Content */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: -70, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -35) {
                      setSwipingId(session.id);
                    } else {
                      setSwipingId(null);
                    }
                  }}
                  animate={{ x: swipingId === session.id ? -70 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-t-surface-elevated"
                >
                  <Link
                    to={`/echoes/log/${session.id}`}
                    className="block px-4 py-4 active:bg-t-surface-subtle"
                    onClick={(e) => {
                      if (swipingId === session.id) {
                        e.preventDefault();
                        setSwipingId(null);
                      }
                    }}
                  >
                    <div className="mb-2">
                      <h3 className="text-t-text-primary font-medium">Echoes Session</h3>
                      <div className="text-sm text-t-text-muted">
                        {date} — {time}
                      </div>
                    </div>
                    {formatDuration(session) && (
                      <div className="flex items-center gap-1.5 text-sm text-t-text-tertiary mb-1">
                        <Mic className="w-4 h-4" />
                        <span>{formatDuration(session)}</span>
                      </div>
                    )}
                    {session.notes && (
                      <div className="text-sm text-t-text-muted line-clamp-2">
                        {session.notes}
                      </div>
                    )}
                  </Link>
                </motion.div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
