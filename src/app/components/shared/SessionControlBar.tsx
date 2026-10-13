import { Flashlight, FlashlightOff, Volume2, Play, Pause } from "lucide-react";
import type { ReactNode } from "react";

interface SessionControlBarProps {
  /** Timer or any centered content rendered between the top controls and end button */
  children: ReactNode;
  flashEnabled: boolean;
  onFlashToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  isPaused: boolean;
  onPauseToggle: () => void;
  /** Label on the destructive end button, e.g. "Stop Echoes Transmission" */
  endLabel: string;
  /** Called when the end button is pressed — parent should show its confirmation dialog */
  onEndPress: () => void;
}

export function SessionControlBar({
  children,
  flashEnabled,
  onFlashToggle,
  soundEnabled,
  onSoundToggle,
  isPaused,
  onPauseToggle,
  endLabel,
  onEndPress,
}: SessionControlBarProps) {
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Top Controls Row */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-20 mt-4">
        {/* Flashlight toggle */}
        <button
          onClick={onFlashToggle}
          className={`p-3 text-white/80 active:text-white rounded-full border-2 border-white/30 transition-all ${
            flashEnabled ? "bg-white/20" : "bg-transparent"
          }`}
        >
          {flashEnabled ? (
            <Flashlight className="w-5 h-5" />
          ) : (
            <FlashlightOff className="w-5 h-5" />
          )}
        </button>

        {/* Pause / Resume pill */}
        <button
          onClick={onPauseToggle}
          className={`px-4 py-2 text-white/80 text-sm rounded-full border-2 border-white/30 active:bg-white/20 flex items-center gap-2 transition-all ${
            isPaused ? "bg-white/25" : "bg-white/10"
          }`}
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          )}
        </button>

        {/* Sound / Mute toggle */}
        <button
          onClick={onSoundToggle}
          className={`relative p-3 text-white/80 active:text-white rounded-full border-2 border-white/30 transition-all ${
            soundEnabled ? "bg-white/20" : "bg-transparent"
          }`}
        >
          <Volume2 className="w-5 h-5" />
          {!soundEnabled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-7 h-0.5 bg-white/80 rotate-45" />
            </div>
          )}
        </button>
      </div>

      {/* Middle content (timer) + End button pinned to bottom */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end pb-24">
        {children}
        <button
          onClick={onEndPress}
          className="mt-8 px-10 py-4 text-white font-medium border-2 border-white/50 bg-white/15 rounded-full active:bg-white/25 active:border-white/70 shadow-lg transition-all"
        >
          {endLabel}
        </button>
      </div>
    </div>
  );
}
