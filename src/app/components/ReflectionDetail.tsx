import { useNavigate, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Play, Pause, ChevronDown, ChevronUp } from "lucide-react";

export function ReflectionDetail() {
  const navigate = useNavigate();
  const { id, reflectionId } = useParams();
  const [reflection, setReflection] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [analysisExpanded, setAnalysisExpanded] = useState(false);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load reflection from localStorage
    const allReflections = JSON.parse(localStorage.getItem('exchangeReflections') || '{}');
    const parallelReflections = allReflections[id || ''] || [];
    const foundReflection = parallelReflections.find((r: any) => r.id === reflectionId);
    
    if (foundReflection) {
      setReflection(foundReflection);
    }
  }, [id, reflectionId]);

  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setPlaybackTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Auto-pause when playback reaches the end
  useEffect(() => {
    if (reflection && isPlaying && playbackTime >= reflection.audioLength) {
      setIsPlaying(false);
    }
  }, [playbackTime, reflection, isPlaying]);

  const handlePlayAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (reflection && playbackTime >= reflection.audioLength) {
        setPlaybackTime(0);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${month} ${day} — ${time}`;
  };

  if (!reflection) {
    return (
      <div className="min-h-screen bg-t-surface-subtle">
        <div className="bg-t-surface border-b border-t-border-subtle px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => navigate(`/profile/${id}`)} className="p-1 -ml-1">
            <ChevronLeft className="w-6 h-6 text-t-text-secondary" />
          </button>
          <h2 className="text-t-text-primary">Reflection</h2>
        </div>
        <div className="px-4 py-6">
          <p className="text-t-text-tertiary text-center">Reflection not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-t-surface-subtle">
      {/* Header */}
      <div className="bg-t-surface border-b border-t-border-subtle px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(`/profile/${id}`)} className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-t-text-secondary" />
        </button>
        <h2 className="text-t-text-primary">Exchange Reflection</h2>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Exchange Info */}
        <div>
          <p className="text-t-text-tertiary text-sm">{formatDate(reflection.date)}</p>
          <p className="text-t-text-tertiary text-sm">{reflection.duration} minute exchange</p>
        </div>

        {/* Audio Reflection */}
        {reflection.hasAudio && (
          <div>
            <h3 className="text-sm font-medium text-t-text-primary mb-3">Audio Reflection</h3>
            <div className="w-full px-4 py-3 bg-t-surface-elevated border border-t-border-subtle rounded-lg">
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <button
                  onClick={handlePlayAudio}
                  className="flex-shrink-0 w-10 h-10 bg-t-avatar-bg rounded-full flex items-center justify-center hover:bg-t-thumbnail-bg active:bg-gray-400 transition-colors"
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
                      className="h-full bg-gray-600 transition-all duration-300"
                      style={{ width: `${(playbackTime / reflection.audioLength) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Time Display */}
                <div className="flex-shrink-0 text-t-text-tertiary text-sm font-mono">
                  {formatTime(playbackTime)} / {formatTime(reflection.audioLength)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {reflection.notes && (
          <div>
            <h3 className="text-sm font-medium text-t-text-primary mb-3">Notes</h3>
            <div className="bg-t-surface-elevated border border-t-border-subtle rounded-lg px-4 py-3">
              <p className="text-t-text-secondary leading-relaxed whitespace-pre-wrap">{reflection.notes}</p>
            </div>
          </div>
        )}

        {/* Jungian Interpretation - Collapsible */}
        {reflection.jungianAnalysis && (
          <div>
            <button
              onClick={() => setAnalysisExpanded(!analysisExpanded)}
              className="w-full flex items-center justify-between bg-t-surface-elevated border border-t-border-subtle rounded-lg px-4 py-3 hover:bg-t-surface-subtle active:bg-t-surface-subtle transition-colors"
            >
              <h3 className="text-sm font-medium text-t-text-primary">Jungian Interpretation</h3>
              {analysisExpanded ? (
                <ChevronUp className="w-5 h-5 text-t-text-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-t-text-muted" />
              )}
            </button>

            {analysisExpanded && (
              <div className="mt-2 bg-t-surface-elevated border border-t-border-subtle rounded-lg px-4 py-3">
                <div className="text-t-text-secondary text-sm leading-relaxed space-y-2">
                  {reflection.jungianAnalysis.split('\\n').map((paragraph: string, idx: number) => (
                    paragraph.trim() && <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
