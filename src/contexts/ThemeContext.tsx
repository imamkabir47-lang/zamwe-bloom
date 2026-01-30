import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemePreset = "pink" | "blue" | "red" | "black";

interface ThemeContextType {
  theme: ThemePreset;
  setTheme: (theme: ThemePreset) => void;
  timeAdjustedHue: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors: Record<ThemePreset, { hue: number; saturation: number }> = {
  pink: { hue: 330, saturation: 81 },
  blue: { hue: 210, saturation: 80 },
  red: { hue: 0, saturation: 75 },
  black: { hue: 0, saturation: 0 },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemePreset>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("zamwe-theme") as ThemePreset) || "pink";
    }
    return "pink";
  });
  
  const [timeAdjustedHue, setTimeAdjustedHue] = useState(330);

  // Time-adaptive color adjustment
  useEffect(() => {
    const updateTimeBasedColor = () => {
      const hour = new Date().getHours();
      const baseColor = themeColors[theme];
      
      // Darken the color as the day progresses (6am = lightest, 10pm = darkest)
      let lightness: number;
      if (hour >= 6 && hour < 12) {
        // Morning: 71% to 65%
        lightness = 71 - ((hour - 6) * 1);
      } else if (hour >= 12 && hour < 18) {
        // Afternoon: 65% to 55%
        lightness = 65 - ((hour - 12) * 1.67);
      } else if (hour >= 18 && hour < 22) {
        // Evening: 55% to 45%
        lightness = 55 - ((hour - 18) * 2.5);
      } else {
        // Night: 45%
        lightness = 45;
      }

      // Update CSS variables
      const root = document.documentElement;
      
      if (theme === "black") {
        root.style.setProperty("--primary", `0 0% ${Math.max(20, lightness - 20)}%`);
        root.style.setProperty("--primary-foreground", "0 0% 100%");
      } else {
        root.style.setProperty("--primary", `${baseColor.hue} ${baseColor.saturation}% ${lightness}%`);
        root.style.setProperty("--ring", `${baseColor.hue} ${baseColor.saturation}% ${lightness}%`);
      }
      
      setTimeAdjustedHue(baseColor.hue);
    };

    updateTimeBasedColor();
    const interval = setInterval(updateTimeBasedColor, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [theme]);

  const setTheme = (newTheme: ThemePreset) => {
    setThemeState(newTheme);
    localStorage.setItem("zamwe-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, timeAdjustedHue }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
