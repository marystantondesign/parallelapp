import { Link, useLocation } from "react-router";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function Profile() {
  const location = useLocation();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [locationField, setLocationField] = useState("");
  const [occupation, setOccupation] = useState("");
  const [lifeSummary, setLifeSummary] = useState("");
  const [currentVibe, setCurrentVibe] = useState("Liminal Cream");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load profile data from localStorage
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    setDisplayName(savedProfile.displayName || "");
    setBio(savedProfile.bio || "");
    setLocationField(savedProfile.location || "");
    setOccupation(savedProfile.occupation || "");
    setLifeSummary(savedProfile.lifeSummary || "");
    setCurrentVibe(savedProfile.vibe || "Liminal Cream");
    setPhotoUrl(savedProfile.photoUrl || null);
  }, [location]); // Re-load when location changes (e.g., returning from vibe selection)

  const handleSaveField = (field: string, value: string) => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    savedProfile[field] = value;
    localStorage.setItem("userProfile", JSON.stringify(savedProfile));
  };

  return (
    <div>
      {/* Header */}
      <div className="app-subheader">
        <Link to="/settings" className="app-subheader-back">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="app-subheader-title">Profile</h2>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Profile Photo */}
        <div>
          <label className="app-field-label">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-t-avatar-bg flex items-center justify-center overflow-hidden">
              {photoUrl
                ? <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                : <User className="w-10 h-10 text-t-text-placeholder" />}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const url = reader.result as string;
                  setPhotoUrl(url);
                  handleSaveField("photoUrl", url);
                };
                reader.readAsDataURL(file);
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-t-surface-subtle border border-t-border-medium rounded-lg text-sm text-t-text-primary active:bg-t-surface-subtle"
            >
              Change Photo
            </button>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="app-field-label">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={() => {
              handleSaveField("displayName", displayName);
              const account = JSON.parse(localStorage.getItem("userAccount") || "{}");
              account.name = displayName;
              localStorage.setItem("userAccount", JSON.stringify(account));
            }}
            placeholder="Enter your name"
            className="app-input w-full"
          />
        </div>

        {/* Location */}
        <div>
          <label className="app-field-label">Location</label>
          <input
            type="text"
            value={locationField}
            onChange={(e) => setLocationField(e.target.value)}
            onBlur={() => handleSaveField("location", locationField)}
            placeholder="e.g. Buenos Aires"
            className="app-input w-full"
          />
        </div>

        {/* Occupation */}
        <div>
          <label className="app-field-label">Occupation</label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            onBlur={() => handleSaveField("occupation", occupation)}
            placeholder="e.g. Photographer"
            className="app-input w-full"
          />
        </div>

        {/* Life Summary */}
        <div>
          <label className="app-field-label">Life Summary</label>
          <textarea
            value={lifeSummary}
            onChange={(e) => setLifeSummary(e.target.value)}
            onBlur={() => handleSaveField("lifeSummary", lifeSummary)}
            placeholder="A brief summary of your life path..."
            rows={5}
            className="app-textarea w-full"
          />
        </div>

        {/* Vibe */}
        <div>
          <label className="app-field-label">Vibe</label>
          <Link
            to="/settings/profile/vibe"
            className="flex items-center justify-between p-4 bg-t-surface-elevated border border-t-border-medium rounded-lg active:bg-t-surface-subtle"
          >
            <span className="text-t-text-primary">{currentVibe}</span>
            <ChevronRight className="w-5 h-5 text-t-text-placeholder" />
          </Link>
        </div>
      </div>
    </div>
  );
}
