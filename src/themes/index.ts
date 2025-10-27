import type { ThemeName } from "../component/ThemeSelector";
import type { Theme } from "../component/CanvasTemplateEngine";

export const themes: Record<ThemeName, Theme> = {
  dark: {
    bg: "#1a1d2e",
    accent1: "#00BFA6",
    accent2: "#2d3748",
    text: "#ffffff",
    subText: "#cbd5e0",
  },
  light: {
    bg: "#ffffff",
    accent1: "#00BFA6",
    accent2: "#e2e8f0",
    text: "#1a202c",
    subText: "#4a5568",
  },
  teal: {
    bg: "#00BFA6",
    accent1: "#ffffff",
    accent2: "#009688",
    text: "#ffffff",
    subText: "#e0f2f1",
  },
};
