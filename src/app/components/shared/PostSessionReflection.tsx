import { useState, useEffect } from "react";
import { Mic, Play, Pause, Trash2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";

export interface ReflectionData {
  notes: string;
  hasAudio: boolean;
  audioLength: number;
  jungianAnalysis: string;
}

interface PostSessionReflectionProps {
  heading: string;
  subheading: string;
  notesPlaceholder?: string;
  /**
   * "dark"   — white text, white-tinted elements (Echoes, Exchange dark backgrounds)
   * "system" — theme token classes (DreamRevisit, light/themed backgrounds)
   */
  scheme: "dark" | "system";
  /** Tailwind class(es) for the outer fixed wrapper background, e.g. "bg-gradient-to-b from-gray-900 to-black" */
  bgClassName: string;
  onSave: (data: ReflectionData) => void;
  onSkip: () => void;
  /** Override the sticky bottom bar gradient. Defaults to from-black for dark scheme, bg-t-surface for system. */
  stickyBgClass?: string;
}

export function PostSessionReflection({
  heading,
  subheading,
  notesPlaceholder = "What did you experience during this session?",
  scheme,
  bgClassName,
  onSave,
  onSkip,
  stickyBgClass,
}: PostSessionReflectionProps) {
  const dark = scheme === "dark";

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasAudioRecording, setHasAudioRecording] = useState(false);
  const [audioLength, setAudioLength] = useState(0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  // Notes
  const [notes, setNotes] = useState("");

  // Jungian analysis
  const [jungianAnalysis, setJungianAnalysis] = useState("");
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [analysisExpanded, setAnalysisExpanded] = useState(false);

  const hasContent = notes.trim().length > 0 || hasAudioRecording;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Recording timer
  useEffect(() => {
    if (!isRecording) return;
    const id = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setPlaybackTime((t) => {
        if (t >= audioLength) {
          setIsPlaying(false);
          return 0;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, audioLength]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasAudioRecording(true);
    setAudioLength(recordingTime);
    setRecordingTime(0);
  };

  const handleDeleteRecording = () => {
    setHasAudioRecording(false);
    setAudioLength(0);
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const handleTogglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (playbackTime >= audioLength) setPlaybackTime(0);
      setIsPlaying(true);
    }
  };

  const handleGenerateAnalysis = () => {
    setIsGeneratingAnalysis(true);
    setTimeout(() => {
      setJungianAnalysis(
        `This session reveals significant archetypal patterns. The descent into stillness mirrors the night sea journey archetype — a conscious engagement with what Jung called the unconscious underworld.\n\nThe reflections you've captured suggest a liminal state, where the boundary between conscious awareness and deeper psychic content becomes permeable. This is consistent with Jung's concept of active imagination.\n\nThe symbols and emotions that arose during your experience serve as messengers from the collective unconscious, offering insight into universal human patterns and your own individuation process. Consider which images felt most charged — these often mark areas of potential psychological integration.`
      );
      setIsGeneratingAnalysis(false);
    }, 2000);
  };

  const handleSave = () => {
    onSave({ notes, hasAudio: hasAudioRecording, audioLength, jungianAnalysis });
  };

  // ─── Derived style tokens ──────────────────────────────────────────────────

  const t = {
    heading:       dark ? "text-white text-2xl"                         : "text-t-text-primary text-2xl",
    subheading:    dark ? "text-white/50 text-sm"                       : "app-caption mt-1",
    sectionLabel:  dark ? "text-white/70 text-sm flex items-center gap-2 mb-3" : "app-field-label mb-2 flex items-center gap-2",
    recordBtn:     dark
      ? "w-full flex items-center justify-center gap-3 py-4 border border-white/30 rounded-lg text-white active:bg-white/10"
      : "w-full flex items-center justify-center gap-3 py-4 border border-t-border-medium rounded-xl text-t-text-secondary bg-t-surface-elevated active:bg-t-surface-subtle",
    recordingBox:  dark
      ? "w-full py-4 border border-blue-500/50 bg-blue-500/10 rounded-lg"
      : "w-full py-4 border border-t-border-medium bg-t-surface-elevated rounded-xl",
    recordingText: dark ? "text-center text-white text-sm mb-3"         : "text-center text-t-text-primary text-sm mb-3",
    stopBtn:       dark
      ? "px-6 py-2 bg-blue-500/30 border border-blue-400/50 text-white rounded-lg active:bg-blue-500/40"
      : "px-6 py-2 bg-t-btn-bg border border-t-border-medium text-t-btn-text rounded-xl active:opacity-80",
    playbackRow:   dark
      ? "w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg"
      : "w-full px-4 py-3 bg-t-surface-elevated border border-t-border-subtle rounded-xl",
    playBtn:       dark
      ? "flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center active:bg-white/30"
      : "flex-shrink-0 w-10 h-10 bg-t-avatar-bg rounded-full flex items-center justify-center active:bg-t-border-medium",
    playIcon:      dark ? "text-white"                                   : "text-t-text-secondary",
    progressTrack: dark ? "w-full h-1.5 bg-white/20 rounded-full overflow-hidden" : "w-full h-1.5 bg-t-avatar-bg rounded-full overflow-hidden",
    progressFill:  dark ? "h-full bg-blue-400 transition-all duration-300" : "h-full bg-t-text-tertiary transition-all duration-300",
    timeLabel:     dark ? "flex-shrink-0 text-white/70 text-sm font-mono"   : "flex-shrink-0 text-t-text-tertiary text-sm font-mono",
    deleteBtn:     dark ? "flex-shrink-0 p-2 text-white/50 active:text-white/80" : "flex-shrink-0 p-2 text-t-text-muted active:text-red-500",
    textarea:      dark
      ? "w-full h-32 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:border-white/40"
      : "app-textarea w-full h-32",
    analysisBtn: (done: boolean) => dark
      ? done
        ? "w-full px-4 py-3 bg-green-500/20 border border-green-400/40 text-white rounded-lg cursor-not-allowed"
        : "w-full px-4 py-3 bg-white/10 border border-white/30 text-white rounded-lg active:bg-white/15"
      : done
        ? "w-full px-4 py-3 bg-green-50 border border-green-400 text-green-700 rounded-xl cursor-not-allowed"
        : "w-full px-4 py-3 bg-t-surface-elevated border border-t-border-medium text-t-text-secondary rounded-xl active:bg-t-surface-subtle",
    analysisToggle: dark
      ? "w-full flex items-center justify-between px-4 py-3 bg-white/10 border border-white/30 rounded-lg active:bg-white/15"
      : "w-full flex items-center justify-between px-4 py-3 bg-t-surface-elevated border border-t-border-medium rounded-xl active:bg-t-surface-subtle",
    analysisBody: dark
      ? "mt-2 p-4 bg-white/5 border border-white/20 rounded-lg text-white/70 text-sm leading-relaxed space-y-2"
      : "mt-2 p-4 bg-t-surface-subtle border border-t-border-subtle rounded-xl text-t-text-secondary text-sm leading-relaxed space-y-2",
    analysisHeading: dark ? "text-white/90 text-sm font-semibold"       : "text-t-text-primary text-sm font-semibold",
    chevron:       dark ? "text-white/70"                                : "text-t-text-muted",
    analysisCaption: dark ? "text-white/60 text-xs leading-relaxed mb-3" : "app-caption leading-relaxed mb-3",
    stickyBar:     stickyBgClass
      ? `sticky bottom-0 left-0 right-0 ${stickyBgClass} px-4 pb-6 pt-8 z-20 space-y-2`
      : dark
      ? "sticky bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent px-4 pb-6 pt-8 z-20 space-y-2"
      : "sticky bottom-0 left-0 right-0 bg-t-surface border-t border-t-border-subtle px-4 py-4 z-20 space-y-2",
    saveBtn: (enabled: boolean) => dark
      ? enabled
        ? "w-full px-6 py-3 rounded-lg text-sm font-medium bg-white/20 border border-white/40 text-white active:bg-white/30"
        : "w-full px-6 py-3 rounded-lg text-sm font-medium bg-white/5 border border-white/20 text-white/40 cursor-not-allowed"
      : enabled
        ? "app-btn-primary w-full"
        : "w-full py-3.5 rounded-xl text-sm font-medium bg-t-surface-subtle text-t-text-placeholder cursor-not-allowed",
    skipBtn: dark
      ? "w-full px-6 py-3 rounded-lg text-sm font-medium bg-white/5 border border-white/20 text-white/60 active:bg-white/10"
      : "app-btn-secondary w-full",
  };

  return (
    <div className={`fixed inset-0 ${bgClassName} flex flex-col`}>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className={t.heading}>{heading}</div>
          <div className={t.subheading}>{subheading}</div>
        </div>

        {/* ── Audio Reflection ─────────────────────────────────────────────── */}
        <div className="w-full mb-6">
          <div className={t.sectionLabel}>
            <Mic className="w-4 h-4" />
            <span>Audio Reflection</span>
          </div>

          {!isRecording && !hasAudioRecording && (
            <button onClick={handleStartRecording} className={t.recordBtn}>
              <Mic className="w-5 h-5" />
              <span>Record Audio Reflection</span>
            </button>
          )}

          {isRecording && (
            <div className={t.recordingBox}>
              <div className={t.recordingText}>Recording {formatTime(recordingTime)}</div>
              <div className="flex justify-center">
                <button onClick={handleStopRecording} className={t.stopBtn}>
                  Stop & Save Recording
                </button>
              </div>
            </div>
          )}

          {hasAudioRecording && !isRecording && (
            <div className={t.playbackRow}>
              <div className="flex items-center gap-3">
                <button onClick={handleTogglePlayback} className={t.playBtn}>
                  {isPlaying ? (
                    <Pause className={`w-5 h-5 ${t.playIcon}`} />
                  ) : (
                    <Play className={`w-5 h-5 ${t.playIcon} ml-0.5`} />
                  )}
                </button>

                <div className="flex-1">
                  <div className={t.progressTrack}>
                    {isPlaying ? (
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: audioLength, ease: "linear" }}
                        className={t.progressFill}
                      />
                    ) : (
                      <div
                        className={t.progressFill}
                        style={{ width: `${audioLength > 0 ? (playbackTime / audioLength) * 100 : 0}%` }}
                      />
                    )}
                  </div>
                </div>

                <div className={t.timeLabel}>
                  {formatTime(playbackTime)} / {formatTime(audioLength)}
                </div>

                <button onClick={handleDeleteRecording} className={t.deleteBtn}>
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Notes ────────────────────────────────────────────────────────── */}
        <div className="w-full mb-6">
          <div className={t.sectionLabel}>
            <FileText className="w-4 h-4" />
            <span>Notes</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={notesPlaceholder}
            className={t.textarea}
          />
        </div>

        {/* ── Philosophical Analysis (only when there's content) ─────────── */}
        {hasContent && (
          <div className="w-full mb-6">
            <div className={`${t.sectionLabel} mb-1`}>
              Philosophical Analysis
            </div>
            <p className={t.analysisCaption}>
              Analyze your reflection through the lens of Carl Jung&apos;s theories of the unconscious.
            </p>
            <button
              onClick={handleGenerateAnalysis}
              disabled={isGeneratingAnalysis || jungianAnalysis.length > 0}
              className={t.analysisBtn(jungianAnalysis.length > 0)}
            >
              {isGeneratingAnalysis
                ? "Generating..."
                : jungianAnalysis.length > 0
                ? "Analysis Complete ✓"
                : "Generate Jungian Analysis"}
            </button>

            {jungianAnalysis && (
              <div className="mt-4">
                <button onClick={() => setAnalysisExpanded(!analysisExpanded)} className={t.analysisToggle}>
                  <h3 className={t.analysisHeading}>Jungian Interpretation</h3>
                  {analysisExpanded ? (
                    <ChevronUp className={`w-5 h-5 ${t.chevron}`} />
                  ) : (
                    <ChevronDown className={`w-5 h-5 ${t.chevron}`} />
                  )}
                </button>
                {analysisExpanded && (
                  <div className={t.analysisBody}>
                    {jungianAnalysis.split("\n").map(
                      (para, i) => para.trim() && <p key={i}>{para}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Sticky bottom buttons ──────────────────────────────────────────── */}
      <div className={t.stickyBar}>
        <button onClick={handleSave} disabled={!hasContent} className={t.saveBtn(hasContent)}>
          Save Experience
        </button>
        <button onClick={onSkip} className={t.skipBtn}>
          Skip for Now
        </button>
      </div>
    </div>
  );
}
