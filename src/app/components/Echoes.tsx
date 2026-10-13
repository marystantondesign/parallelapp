import { Link } from "react-router";
import { Camera, Moon, AlertCircle, Smartphone, Clock, UserCheck, X, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const DURATION_OPTIONS = [
  { label: "30 min", minutes: 30, note: "Light trance" },
  { label: "60 min", minutes: 60, note: "Recommended" },
  { label: "90 min", minutes: 90, note: "Deep session" },
  { label: "120 min", minutes: 120, note: "Extended" },
];

const PREP_ITEMS = [
  { icon: Moon, text: "Must be used in a quiet, private space" },
  { icon: AlertCircle, text: "Lights should be turned off or dimmed" },
  { icon: Smartphone, text: "User should be lying down comfortably" },
  { icon: Camera, text: "Phone camera should be facing the user" },
];

export function Echoes() {
  const [hasEchoesSessions, setHasEchoesSessions] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [showTherapistModal, setShowTherapistModal] = useState(false);

  useEffect(() => {
    const check = () => {
      const sessions = JSON.parse(localStorage.getItem("echoesSessions") || "[]");
      setHasEchoesSessions(sessions.length > 0);
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return (
    // flex-col + min-h-full so the CTA pinned to the bottom via mt-auto
    <div className="flex flex-col min-h-full bg-zinc-900 px-4 pt-6">

      {/* Introduction */}
      <div className="mb-8">
        <p className="text-white/70 text-sm leading-relaxed mb-3">
          Echoes is an experimental feature currently in beta, available to select users.
        </p>
        <p className="text-white/70 text-sm leading-relaxed mb-3">
          This guided experience allows you to enter a meditative trance state where you may visualize scenes from your{" "}
          <span className="text-white font-medium">past lives within this universe</span>.
        </p>
        <p className="text-white/70 text-sm leading-relaxed">
          Through a combination of visual stimulation, tonal guidance, and meditative prompts, Echoes helps you access memories that exist beyond your current lifetime.
        </p>
      </div>

      {/* Preparation Requirements */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-white mb-4">Preparation Requirements</h2>
        <div className="space-y-3">
          {PREP_ITEMS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/8 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-white/65 text-sm leading-relaxed pt-2">{text}</p>
            </div>
          ))}

          {/* Therapist alternative row */}
          <button
            onClick={() => setShowTherapistModal(true)}
            className="w-full flex items-center gap-3 active:opacity-70"
          >
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/8 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex-1 text-left pt-2">
              <p className="text-white/65 text-sm leading-relaxed">
                Prefer a guided session?{" "}
                <span className="text-white/90 underline underline-offset-2">Connect with a therapist</span>
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Safety Note */}
      <div className="bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 mb-8">
        <p className="text-zinc-400 text-xs leading-relaxed">
          This experience uses camera flash and tonal frequencies. Do not use if you have photosensitivity or are prone to seizures.
        </p>
      </div>

      {/* Duration Selection */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-zinc-500" />
          <h2 className="text-base font-semibold text-white">Session Duration</h2>
        </div>
        <p className="text-zinc-500 text-xs leading-relaxed mb-4">
          Real past-life regression sessions often require 20–30 minutes to enter the trance state alone. Longer sessions allow deeper exploration.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {DURATION_OPTIONS.map(({ label, minutes, note }) => (
            <button
              key={minutes}
              onClick={() => setSelectedDuration(minutes)}
              className={`flex flex-col items-start px-4 py-3 rounded-xl border-2 transition-all text-left ${
                selectedDuration === minutes
                  ? "bg-white/12 border-white/50"
                  : "bg-zinc-800/50 border-zinc-700/60 active:bg-zinc-800"
              }`}
            >
              <span className={`text-base font-semibold ${selectedDuration === minutes ? "text-white" : "text-white/60"}`}>
                {label}
              </span>
              <span className={`text-xs mt-0.5 ${selectedDuration === minutes ? "text-white/60" : "text-zinc-600"}`}>
                {note}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* CTA — in normal document flow, pushed to bottom by mt-auto */}
      <div className="mt-auto pt-4 pb-6 space-y-2.5 bg-zinc-900">
        {selectedDuration ? (
          <Link
            to={`/echoes/session?duration=${selectedDuration}`}
            className="block w-full py-4 text-center bg-white/15 border-2 border-white/40 text-white font-medium text-sm rounded-full shadow-lg active:bg-white/25"
          >
            Explore Echoes · {selectedDuration} min
          </Link>
        ) : (
          <button
            disabled
            className="w-full py-4 text-center bg-zinc-800 border-2 border-zinc-700 text-zinc-500 font-medium text-sm rounded-full cursor-not-allowed"
          >
            Select a duration above
          </button>
        )}
        <button
          onClick={() => setShowTherapistModal(true)}
          className="w-full py-3 text-center bg-transparent border border-zinc-700 text-zinc-400 text-sm rounded-full active:bg-zinc-800"
        >
          Connect with a Therapist
        </button>
      </div>

      {/* Therapist Modal */}
      <AnimatePresence>
        {showTherapistModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-end justify-center z-50"
            onClick={() => setShowTherapistModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-zinc-900 border-t border-white/10 rounded-t-2xl px-5 pt-5 pb-10"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-white">Guided by a Therapist</h2>
                  <p className="text-zinc-400 text-sm mt-1">Work with a certified specialist</p>
                </div>
                <button onClick={() => setShowTherapistModal(false)} className="p-1 text-zinc-500 active:text-white mt-0.5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-white/65 text-sm leading-relaxed mb-6">
                A certified hypnotherapy or past-life regression therapist guides you through the entire experience in real time — deepening your trance, anchoring key memories, and helping you integrate what surfaces.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Certified Regression Therapist", desc: "Specializes in PLR and between-lives work" },
                  { label: "Hypnotherapist", desc: "Somatic and trance induction techniques" },
                  { label: "Jungian Analyst", desc: "Depth psychology and archetypal exploration" },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-start gap-3 px-3 py-3 bg-zinc-800/60 border border-white/8 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-zinc-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/90 text-sm font-medium">{label}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="w-full py-3.5 bg-white/12 border border-white/25 text-white text-sm font-medium rounded-xl active:bg-white/20 mb-3"
                onClick={() => setShowTherapistModal(false)}
              >
                Browse Certified Therapists
              </button>
              <button
                className="w-full py-3 text-zinc-500 text-sm active:text-white"
                onClick={() => setShowTherapistModal(false)}
              >
                Continue Self-Guided
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
