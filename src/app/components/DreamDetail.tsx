import { useParams, Link } from "react-router";
import { ChevronLeft, Play, Pause, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const NAVY = "bg-blue-950";

const dreamData: Record<string, { title: string; date: string; description: string; symbols: string[]; analysis: string }> = {
  "1": {
    title: "The Blue River",
    date: "March 4, 2026",
    description: "I was standing on the edge of a vast blue river that seemed to stretch endlessly in both directions. The water was impossibly clear, and I could see all the way to the bottom despite its depth. There were no sounds except for a gentle humming that seemed to come from the water itself. I felt compelled to step into it, and when I did, the water was warm and welcoming.",
    symbols: ["Water — emotions, unconscious", "Blue — tranquility, depth", "River — journey, flow of life", "Clarity — understanding, revelation"],
    analysis: "The river represents your emotional journey and the flow of your unconscious mind. The clarity of the water suggests you are gaining insight into aspects of yourself that were previously hidden. The warm, welcoming nature indicates acceptance of these discoveries.",
  },
  "2": {
    title: "Garden of Glass",
    date: "March 1, 2026",
    description: "Walking through a garden where all the plants and flowers were made of delicate glass. Each step required careful attention. Sunlight passed through the glass leaves, creating rainbow patterns on the ground. Despite their fragility, the glass plants swayed gently in an invisible breeze.",
    symbols: ["Glass — fragility, transparency", "Garden — growth, cultivation", "Rainbow — hope, spectrum of emotion", "Breeze — change, unseen forces"],
    analysis: "This dream speaks to the delicate balance you're maintaining in your life. The glass garden represents something precious but fragile that you're carefully tending—perhaps a new relationship, creative project, or aspect of personal growth.",
  },
};

export function DreamDetail() {
  const { id } = useParams();
  const [dream, setDream] = useState<{
    title: string;
    date: string;
    description: string;
    symbols?: string[];
    analysis?: string;
    jungianAnalysis?: string;
    hasAudio?: boolean;
    audioLength?: number;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  useEffect(() => {
    const savedDreams = JSON.parse(localStorage.getItem("dreams") || "[]");
    const saved = savedDreams.find((d: { id: string }) => d.id === id);
    if (saved) {
      setDream({
        title: saved.title,
        date: formatDate(saved.date),
        description: saved.description,
        hasAudio: saved.hasAudio,
        audioLength: saved.audioLength,
        jungianAnalysis: saved.jungianAnalysis,
      });
    } else {
      setDream(dreamData[id || "1"] || dreamData["1"]);
    }
  }, [id]);

  useEffect(() => {
    if (isPlaying && dream?.audioLength) {
      const timer = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= (dream.audioLength ?? 0)) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, dream]);

  function formatDate(ds: string) {
    const d = new Date(ds);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  if (!dream) return null;

  return (
    <div className={`min-h-full ${NAVY} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-950 border-b border-blue-800/50 sticky top-0 z-10">
        <Link to="/dreams" className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 active:bg-white/10">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-white font-medium text-base">Dream Detail</h2>
        <div className="w-8" />
      </div>

      {/* Hero — dark gradient over a navy fill */}
      <div className="relative w-full h-52 bg-gradient-to-br from-blue-900 via-blue-800/60 to-blue-950 flex-none overflow-hidden">
        {/* Ambient decorative blobs */}
        <div className="absolute w-64 h-64 rounded-full bg-blue-600/20 blur-3xl -top-16 -right-16" />
        <div className="absolute w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl bottom-0 left-0" />
        {/* Dream title overlay */}
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-5 bg-gradient-to-t from-blue-950/80 to-transparent">
          <h1 className="text-2xl font-semibold text-white leading-tight">{dream.title}</h1>
          <p className="text-blue-200/70 text-sm mt-1">{dream.date}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 space-y-7 pb-28">

        {/* Audio Recording */}
        {dream.hasAudio && dream.audioLength && (
          <section>
            <p className="text-blue-300/70 text-[11px] font-semibold uppercase tracking-widest mb-3">Audio Recording</p>
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-900/40 border border-blue-700/30 rounded-xl">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center active:bg-white/20"
              >
                {isPlaying
                  ? <Pause className="w-5 h-5 text-white" />
                  : <Play className="w-5 h-5 text-white ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="w-full h-1.5 bg-blue-800/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 transition-all duration-300"
                    style={{ width: `${(playbackTime / dream.audioLength) * 100}%` }}
                  />
                </div>
              </div>
              <span className="flex-shrink-0 text-blue-200/60 text-xs font-mono">
                {formatTime(playbackTime)} / {formatTime(dream.audioLength)}
              </span>
            </div>
          </section>
        )}

        {/* Description */}
        <section>
          <p className="text-blue-300/70 text-[11px] font-semibold uppercase tracking-widest mb-3">Description</p>
          <p className="text-white/80 text-sm leading-relaxed">{dream.description}</p>
        </section>

        {/* Symbols */}
        {dream.symbols && dream.symbols.length > 0 && (
          <section>
            <p className="text-blue-300/70 text-[11px] font-semibold uppercase tracking-widest mb-3">Symbols Identified</p>
            <div className="space-y-2.5">
              {dream.symbols.map((symbol, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 bg-blue-900/30 border border-blue-700/20 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 mt-1.5 flex-shrink-0" />
                  <p className="text-white/75 text-sm">{symbol}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Jungian Analysis */}
        {(dream.analysis || dream.jungianAnalysis) && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400/70" />
              <p className="text-blue-300/70 text-[11px] font-semibold uppercase tracking-widest">Jungian Analysis</p>
            </div>
            <div className="px-4 py-4 bg-blue-900/30 border border-blue-700/20 rounded-xl">
              <p className="text-white/70 text-sm leading-relaxed">{dream.analysis || dream.jungianAnalysis}</p>
            </div>
          </section>
        )}
      </div>

      {/* Sticky CTA */}
      <div
        className="sticky bottom-0 bg-gradient-to-t from-blue-950 via-blue-950/95 to-transparent px-4 pt-8"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
      >
        <Link
          to={`/dreams/${id}/revisit`}
          className="block w-full py-3.5 text-center bg-white/15 border border-white/30 text-white font-medium text-sm rounded-xl active:bg-white/25"
        >
          Revisit Dream
        </Link>
      </div>
    </div>
  );
}
