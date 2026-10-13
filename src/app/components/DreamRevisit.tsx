import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ChevronLeft, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SessionControlBar } from "./shared/SessionControlBar";
import { PostSessionReflection } from "./shared/PostSessionReflection";
import type { ReflectionData } from "./shared/PostSessionReflection";

type SessionState = "preparation" | "session" | "complete";

const DURATION_OPTIONS = [
  { label: "10 min", minutes: 10 },
  { label: "20 min", minutes: 20 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
];

export function DreamRevisit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionState, setSessionState] = useState<SessionState>("preparation");
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [dreamTitle, setDreamTitle] = useState("");

  useEffect(() => {
    const savedDreams = JSON.parse(localStorage.getItem("dreams") || "[]");
    const dream = savedDreams.find((d: { id: string }) => d.id === id);
    if (dream) setDreamTitle(dream.title);
  }, [id]);

  // Countdown timer — only runs once session is active and timeRemaining > 0
  useEffect(() => {
    if (sessionState === "session" && timeRemaining > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) { setSessionState("complete"); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionState, timeRemaining, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleBegin = () => {
    setTimeRemaining((durationMinutes ?? 10) * 60);
    setSessionState("session");
  };

  const handleEndSession = () => {
    setShowExitModal(false);
    setSessionState("complete");
  };

  const handleSaveExperience = (data: ReflectionData) => {
    const existing = JSON.parse(localStorage.getItem("dreamRevisitExperiences") || "[]");
    existing.push({
      id: Date.now().toString(),
      dreamId: id,
      dreamTitle,
      date: sessionStartTime,
      notes: data.notes,
      hasAudio: data.hasAudio,
      audioLength: data.audioLength,
      jungianAnalysis: data.jungianAnalysis || null,
    });
    localStorage.setItem("dreamRevisitExperiences", JSON.stringify(existing));
    navigate(`/dreams/${id}`);
  };

  const handleSkipForNow = () => {
    const existing = JSON.parse(localStorage.getItem("dreamRevisitExperiences") || "[]");
    existing.push({
      id: Date.now().toString(),
      dreamId: id,
      dreamTitle,
      date: sessionStartTime,
      notes: "",
      hasAudio: false,
      audioLength: 0,
      jungianAnalysis: null,
    });
    localStorage.setItem("dreamRevisitExperiences", JSON.stringify(existing));
    navigate(`/dreams/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-blue-950 flex flex-col">

      {/* ── Preparation State ──────────────────────────────────────────────── */}
      {sessionState === "preparation" && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-950 border-b border-blue-800/50">
            <Link to={`/dreams/${id}`} className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 active:bg-white/10">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h2 className="text-white font-medium text-base">Dream Revisit</h2>
            <div className="w-8" />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Intro text */}
              <div className="text-center space-y-3">
                <h1 className="text-2xl font-semibold text-white">
                  {dreamTitle ? `Revisit "${dreamTitle}"` : "Dream Revisit"}
                </h1>
                <p className="text-white/60 text-sm leading-relaxed">
                  Return to a previously recorded dream and explore its deeper meaning.
                  Find a quiet place, relax, and allow yourself to reconnect.
                </p>
              </div>

              {/* Duration selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-blue-400/70" />
                  <p className="text-blue-300/80 text-sm font-medium">Choose duration</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {DURATION_OPTIONS.map(({ label, minutes }) => (
                    <button
                      key={minutes}
                      onClick={() => setDurationMinutes(minutes)}
                      className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                        durationMinutes === minutes
                          ? "bg-white/20 border-white/60 text-white"
                          : "bg-transparent border-white/20 text-white/50 active:bg-white/10"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Begin button */}
              <button
                onClick={handleBegin}
                disabled={durationMinutes === null}
                className={`w-full py-4 rounded-full text-sm font-medium border-2 transition-all ${
                  durationMinutes !== null
                    ? "bg-white/15 border-white/40 text-white active:bg-white/25"
                    : "bg-transparent border-white/15 text-white/25 cursor-not-allowed"
                }`}
              >
                Begin Dream Revisit
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── Session State ──────────────────────────────────────────────────── */}
      {sessionState === "session" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 flex flex-col"
        >
          {/* Navy dreamlike background */}
          <div className="absolute inset-0 overflow-hidden bg-blue-950">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.35, 0.15], x: [-40, 40, -40], y: [0, -30, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-blue-700/40 to-indigo-800/40 blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2], x: [50, -50, 50], y: [20, -20, 20] }}
              transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-700/20 blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-950/30 blur-2xl"
            />
          </div>

          {/* SessionControlBar wraps timer content */}
          <SessionControlBar
            flashEnabled={flashEnabled}
            onFlashToggle={() => setFlashEnabled(!flashEnabled)}
            soundEnabled={soundEnabled}
            onSoundToggle={() => setSoundEnabled(!soundEnabled)}
            isPaused={isPaused}
            onPauseToggle={() => setIsPaused(!isPaused)}
            endLabel="End Dream Revisit"
            onEndPress={() => setShowExitModal(true)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl text-white/90 mb-2">Entering Dream State</h2>
              <p className="text-white/50 text-sm">Reconnecting with your recorded dream...</p>
            </motion.div>
            <motion.div
              animate={{ opacity: isPaused ? 1 : [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl text-white font-light tracking-wider mb-2"
            >
              {formatTime(timeRemaining)}
            </motion.div>
            <p className="text-white/30 text-xs mb-8">{durationMinutes} min session</p>
          </SessionControlBar>
        </motion.div>
      )}

      {/* ── Exit Confirmation Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6"
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-blue-900/90 backdrop-blur-md border border-blue-700/40 rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-semibold text-white mb-3">End Dream Revisit?</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Are you sure you want to end this session early?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl text-sm font-medium active:bg-white/15"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndSession}
                  className="flex-1 py-3.5 bg-white/20 text-white border border-white/40 rounded-xl text-sm font-medium active:bg-white/30"
                >
                  End Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Complete State ─────────────────────────────────────────────────── */}
      {sessionState === "complete" && (
        <PostSessionReflection
          heading="Dream Revisit Complete"
          subheading="Take a moment to reflect on what you experienced while revisiting this dream."
          notesPlaceholder="What did you experience during this revisit?"
          scheme="dark"
          bgClassName="bg-blue-950"
          stickyBgClass="bg-gradient-to-t from-blue-950 via-blue-950/90 to-transparent"
          onSave={handleSaveExperience}
          onSkip={handleSkipForNow}
        />
      )}
    </div>
  );
}
