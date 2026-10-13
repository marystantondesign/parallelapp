import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SessionControlBar } from "./shared/SessionControlBar";
import { PostSessionReflection } from "./shared/PostSessionReflection";
import type { ReflectionData } from "./shared/PostSessionReflection";

const guidanceText = [
  "Settle into a comfortable position.",
  "Allow the room to remain dark and quiet.",
  "The camera flash and tones will help guide you into a meditative state.",
];

type SessionState = "guidance" | "session" | "complete";

export function EchoesSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const durationMinutes = parseInt(searchParams.get("duration") || "60", 10);

  const [sessionState, setSessionState] = useState<SessionState>("guidance");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  // Guidance text display
  useEffect(() => {
    if (sessionState === "guidance" && currentIndex < guidanceText.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, guidanceText[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, sessionState]);

  // Transition to session after guidance completes
  useEffect(() => {
    if (sessionState === "guidance" && currentIndex === guidanceText.length) {
      const timer = setTimeout(() => setSessionState("session"), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, sessionState]);

  // Countdown timer
  useEffect(() => {
    if (sessionState === "session" && timeRemaining > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setSessionState("complete");
            return 0;
          }
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

  const handleSaveExperience = (data: ReflectionData) => {
    const existingSessions = JSON.parse(localStorage.getItem("echoesSessions") || "[]");
    existingSessions.push({
      id: Date.now().toString(),
      date: sessionStartTime,
      durationMinutes,
      notes: data.notes,
      recordings: data.hasAudio ? [{ duration: data.audioLength }] : [],
      jungianAnalysis: data.jungianAnalysis || null,
    });
    localStorage.setItem("echoesSessions", JSON.stringify(existingSessions));
    navigate("/echoes/log");
  };

  const handleSkipForNow = () => {
    const existingSessions = JSON.parse(localStorage.getItem("echoesSessions") || "[]");
    existingSessions.push({
      id: Date.now().toString(),
      date: sessionStartTime,
      durationMinutes,
      notes: "",
      recordings: [],
      jungianAnalysis: null,
    });
    localStorage.setItem("echoesSessions", JSON.stringify(existingSessions));
    navigate("/echoes/log");
  };

  const enterSession = () => {
    setSessionState("session");
    setCurrentIndex(guidanceText.length);
  };

  return (
    <div className="fixed inset-0 bg-zinc-900 flex flex-col">

      {/* ── Guidance State ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {sessionState === "guidance" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <Link to="/echoes" className="absolute top-4 right-4 z-20 p-2 text-white/70 active:text-white">
              <X className="w-6 h-6" />
            </Link>

            <button
              onClick={enterSession}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 px-6 py-2 text-white/80 text-sm border border-white/20 bg-white/8 rounded-full active:bg-white/15"
            >
              Skip Intro
            </button>

            {/* Charcoal ambient blobs */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="w-96 h-96 rounded-full bg-gradient-to-br from-zinc-700/40 to-zinc-600/30 blur-3xl"
              />
              <motion.div
                animate={{ scale: [1.15, 1, 1.15], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-zinc-500/20 to-zinc-800/30 blur-3xl"
              />
            </div>

            {/* Guidance lines */}
            <div className="relative z-10 w-full max-w-[390px] px-8 absolute bottom-40">
              <div className="space-y-3">
                {displayedLines.slice(-3).map((line, index) => (
                  <motion.div
                    key={`${line}-${displayedLines.length - 3 + index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1 - index * 0.3, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                  >
                    <p className="text-white/90 text-lg leading-relaxed">{line}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pulse dot */}
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/60"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Session State ──────────────────────────────────────────────────── */}
      {sessionState === "session" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 flex flex-col"
        >
          {/* Charcoal breathing background */}
          <div className="absolute inset-0 overflow-hidden bg-zinc-900">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-zinc-700/30 to-zinc-800/40"
            />
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 8, 0], x: [-20, 20, -20] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[420px] h-[420px] rounded-full bg-zinc-600/20 blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.15, 1, 1.15], opacity: [0.15, 0.35, 0.15], y: [-30, 30, -30] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] rounded-full bg-zinc-500/15 blur-3xl"
            />
          </div>

          {/* Shared session control bar */}
          <SessionControlBar
            flashEnabled={flashEnabled}
            onFlashToggle={() => setFlashEnabled(!flashEnabled)}
            soundEnabled={soundEnabled}
            onSoundToggle={() => setSoundEnabled(!soundEnabled)}
            isPaused={isPaused}
            onPauseToggle={() => setIsPaused(!isPaused)}
            endLabel="Stop Echoes Transmission"
            onEndPress={() => setShowStopModal(true)}
          >
            <motion.div
              animate={{ opacity: isPaused ? [1, 1, 1] : [0.65, 1, 0.65] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl text-white font-light tracking-wider mb-2"
            >
              {formatTime(timeRemaining)}
            </motion.div>
            <p className="text-white/30 text-xs mb-8">{durationMinutes} min session</p>
          </SessionControlBar>
        </motion.div>
      )}

      {/* ── Stop Confirmation Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showStopModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6"
            onClick={() => setShowStopModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-800/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-semibold text-white mb-3">Stop Transmission?</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                End the Echoes session and move to reflection?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStopModal(false)}
                  className="flex-1 py-3.5 bg-white/8 text-white border border-white/15 rounded-xl text-sm font-medium active:bg-white/15"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setShowStopModal(false); setSessionState("complete"); }}
                  className="flex-1 py-3.5 bg-white/18 text-white border border-white/30 rounded-xl text-sm font-medium active:bg-white/25"
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
          heading="Transmission Complete"
          subheading="Your session has ended. Reflect on your experience below."
          notesPlaceholder="What did you experience during this session?"
          scheme="dark"
          bgClassName="bg-zinc-900"
          stickyBgClass="bg-gradient-to-t from-zinc-900 via-zinc-900/90 to-transparent"
          onSave={handleSaveExperience}
          onSkip={handleSkipForNow}
        />
      )}
    </div>
  );
}
