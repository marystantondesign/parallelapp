import { Link, useNavigate } from "react-router";
import { ChevronLeft, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme, type ThemeVibe } from "../context/ThemeContext";

export function ChooseVibe() {
  const navigate = useNavigate();
  const { vibe: currentVibe, setVibe } = useTheme();
  const [savedVibe, setSavedVibe] = useState<ThemeVibe>("Liminal Cream");
  const [selectedVibe, setSelectedVibe] = useState<ThemeVibe>("Liminal Cream");

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const v = (savedProfile.vibe || "Liminal Cream") as ThemeVibe;
    setSavedVibe(v);
    setSelectedVibe(v);
  }, []);

  const handleSelect = (vibe: ThemeVibe) => {
    setSelectedVibe(vibe);
    setVibe(vibe); // Apply immediately for live preview
  };

  const handleSave = () => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    savedProfile.vibe = selectedVibe;
    localStorage.setItem("userProfile", JSON.stringify(savedProfile));
    setSavedVibe(selectedVibe);
    navigate("/settings/profile");
  };

  const handleCancel = () => {
    // Revert to saved vibe if user cancels
    setVibe(savedVibe);
    navigate("/settings/profile");
  };

  const vibes: ThemeVibe[] = ["Liminal Cream", "Lavender Dream", "Scarlet Beam"];
  const isSaveDisabled = selectedVibe === savedVibe;

  const vibeDescriptions: Record<ThemeVibe, string> = {
    "Liminal Cream": "Warm paper, quiet editorial",
    "Lavender Dream": "Dusk, moonlight, soft glow",
    "Scarlet Beam": "Theater, velvet, candlelight",
  };

  return (
    <div>
      {/* Header */}
      <div className="app-subheader">
        <button onClick={handleCancel} className="app-subheader-back">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="app-subheader-title">Choose Your Vibe</h2>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <p className="app-body mb-6">Changes apply instantly. Tap Save to keep your selection.</p>

        {/* Vibe Options */}
        <div className="space-y-3 mb-8">
          {vibes.map((vibe) => (
            <button
              key={vibe}
              onClick={() => handleSelect(vibe)}
              className="w-full flex items-center justify-between p-4 bg-t-surface-elevated border-2 rounded-lg active:bg-t-surface-subtle"
              style={{
                borderColor: selectedVibe === vibe ? "var(--t-link)" : "var(--t-border-subtle)",
              }}
            >
              <div className="text-left">
                <span className="text-t-text-primary font-medium block">{vibe}</span>
                <span className="app-caption">{vibeDescriptions[vibe]}</span>
              </div>
              {selectedVibe === vibe && (
                <div className="w-6 h-6 rounded-full bg-t-btn-bg flex items-center justify-center flex-none ml-3">
                  <Check className="w-4 h-4 text-t-btn-text" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="app-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
}
