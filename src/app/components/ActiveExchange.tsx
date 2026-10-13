import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { SessionControlBar } from "./shared/SessionControlBar";

const SAFETY_TOAST = "Safety reminder: Please remain seated or lying down. The swap back happens automatically.";

export function ActiveExchange() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(900);
  const [showEndModal, setShowEndModal] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Safety toast at 5-minute intervals (600s and 300s remaining)
  useEffect(() => {
    if (!isPaused && (timeLeft === 600 || timeLeft === 300)) {
      toast(SAFETY_TOAST, {
        duration: 8000,
        icon: "⚠️",
      });
    }
  }, [timeLeft, isPaused]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => navigate(`/exchange-reflection/${id}`), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate, id, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isComplete = timeLeft === 0;

  return (
    <div className="relative w-full h-screen bg-purple-950 overflow-hidden flex items-center justify-center">

      {/* Animated background */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-purple-300/30 rounded-full"
            style={{
              left: `${(i * 37 + 7) % 100}%`,
              top: `${(i * 53 + 13) % 100}%`,
              animation: `float ${8 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.7) % 5}s`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-3xl"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-80 h-80 border-2 border-purple-500/15 rounded-full"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-96 h-96 border border-purple-400/8 rounded-full"
          />
        </div>
      </div>

      {/* Session content */}
      {!isComplete ? (
        <SessionControlBar
          flashEnabled={flashEnabled}
          onFlashToggle={() => setFlashEnabled(!flashEnabled)}
          soundEnabled={soundEnabled}
          onSoundToggle={() => setSoundEnabled(!soundEnabled)}
          isPaused={isPaused}
          onPauseToggle={() => setIsPaused(!isPaused)}
          endLabel="End Exchange Early"
          onEndPress={() => setShowEndModal(true)}
        >
          <div className="text-center px-6 mb-4">
            <div className="text-purple-300/60 text-xs tracking-[0.3em] uppercase mb-3">
              Parallel Exchange Active
            </div>
            <h1 className="text-white text-2xl font-light mb-3">
              Living as Mila — Twin #{id}
            </h1>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              The exchange will end automatically after 15 minutes. Remain still and safe.
            </p>
          </div>
          <motion.div
            animate={{ opacity: isPaused ? 1 : [0.65, 1, 0.65] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-white text-7xl font-light tracking-wider tabular-nums mb-2"
          >
            {formatTime(timeLeft)}
          </motion.div>
          <p className="text-purple-300/40 text-xs mb-8">15 min exchange</p>
        </SessionControlBar>
      ) : (
        <div className="relative z-10 text-center px-6">
          <div className="text-purple-300/60 text-xs tracking-[0.3em] uppercase mb-4">
            Returning
          </div>
          <h1 className="text-white text-3xl font-light mb-6">Exchange Complete</h1>
          <p className="text-white/50 text-sm leading-relaxed">Returning to your reality...</p>
        </div>
      )}

      {/* End Exchange Confirmation Modal */}
      <AnimatePresence>
        {showEndModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 px-6"
            onClick={() => setShowEndModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-purple-950 border border-purple-700/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-white mb-3">End Exchange Early?</h2>
              <p className="text-white/55 text-sm leading-relaxed mb-6">
                Ending the exchange now will return both parallels to their original lives immediately.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndModal(false)}
                  className="flex-1 py-3.5 bg-white/8 text-white border border-white/15 rounded-xl text-sm font-medium active:bg-white/15"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate(`/exchange-reflection/${id}`)}
                  className="flex-1 py-3.5 bg-white/18 text-white border border-white/30 rounded-xl text-sm font-medium active:bg-white/25"
                >
                  End Exchange
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-40px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
