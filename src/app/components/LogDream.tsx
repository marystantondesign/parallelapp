import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { ChevronLeft, Mic, Play, Pause, Trash2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";

export function LogDream() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasAudioRecording, setHasAudioRecording] = useState(false);
  const [audioLength, setAudioLength] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [jungianAnalysis, setJungianAnalysis] = useState("");
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [analysisExpanded, setAnalysisExpanded] = useState(false);

  const hasContent = description.trim().length > 0 || hasAudioRecording;

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRecording]);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= audioLength) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPlaying, audioLength]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
    setPlaybackTime(0);
    setIsPlaying(false);
  };

  const handlePlayAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (playbackTime === 0) {
        setPlaybackTime(0);
      }
      setIsPlaying(true);
    }
  };

  const handleGenerateJungianAnalysis = () => {
    setIsGeneratingAnalysis(true);

    // Simulate analysis generation
    setTimeout(() => {
      const analysis = `This dream reveals significant archetypal patterns emerging from your unconscious. The imagery suggests a confrontation with the Shadow—those hidden aspects of your psyche seeking integration into consciousness.

The symbols present in your dream indicate a transformation process, common in Jung's concept of individuation. This represents the journey toward wholeness and self-realization.

Notable archetypal themes include the Hero's Journey, where obstacles represent internal conflicts requiring resolution. The unconscious is presenting material that demands attention and integration.

Consider the emotional tone of the dream. Strong emotions often signal areas where unconscious desires or fears are seeking expression. This dream may be compensating for one-sided conscious attitudes, attempting to restore psychological balance.`;

      setJungianAnalysis(analysis);
      setIsGeneratingAnalysis(false);
      setAnalysisExpanded(true);
    }, 2000);
  };

  const handleSaveDream = () => {
    const existingDreams = JSON.parse(localStorage.getItem("dreams") || "[]");

    const newDream = {
      id: Date.now().toString(),
      title: title || "Untitled Dream",
      date,
      description,
      hasAudio: hasAudioRecording,
      audioLength: hasAudioRecording ? audioLength : 0,
      jungianAnalysis: jungianAnalysis || null,
      timestamp: Date.now(),
    };

    existingDreams.unshift(newDream);
    localStorage.setItem("dreams", JSON.stringify(existingDreams));

    navigate("/dreams");
  };

  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-t-app-bg">
      {/* Header */}
      <div className="app-subheader">
        <Link to="/dreams" className="app-subheader-back">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="app-subheader-title">Log Dream</h2>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24 space-y-6">
        {/* Dream Title */}
        <div>
          <label className="app-field-label">
            Dream Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this dream"
            className="app-input w-full"
          />
        </div>

        {/* Date */}
        <div>
          <label className="app-field-label">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={maxDate}
            className="app-input w-full"
          />
        </div>

        {/* Dream Description */}
        <div>
          <label className="app-field-label">
            Dream Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your dream in detail..."
            className="app-textarea w-full h-40"
          />
        </div>

        {/* Audio Recording */}
        <div>
          <label className="app-field-label">
            Audio Recording
          </label>

          {!isRecording && !hasAudioRecording && (
            <button
              onClick={handleStartRecording}
              className="w-full flex items-center justify-center gap-3 py-4 border border-t-border-medium rounded-xl text-t-text-secondary bg-t-surface-elevated hover:bg-t-surface-subtle active:bg-t-surface-subtle"
            >
              <Mic className="w-5 h-5" />
              <span>Record Dream</span>
            </button>
          )}

          {isRecording && (
            <div className="w-full py-4 border border-t-border-medium bg-t-surface-elevated rounded-xl">
              <div className="text-center text-t-text-primary text-sm mb-3">
                Recording {formatTime(recordingTime)}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleStopRecording}
                  className="px-6 py-2 bg-t-btn-bg border border-t-border-medium text-t-btn-text rounded-xl hover:opacity-90 active:opacity-80"
                >
                  Stop & Save Recording
                </button>
              </div>
            </div>
          )}

          {hasAudioRecording && (
            <div className="w-full px-4 py-3 bg-t-surface-elevated border border-t-border-subtle rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                {/* Play/Pause Button */}
                <button
                  onClick={handlePlayAudio}
                  className="flex-shrink-0 w-10 h-10 bg-t-avatar-bg rounded-full flex items-center justify-center hover:bg-t-border-medium active:bg-t-border-medium transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-t-text-secondary" />
                  ) : (
                    <Play className="w-5 h-5 text-t-text-secondary ml-0.5" />
                  )}
                </button>

                {/* Progress Bar */}
                <div className="flex-1">
                  <div className="w-full h-1.5 bg-t-avatar-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-t-text-tertiary transition-all duration-300"
                      style={{ width: `${(playbackTime / audioLength) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Time Display */}
                <div className="flex-shrink-0 text-t-text-tertiary text-sm font-mono">
                  {formatTime(playbackTime)} / {formatTime(audioLength)}
                </div>

                {/* Delete Button */}
                <button
                  onClick={handleDeleteRecording}
                  className="flex-shrink-0 p-2 text-t-text-muted hover:text-red-500 active:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Philosophical Analysis Section */}
        {hasContent && (
          <div>
            <label className="app-field-label">
              Philosophical Analysis
            </label>
            <p className="app-caption leading-relaxed mb-3">
              Analyze your dream through the lens of Carl Jung's theories of the unconscious.
            </p>
            <button
              onClick={handleGenerateJungianAnalysis}
              disabled={isGeneratingAnalysis || jungianAnalysis.length > 0}
              className={`w-full px-4 py-3 ${
                jungianAnalysis.length > 0
                  ? 'bg-green-50 border-green-400 text-green-700 cursor-not-allowed'
                  : 'bg-t-surface-elevated border-t-border-medium text-t-text-secondary hover:bg-t-surface-subtle active:bg-t-surface-subtle'
              } border rounded-xl transition-colors text-sm font-medium`}
            >
              {isGeneratingAnalysis
                ? 'Generating...'
                : jungianAnalysis.length > 0
                ? 'Analysis Complete ✓'
                : 'Generate Jungian Analysis'}
            </button>

            {/* Jungian Interpretation - Collapsible */}
            {jungianAnalysis && (
              <div className="mt-4">
                <button
                  onClick={() => setAnalysisExpanded(!analysisExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-t-surface-elevated border border-t-border-medium rounded-xl hover:bg-t-surface-subtle active:bg-t-surface-subtle transition-colors"
                >
                  <h3 className="text-t-text-primary text-sm font-semibold">Jungian Interpretation</h3>
                  {analysisExpanded ? (
                    <ChevronUp className="w-5 h-5 text-t-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-t-text-muted" />
                  )}
                </button>

                {analysisExpanded && (
                  <div className="mt-2 p-4 bg-t-surface-subtle border border-t-border-subtle rounded-xl">
                    <div className="text-t-text-secondary text-sm leading-relaxed space-y-2">
                      {jungianAnalysis.split('\n').map((paragraph, idx) => (
                        paragraph.trim() && <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-t-surface border-t border-t-border-subtle px-4 py-4 z-20">
        <button
          onClick={handleSaveDream}
          disabled={!hasContent}
          className={`w-full py-3.5 rounded-xl transition-colors text-sm font-medium ${
            hasContent
              ? 'app-btn-primary'
              : 'bg-t-surface-subtle text-t-text-placeholder cursor-not-allowed'
          }`}
        >
          Save Dream
        </button>
      </div>
    </div>
  );
}
