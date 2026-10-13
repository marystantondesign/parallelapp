import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";

export function ExchangeSynchronization() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(60);
  const [synchronized, setSynchronized] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!synchronized) {
            setTimedOut(true);
            setTimeout(() => navigate(`/profile/${id}`), 3000);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate twin accepting at ~15s elapsed (45s remaining)
    const syncTimeout = setTimeout(() => {
      setSynchronized(true);
      setTimeout(() => navigate(`/exchange-transition/${id}`), 3000);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(syncTimeout);
    };
  }, [navigate, id, synchronized]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-screen bg-purple-950 overflow-hidden flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0">
        {/* Particles — deterministic positions */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-300/30 rounded-full"
            style={{
              left: `${(i * 41 + 7) % 100}%`,
              top: `${(i * 67 + 13) % 100}%`,
              animation: `float ${8 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.7) % 5}s`,
            }}
          />
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.15, 0, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
            className="w-64 h-64 border border-purple-400/30 rounded-full"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-52 h-52 border border-purple-500/15 rounded-full"
          />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!synchronized && !timedOut && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center px-6 max-w-md"
          >
            <div className="text-purple-300/60 text-xs tracking-[0.3em] uppercase mb-6">
              Preparing Exchange
            </div>
            <h1 className="text-white text-3xl font-light mb-8">
              Waiting for Twin #{id}
            </h1>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Waiting for Mila — Twin #{id} to activate the exchange.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-12">
              Both parallels must activate within one minute for the exchange to begin.
            </p>
            <div className="text-white text-6xl font-light tracking-wider mb-2 tabular-nums">
              {formatTime(timeLeft)}
            </div>
            <p className="text-purple-300/50 text-xs">acceptance window</p>
          </motion.div>
        )}

        {synchronized && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-6 max-w-md"
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-full border-2 border-purple-300/60 mx-auto mb-8"
            />
            <div className="text-purple-300/60 text-xs tracking-[0.3em] uppercase mb-4">
              Exchange Confirmed
            </div>
            <h1 className="text-white text-3xl font-light mb-6">Synchronised</h1>
            <p className="text-white/50 text-sm leading-relaxed">
              Initiating consciousness crossing...
            </p>
          </motion.div>
        )}

        {timedOut && (
          <motion.div
            key="timeout"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center px-6 max-w-md"
          >
            <div className="text-purple-300/50 text-xs tracking-[0.3em] uppercase mb-6">
              Exchange Timed Out
            </div>
            <h1 className="text-white text-3xl font-light mb-6">No Response</h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Mila — Twin #{id} did not activate the exchange in time.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-28px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
