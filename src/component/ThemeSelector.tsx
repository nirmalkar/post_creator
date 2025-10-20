import React from "react";

export type ThemeName = "dark" | "light" | "teal";

interface Theme {
  bg: string;
  accent1: string;
  accent2: string;
  text: string;
  subText: string;
}

interface ThemeSelectorProps {
  selectedTheme: ThemeName;
  themes: Record<ThemeName, Theme>;
  onThemeChange: (theme: ThemeName) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  themes,
  onThemeChange
}) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-lg font-bold text-white mb-4">🎨 Theme</h2>
      <div className="space-y-3">
        {Object.keys(themes).map((theme) => (
          <button
            key={theme}
            onClick={() => onThemeChange(theme as ThemeName)}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              selectedTheme === theme
                ? "bg-teal-500 text-white shadow-lg"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
