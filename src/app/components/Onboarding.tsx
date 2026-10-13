import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Eye } from "lucide-react";

type Screen = "welcome" | "create-account" | "resonance-intro" | "scan" | "processing" | "complete";

const RESONANCE_ID = "RS-82D6A-441";

const processingMessages = [
  "Analyzing ocular resonance...",
  "Generating resonance signature...",
  "Comparing calibration models...",
  "Establishing Continuum identity...",
  "Finalizing...",
];

const scanMessages = [
  { text: "Calibrating...", at: 0 },
  { text: "Capturing ocular resonance...", at: 6 },
  { text: "14 seconds remaining", at: 6 },
  { text: "8 seconds remaining", at: 12 },
  { text: "Finalizing capture...", at: 18 },
];

// Animated background orbs for welcome screen
function ConsciousnessField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0f4ff] via-white to-[#f8f6ff]" />
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${180 + i * 60}px`,
            height: `${180 + i * 60}px`,
            left: `${10 + i * 12}%`,
            top: `${8 + i * 8}%`,
            background: `radial-gradient(circle, ${
              ["rgba(180,200,255,0.18)", "rgba(200,180,255,0.14)", "rgba(160,220,255,0.12)", "rgba(220,200,255,0.16)", "rgba(180,240,220,0.10)"][i]
            } 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.08, 1],
            x: [0, i % 2 === 0 ? 12 : -12, 0],
            y: [0, i % 2 === 0 ? -8 : 8, 0],
          }}
          transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        />
      ))}
      {/* Concentric ring */}
      <motion.div
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[120, 160, 200, 240].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-blue-200/30"
            style={{
              width: size,
              height: size,
              left: -size / 2,
              top: -size / 2,
              opacity: 0.4 - i * 0.08,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// Scientific eye illustration for resonance intro
function EyeIllustration() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Outer rings */}
        {[96, 80, 64, 48].map((r, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-blue-300/40"
            style={{ width: r * 2, height: r * 2, left: 96 - r, top: 96 - r }}
            animate={{ opacity: [0.3 + i * 0.1, 0.6 + i * 0.1, 0.3 + i * 0.1] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}
        {/* Eye shape */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192" fill="none">
          <ellipse cx="96" cy="96" rx="60" ry="28" stroke="#93c5fd" strokeWidth="1.5" opacity="0.7" />
          <circle cx="96" cy="96" r="18" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.8" />
          <circle cx="96" cy="96" r="9" fill="rgba(96,165,250,0.15)" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="96" cy="96" r="3" fill="#3b82f6" opacity="0.6" />
          {/* Waveform lines */}
          {[-40, -20, 20, 40].map((offset, i) => (
            <line key={i} x1={96 + offset} y1="88" x2={96 + offset} y2="104" stroke="#93c5fd" strokeWidth="0.75" opacity="0.5" />
          ))}
          {/* Radiating lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1={96 + Math.cos(angle * Math.PI / 180) * 32}
              y1={96 + Math.sin(angle * Math.PI / 180) * 32}
              x2={96 + Math.cos(angle * Math.PI / 180) * 56}
              y2={96 + Math.sin(angle * Math.PI / 180) * 56}
              stroke="#bfdbfe"
              strokeWidth="0.75"
              opacity="0.5"
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

// Scan visual stimuli
function ScanVisuals({ progress }: { progress: number }) {
  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      {/* Background gradient pulse */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(147,197,253,0.15) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Concentric waveforms */}
      {[30, 55, 80, 105, 130].map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-blue-300"
          style={{ width: r * 2, height: r * 2 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1, 1.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: i * 0.5 }}
        />
      ))}
      {/* Center point */}
      <motion.div
        className="relative w-4 h-4 rounded-full bg-blue-400"
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Drifting light points */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-300"
          style={{ left: `${20 + i * 10}%`, top: `${30 + (i % 3) * 15}%` }}
          animate={{
            x: [0, Math.cos(i * 45 * Math.PI / 180) * 20, 0],
            y: [0, Math.sin(i * 45 * Math.PI / 180) * 20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
        />
      ))}
      {/* Progress arc */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(147,197,253,0.15)" strokeWidth="0.5" />
        <motion.circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="rgba(96,165,250,0.4)"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
          style={{ transformOrigin: "50px 50px", rotate: "-90deg" }}
        />
      </svg>
    </div>
  );
}

// Processing visualization
function ProcessingVisual() {
  return (
    <div className="relative w-40 h-40 mx-auto">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-blue-200"
          animate={{ scale: [1, 1.4 + i * 0.15, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: i * 0.5 }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Eye className="w-10 h-10 text-blue-300" />
        </motion.div>
      </div>
    </div>
  );
}

// --- Screens ---

function WelcomeScreen({ onCreateAccount, onLogin }: { onCreateAccount: () => void; onLogin: () => void }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ConsciousnessField />
      <div className="relative flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>
          <p className="text-xs font-semibold tracking-[3px] uppercase text-blue-400 mb-4">Continuum Network</p>
          <h1 className="text-[32px] font-bold text-t-text-primary leading-tight mb-6">Welcome to Parallel</h1>
          <p className="text-[15px] text-t-text-secondary leading-relaxed mb-8">
            Parallel is the first consumer application built on verified cross-continuum communication.
          </p>
          <p className="text-[13px] font-medium text-t-text-muted uppercase tracking-wide mb-4">Through the Continuum Network, Parallel allows you to:</p>
          <div className="space-y-3 text-left mb-12">
            {[
              { label: "Twins", desc: "communicate with verified parallel selves" },
              { label: "Dreams", desc: "record and revisit your dream archive" },
              { label: "Echoes", desc: "explore past life memories and sessions" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-none" />
                <p className="text-[14px] text-t-text-secondary leading-snug">
                  <span className="font-medium text-t-text-primary">{label}</span> — {desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }} className="w-full space-y-3">
          <button onClick={onCreateAccount} className="app-btn-primary">
            Create Account
          </button>
          <button onClick={onLogin} className="app-btn-secondary">
            Log In
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function CreateAccountScreen({ onNext }: { onNext: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showIdNote, setShowIdNote] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="min-h-screen bg-white flex flex-col">
      <div className="px-6 pt-14 pb-4">
        <p className="text-xs font-semibold tracking-[3px] uppercase text-blue-400 mb-2">Step 1 of 3</p>
        <h2 className="text-[26px] font-bold text-t-text-primary leading-tight">Create Account</h2>
      </div>
      <div className="flex-1 px-6 space-y-4 overflow-y-auto pb-8">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-t-text-muted mb-1.5 uppercase tracking-wide">First Name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Mereh" className="app-input w-full" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-t-text-muted mb-1.5 uppercase tracking-wide">Last Name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Choudary" className="app-input w-full" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-t-text-muted mb-1.5 uppercase tracking-wide">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="app-input w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium text-t-text-muted mb-1.5 uppercase tracking-wide">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="app-input w-full" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Google */}
        <button className="w-full py-3 border border-t-border-subtle rounded-xl text-[14px] text-t-text-primary font-medium flex items-center justify-center gap-2 active:bg-gray-50 bg-white">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.3-10.5 7.3-17.5z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.6v6.2C6.6 42.7 14.7 48 24 48z"/><path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.2-3 .7-4.3v-6.2H2.6C1 17.2 0 20.5 0 24s1 6.8 2.6 9.8l8.2-5z"/><path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.5 30.5 0 24 0 14.7 0 6.6 5.3 2.6 13.2l8.2 5C12.7 13.6 17.9 9.5 24 9.5z"/></svg>
          Continue with Google
        </button>

        {/* Government ID */}
        <div className="bg-t-surface border border-t-border-subtle rounded-xl p-4">
          <button onClick={() => setShowIdNote(!showIdNote)} className="w-full flex items-center justify-between text-left">
            <span className="text-[13px] font-medium text-t-text-primary">Verify with Government ID</span>
            <span className="text-xs text-blue-400">{showIdNote ? "Hide" : "Optional"}</span>
          </button>
          {showIdNote && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-[12px] text-t-text-muted leading-relaxed mt-3">
              Government ID verification is used solely to confirm your identity within this reality. It is not how Parallel identifies your counterparts in neighboring realities — that process relies exclusively on your Ocular Resonance Signature, established in the next step.
            </motion.p>
          )}
        </div>

        <button onClick={onNext} className="app-btn-primary mt-4">
          Continue
        </button>
      </div>
    </motion.div>
  );
}

function ResonanceIntroScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="min-h-screen bg-white flex flex-col px-6">
      <div className="pt-14 pb-6">
        <p className="text-xs font-semibold tracking-[3px] uppercase text-blue-400 mb-2">Step 2 of 3</p>
        <h2 className="text-[26px] font-bold text-t-text-primary leading-tight">Establish Your{"\n"}Resonance Signature</h2>
      </div>

      <div className="flex-1 flex flex-col">
        <EyeIllustration />

        <div className="mt-8 space-y-5">
          <p className="text-[14px] text-t-text-secondary leading-relaxed">
            Names, government records, and even personal histories can differ across neighboring realities.
          </p>
          <p className="text-[14px] text-t-text-secondary leading-relaxed">
            Parallel identifies individuals using an <span className="font-medium text-t-text-primary">Ocular Resonance Signature</span> — a stable biometric pattern derived from how each person's visual system responds to calibrated optical stimuli.
          </p>
          <div className="bg-t-surface border border-t-border-subtle rounded-2xl p-4">
            <p className="text-[12px] text-t-text-muted leading-relaxed">
              Research conducted by <span className="font-medium text-t-text-secondary">Vera Continuum Laboratories</span> has demonstrated that this resonance signature remains remarkably consistent across neighboring realities, making it the most reliable method for establishing verified cross-continuum identity.
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8 pb-8">
          <button onClick={onNext} className="app-btn-primary">
            Begin 20-Second Scan
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ScanScreen({ onComplete }: { onComplete: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const duration = 20;

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(e => {
        if (e >= duration) { clearInterval(timer); onComplete(); return e; }
        return e + 0.1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const msgs = [
      { at: 0, i: 0 }, { at: 6, i: 1 }, { at: 12, i: 2 }, { at: 16, i: 3 },
    ];
    const current = msgs.filter(m => elapsed >= m.at).pop();
    if (current) setMsgIndex(current.i);
  }, [Math.floor(elapsed)]);

  const remaining = Math.max(0, Math.ceil(duration - elapsed));
  const progress = elapsed / duration;

  const msgs = ["Calibrating...", "Capturing ocular resonance...", `${remaining} seconds remaining`, "Finalizing capture..."];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="min-h-screen bg-white flex flex-col items-center justify-between py-16 px-6">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[3px] uppercase text-blue-400 mb-2">Step 3 of 3</p>
        <h2 className="text-[22px] font-bold text-t-text-primary">Ocular Resonance Scan</h2>
        <p className="text-[13px] text-t-text-muted mt-1">Look directly at the center point</p>
      </div>

      <div className="w-full">
        <ScanVisuals progress={progress} />
      </div>

      <div className="text-center space-y-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="text-[14px] font-medium text-t-text-secondary"
          >
            {msgs[msgIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-t-text-muted">{remaining}s remaining</p>
      </div>
    </motion.div>
  );
}

function ProcessingScreen({ onComplete }: { onComplete: () => void }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timers = processingMessages.map((_, i) =>
      setTimeout(() => setMsgIndex(i), i * 1200)
    );
    const done = setTimeout(onComplete, processingMessages.length * 1200 + 400);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-12">
      <ProcessingVisual />
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="text-[15px] font-medium text-t-text-secondary"
          >
            {processingMessages[msgIndex]}
          </motion.p>
        </AnimatePresence>
        <motion.div className="flex justify-center gap-1.5 mt-4">
          {processingMessages.map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              animate={{ backgroundColor: i <= msgIndex ? "#3b82f6" : "#e5e7eb" }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function CompleteScreen({ onEnter }: { onEnter: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(RESONANCE_ID).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="min-h-screen bg-white flex flex-col items-center justify-between px-6 py-16">
      <div />
      <div className="text-center w-full">
        {/* Resonance ring */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-blue-200"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1 + i * 0.25, opacity: 0.4 - i * 0.1 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Eye className="w-7 h-7 text-blue-400" />
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <p className="text-xs font-semibold tracking-[3px] uppercase text-blue-400 mb-3">Continuum Network</p>
          <h2 className="text-[28px] font-bold text-t-text-primary mb-2">Resonance Established</h2>
          <p className="text-[13px] text-t-text-muted mb-8">Your identity has been registered.</p>

          {/* Signature box */}
          <div className="bg-t-surface border border-t-border-subtle rounded-2xl p-5 mb-6">
            <p className="text-[11px] font-semibold tracking-[2px] uppercase text-t-text-muted mb-2">Resonance Signature</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-[22px] font-mono font-bold text-t-text-primary tracking-widest">{RESONANCE_ID}</span>
              <button onClick={handleCopy} className="p-1.5 rounded-lg text-t-text-muted hover:text-blue-400 active:bg-gray-100">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-[13px] text-t-text-muted leading-relaxed">
            Your Resonance Signature has been registered with the Continuum Network. This signature — not your name or identity documents — is used to establish verified communication with your parallel selves across neighboring realities.
          </p>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        onClick={onEnter}
        className="app-btn-primary"
      >
        Enter Parallel
      </motion.button>
    </motion.div>
  );
}

export function Onboarding() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const navigate = useNavigate();

  const go = (s: Screen) => setScreen(s);

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <AnimatePresence mode="wait">
        {screen === "welcome" && (
          <motion.div key="welcome" exit={{ opacity: 0 }}>
            <WelcomeScreen onCreateAccount={() => go("create-account")} onLogin={() => navigate("/twins")} />
          </motion.div>
        )}
        {screen === "create-account" && (
          <motion.div key="create">
            <CreateAccountScreen onNext={() => go("resonance-intro")} />
          </motion.div>
        )}
        {screen === "resonance-intro" && (
          <motion.div key="resonance-intro">
            <ResonanceIntroScreen onNext={() => go("scan")} />
          </motion.div>
        )}
        {screen === "scan" && (
          <motion.div key="scan">
            <ScanScreen onComplete={() => go("processing")} />
          </motion.div>
        )}
        {screen === "processing" && (
          <motion.div key="processing">
            <ProcessingScreen onComplete={() => go("complete")} />
          </motion.div>
        )}
        {screen === "complete" && (
          <motion.div key="complete">
            <CompleteScreen onEnter={() => navigate("/")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
