import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeVibe = "Liminal Cream" | "Lavender Dream" | "Scarlet Beam";

const vibeToDataTheme: Record<ThemeVibe, string> = {
  "Liminal Cream": "liminal",
  "Lavender Dream": "lavender",
  "Scarlet Beam": "scarlet",
};

interface ThemeContextValue {
  vibe: ThemeVibe;
  setVibe: (vibe: ThemeVibe) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  vibe: "Liminal Cream",
  setVibe: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [vibe, setVibeState] = useState<ThemeVibe>(() => {
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    return (profile.vibe as ThemeVibe) || "Liminal Cream";
  });

  const applyTheme = (v: ThemeVibe) => {
    document.documentElement.setAttribute("data-theme", vibeToDataTheme[v]);
  };

  useEffect(() => {
    applyTheme(vibe);
  }, [vibe]);

  // Sync with localStorage changes from other tabs or ChooseVibe saves
  useEffect(() => {
    const handleStorage = () => {
      const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      const saved = (profile.vibe as ThemeVibe) || "Liminal Cream";
      setVibeState(saved);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setVibe = (v: ThemeVibe) => {
    setVibeState(v);
    applyTheme(v);
  };

  return (
    <ThemeContext.Provider value={{ vibe, setVibe }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
