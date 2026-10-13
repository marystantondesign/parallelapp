import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";

export function ExchangeSwapTransition() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [phase, setPhase] = useState<"crossing" | "arrived">("crossing");

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("arrived");
          setTimeout(() => navigate(`/exchange-active/${id}`), 2500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate, id]);

  const progress = (60 - secondsLeft) / 60;

  return (
    <div className="relative w-full h-screen bg-purple-950 overflow-hidden flex flex-col items-center justify-center">

      {/* Background field — two overlapping orbs converging */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.25, 1.05],
            opacity: [0.25, 0.55, 0.35],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-700/40 to-violet-900/30 blur-3xl"
        />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-72 h-72 rounded-full border border-purple-500/20"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute w-52 h-52 rounded-full border border-purple-400/15"
        />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute w-36 h-36 rounded-full border border-purple-300/10"
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-300/50"
            style={{
              left: `${(i * 41 + 3) % 100}%`,
              top: `${(i * 67 + 11) % 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i * 0.3) % 3,
            }}
          />
        ))}
      </div>

      {/* Central ring pulse */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        className="absolute w-40 h-40 rounded-full border-2 border-purple-400/40"
      />
      <motion.div
        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
        className="absolute w-40 h-40 rounded-full border border-purple-300/20"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-xs">
        {phase === "crossing" ? (
          <>
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-8"
            >
              <div className="text-purple-300/60 text-xs tracking-[0.3em] uppercase mb-4">
                Exchange in Progress
              </div>
              <h1 className="text-white text-2xl font-light leading-snug">
                Consciousness<br />Crossing
              </h1>
            </motion.div>

            <p className="text-white/40 text-sm leading-relaxed mb-10">
              Remain still. Your consciousness is passing through the threshold.
              Do not move until the exchange is complete.
            </p>

            {/* Circular progress */}
            <div className="flex flex-col items-center gap-3">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke="rgba(168,85,247,0.15)"
                  strokeWidth="2"
                />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke="rgba(216,180,254,0.6)"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <span className="text-white/50 text-xs font-mono tabular-nums">
                {secondsLeft}s
              </span>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="text-purple-300/60 text-xs tracking-[0.3em] uppercase mb-4">
              Threshold Crossed
            </div>
            <h1 className="text-white text-2xl font-light mb-4">
              Exchange Active
            </h1>
            <p className="text-white/40 text-sm">
              Entering the parallel now...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
