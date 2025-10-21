import React, { useState, useRef, useEffect } from "react";
import AppHeader from "./AppHeader";
import PostCanvas from "./PostCanvas";
import TemplateSelector from "./TemplateSelector";
import ThemeSelector, { type ThemeName } from "./ThemeSelector";
import InputControl from "./InputControl";
import SliderControl from "./SliderControl";
import SelectControl from "./SelectControl";
import ToggleControl from "./ToggleControl";
import SavedConfigs from "./SavedConfigs";
import { useSavedConfigs } from "../context/useSavedConfigs";
import type { PostConfig } from "../types/config";
import { Save, FolderOpen } from "lucide-react";

type Theme = {
  bg: string;
  accent1: string;
  accent2: string;
  text: string;
  subText: string;
};

const PostCreator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { saveConfig, savedConfigs } = useSavedConfigs();
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [configName, setConfigName] = useState<string>("");
  const [title, setTitle] = useState<string>("JavaScript");
  const [content, setContent] = useState<string>(
    "Web APIs you probably don't know about"
  );
  const [footer, setFooter] = useState<string>("@YourBrand");
  const [theme, setTheme] = useState<ThemeName>("dark");
  const [showNextArrow, setShowNextArrow] = useState<boolean>(false);
  const [showCodeSection, setShowCodeSection] = useState<boolean>(false);
  const [code, setCode] = useState<string>(
    'const api = fetch("/data")\n  .then(res => res.json())'
  );
  const [template, setTemplate] = useState<"modern" | "minimal" | "gradient">(
    "modern"
  );
  const [contentFontSize, setContentFontSize] = useState<number>(40);
  const [titleFontSize, setTitleFontSize] = useState<number>(72);
  const [codeBoxHeight, setCodeBoxHeight] = useState<number>(220);
  const [contentFontWeight, setContentFontWeight] = useState<string>("400");
  const [titleFontWeight, setTitleFontWeight] = useState<string>("700");
  const [titleY, setTitleY] = useState<number>(130);
  const [contentY, setContentY] = useState<number>(250);

  const handleSaveConfig = () => {
    if (!configName.trim()) {
      alert("Please enter a name for this configuration");
      return;
    }

    const configToSave = {
      name: configName.trim(),
      title,
      content,
      footer,
      theme,
      template,
      titleFontSize,
      contentFontSize,
      titleFontWeight,
      contentFontWeight,
      titleY,
      contentY,
      showNextArrow,
      showCodeSection,
      codeBoxHeight,
      code,
    };

    saveConfig(configToSave);
    setShowSaveDialog(false);
    setConfigName("");
    alert("Configuration saved successfully!");
  };

  const handleLoadConfig = (config: PostConfig) => {
    setTitle(config.title);
    setContent(config.content);
    setFooter(config.footer);
    setTheme(config.theme);
    setTemplate(config.template);
    setTitleFontSize(config.titleFontSize);
    setContentFontSize(config.contentFontSize);
    setTitleFontWeight(config.titleFontWeight);
    setContentFontWeight(config.contentFontWeight);
    setTitleY(config.titleY);
    setContentY(config.contentY);
    setShowNextArrow(config.showNextArrow);
    setShowCodeSection(config.showCodeSection);
    setCodeBoxHeight(config.codeBoxHeight);
    setCode(config.code);
    alert("Configuration loaded successfully!");
  };

  const themes: Record<ThemeName, Theme> = {
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

  const drawDecorativeCircles = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    currentTheme: Theme
  ) => {
    ctx.fillStyle = currentTheme.accent1;

    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.arc(w + 300, h + 250, 400, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.14;
    ctx.beginPath();
    ctx.arc(w + 100, -50, 250, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.arc(w - 50, h - 100, 350, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.11;
    ctx.beginPath();
    ctx.arc(-80, h / 2, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.09;
    ctx.beginPath();
    ctx.arc(100, h + 150, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
  };

  const drawNextArrow = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    currentTheme: Theme
  ) => {
    if (!showNextArrow) return;

    const arrowX = w - 100;
    const arrowY = h - 100;
    const arrowSize = 40;

    ctx.fillStyle = currentTheme.accent1;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(arrowX, arrowY, arrowSize + 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = currentTheme.accent1;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(arrowX, arrowY, arrowSize + 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(arrowX - 8, arrowY - 8, 8, 0, Math.PI * 2);
    ctx.fill();

    let arrowColor = currentTheme.text;
    if (currentTheme.bg === "#00BFA6") {
      arrowColor = "#ffffff";
    } else if (currentTheme.bg === "#ffffff") {
      arrowColor = "#1a202c";
    } else {
      arrowColor = currentTheme.text;
    }

    ctx.strokeStyle = arrowColor;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.moveTo(arrowX - 12, arrowY - 12);
    ctx.lineTo(arrowX + 12, arrowY);
    ctx.lineTo(arrowX - 12, arrowY + 12);
    ctx.stroke();

    ctx.globalAlpha = 1;
  };

  const drawModernTemplate = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    currentTheme: Theme
  ) => {
    ctx.fillStyle = currentTheme.bg;
    ctx.fillRect(0, 0, w, h);

    const radius = 40;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(w - radius, 0);
    ctx.quadraticCurveTo(w, 0, w, radius);
    ctx.lineTo(w, h - radius);
    ctx.quadraticCurveTo(w, h, w - radius, h);
    ctx.lineTo(radius, h);
    ctx.quadraticCurveTo(0, h, 0, h - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();

    ctx.fillStyle = currentTheme.bg;
    ctx.fill();

    drawDecorativeCircles(ctx, w, h, currentTheme);

    ctx.fillStyle = currentTheme.text;
    ctx.font = `${titleFontWeight} ${titleFontSize}px Poppins, sans-serif`;
    ctx.textAlign = "left";

    const titleMaxWidth = w - 100;
    const titleWords = title.split(" ");
    let titleLine = "";
    let titleCurrentY = titleY;

    titleWords.forEach((word) => {
      const testLine = titleLine + (titleLine ? " " : "") + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > titleMaxWidth && titleLine) {
        ctx.fillText(titleLine, 50, titleCurrentY);
        titleLine = word;
        titleCurrentY += 85;
      } else {
        titleLine = testLine;
      }
    });
    if (titleLine) ctx.fillText(titleLine, 50, titleCurrentY);

    ctx.fillStyle = currentTheme.text;
    ctx.font = `${contentFontWeight} ${contentFontSize}px Poppins, sans-serif`;
    ctx.textAlign = "left";

    const contentMaxWidth = w - 100;
    const lines = content.split("\n");
    let contentCurrentY = contentY;
    let lastContentY = contentY;

    lines.forEach((lineContent) => {
      if (lineContent.trim() === "") {
        contentCurrentY += Math.round(contentFontSize * 1.3);
        return;
      }

      const words = lineContent.split(" ");
      let currentLine = "";

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > contentMaxWidth && currentLine) {
          ctx.fillText(currentLine, 50, contentCurrentY);
          currentLine = word;
          contentCurrentY += Math.round(contentFontSize * 1.3);
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        ctx.fillText(currentLine, 50, contentCurrentY);
        lastContentY = contentCurrentY;
        contentCurrentY += Math.round(contentFontSize * 1.3);
      }
    });

    const footerStartY = h - 130;

    if (showCodeSection) {
      const codeBoxY = lastContentY + 70;
      const codePadding = 20;

      ctx.fillStyle = currentTheme.accent2;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(50, codeBoxY, w - 100, codeBoxHeight);
      ctx.globalAlpha = 1;

      ctx.strokeStyle = currentTheme.accent1;
      ctx.lineWidth = 2;
      ctx.strokeRect(50, codeBoxY, w - 100, codeBoxHeight);

      ctx.fillStyle = currentTheme.accent1;
      ctx.font = "bold 22px Poppins, monospace";
      ctx.textAlign = "left";

      const codeLines = code.split("\n");
      let codeY = codeBoxY + codePadding + 20;

      codeLines.forEach((codeLine) => {
        if (codeY < codeBoxY + codeBoxHeight - codePadding) {
          let displayLine = codeLine;
          if (ctx.measureText(displayLine).width > w - 140) {
            displayLine = displayLine.substring(0, 40) + "...";
          }
          ctx.fillText(displayLine, 50 + codePadding, codeY);
          codeY += 32;
        }
      });
    }

    ctx.strokeStyle = currentTheme.accent1;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, footerStartY);
    ctx.lineTo(150, footerStartY);
    ctx.stroke();

    ctx.fillStyle = currentTheme.accent1;
    ctx.font = "20px Poppins, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(footer, 50, footerStartY + 20);

    ctx.fillStyle = currentTheme.subText;
    ctx.font = "16px Poppins, sans-serif";
    ctx.fillText("Tech Tips & Learning Resources", 50, footerStartY + 55);

    drawNextArrow(ctx, w, h, currentTheme);
  };

  const drawMinimalTemplate = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    currentTheme: Theme
  ) => {
    ctx.fillStyle = currentTheme.bg;
    ctx.fillRect(0, 0, w, h);

    drawDecorativeCircles(ctx, w, h, currentTheme);

    ctx.fillStyle = currentTheme.accent1;
    ctx.fillRect(0, 0, 12, h);

    ctx.fillStyle = currentTheme.accent1;
    ctx.font = `${titleFontWeight} 24px Poppins, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(title.toUpperCase(), w / 2, titleY);

    ctx.fillStyle = currentTheme.text;
    ctx.font = `${contentFontWeight} ${contentFontSize}px Poppins, sans-serif`;
    ctx.textAlign = "center";

    const titleMaxWidth = w - 100;
    const contentLines = content.split("\n");
    let contentCurrentY = contentY;
    let lastContentY = contentY;

    contentLines.forEach((lineContent) => {
      if (lineContent.trim() === "") {
        contentCurrentY += Math.round(contentFontSize * 1.3);
        return;
      }

      const contentWords = lineContent.split(" ");
      let contentLine = "";

      contentWords.forEach((word) => {
        const testLine = contentLine + (contentLine ? " " : "") + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > titleMaxWidth && contentLine) {
          ctx.fillText(contentLine, w / 2, contentCurrentY);
          contentLine = word;
          contentCurrentY += Math.round(contentFontSize * 1.3);
        } else {
          contentLine = testLine;
        }
      });

      if (contentLine) {
        ctx.fillText(contentLine, w / 2, contentCurrentY);
        lastContentY = contentCurrentY;
        contentCurrentY += Math.round(contentFontSize * 1.3);
      }
    });

    if (showCodeSection) {
      const codeBoxY = lastContentY + 70;
      const codePadding = 20;

      ctx.fillStyle = currentTheme.accent2;
      ctx.globalAlpha = 0.2;
      ctx.fillRect((w - (w - 100)) / 2, codeBoxY, w - 100, codeBoxHeight);
      ctx.globalAlpha = 1;

      ctx.fillStyle = currentTheme.accent1;
      ctx.font = "bold 20px Poppins, monospace";
      ctx.textAlign = "left";

      const codeLines = code.split("\n");
      let codeY = codeBoxY + 25;

      codeLines.forEach((codeLine) => {
        if (codeY < codeBoxY + codeBoxHeight - codePadding) {
          let displayLine = codeLine;
          if (ctx.measureText(displayLine).width > w - 100 - 40) {
            displayLine = displayLine.substring(0, 40) + "...";
          }
          ctx.fillText(displayLine, (w - (w - 100)) / 2 + 20, codeY);
          codeY += 30;
        }
      });
    }

    ctx.fillStyle = currentTheme.accent1;
    ctx.font = "18px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(footer, w / 2, h - 50);

    drawNextArrow(ctx, w, h, currentTheme);
  };

  const drawGradientTemplate = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    currentTheme: Theme
  ) => {
    ctx.fillStyle = currentTheme.bg;
    ctx.fillRect(0, 0, w, h);

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, currentTheme.accent1);
    gradient.addColorStop(1, currentTheme.bg);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    const boxPadding = 40;
    const boxHeight = h - 100;
    ctx.fillStyle = currentTheme.text;
    ctx.globalAlpha = 0.95;
    ctx.fillRect(boxPadding, 40, w - 2 * boxPadding, boxHeight);
    ctx.globalAlpha = 1;

    ctx.fillStyle = currentTheme.accent1;
    ctx.font = `${titleFontWeight} ${
      titleFontSize * 0.67
    }px Poppins, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(title, boxPadding + 30, titleY);

    ctx.fillStyle = currentTheme.bg;
    ctx.font = `${contentFontWeight} ${contentFontSize}px Poppins, sans-serif`;
    ctx.textAlign = "left";

    const contentMaxWidth = w - 2 * boxPadding - 60;
    const contentLines = content.split("\n");
    let contentCurrentY = contentY;
    let lastContentY = contentY;

    contentLines.forEach((lineContent) => {
      if (lineContent.trim() === "") {
        contentCurrentY += Math.round(contentFontSize * 1.3);
        return;
      }

      const words = lineContent.split(" ");
      let line = "";

      words.forEach((word) => {
        const testLine = line + (line ? " " : "") + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > contentMaxWidth && line) {
          ctx.fillText(line, boxPadding + 30, contentCurrentY);
          line = word;
          contentCurrentY += Math.round(contentFontSize * 1.3);
        } else {
          line = testLine;
        }
      });

      if (line) {
        ctx.fillText(line, boxPadding + 30, contentCurrentY);
        lastContentY = contentCurrentY;
        contentCurrentY += Math.round(contentFontSize * 1.3);
      }
    });

    if (showCodeSection) {
      const codeBoxY = lastContentY + 40;
      ctx.fillStyle = currentTheme.accent1;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(
        boxPadding + 30,
        codeBoxY,
        w - 2 * boxPadding - 60,
        codeBoxHeight
      );
      ctx.globalAlpha = 1;

      ctx.fillStyle = currentTheme.accent1;
      ctx.font = "bold 18px Poppins, monospace";

      const codeLines = code.split("\n");
      let codeY = codeBoxY + 25;

      codeLines.forEach((codeLine) => {
        if (codeY < codeBoxY + codeBoxHeight - 20) {
          ctx.fillText(codeLine, boxPadding + 45, codeY);
          codeY += 28;
        }
      });
    }

    ctx.fillStyle = currentTheme.text;
    ctx.font = "18px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(footer, w / 2, h - 30);

    drawNextArrow(ctx, w, h, currentTheme);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure canvas has actual pixel size matching its attributes
    // (the canvas element has width/height attributes already set in JSX)
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w: number = canvas.width;
    const h: number = canvas.height;
    const currentTheme: Theme = themes[theme];

    // Clear first (optional)
    ctx.clearRect(0, 0, w, h);

    if (template === "modern") {
      drawModernTemplate(ctx, w, h, currentTheme);
    } else if (template === "minimal") {
      drawMinimalTemplate(ctx, w, h, currentTheme);
    } else if (template === "gradient") {
      drawGradientTemplate(ctx, w, h, currentTheme);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        setShowSaveDialog(true);
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        const savedConfigsElement = document.getElementById('saved-configs-section');
        if (savedConfigsElement) {
          savedConfigsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'e' && savedConfigs.length > 0) {
        event.preventDefault();
        // Export all configs
        try {
          const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            configs: savedConfigs,
          };

          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
          });

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `insta-post-configs-backup-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Failed to export configs:', error);
          alert('Failed to export configurations. Please try again.');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [savedConfigs]);

  useEffect(() => {
    drawCanvas();
    // draw again if fonts load later — small re-draw safeguard
    const timer = setTimeout(() => drawCanvas(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    content,
    footer,
    theme,
    showNextArrow,
    showCodeSection,
    code,
    template,
    contentFontSize,
    titleFontSize,
    codeBoxHeight,
    contentFontWeight,
    titleFontWeight,
    titleY,
    contentY,
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const image = (canvas as HTMLCanvasElement).toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `instagram-post-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
      `}</style>

      <AppHeader />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 lg:flex-none lg:w-1/3">
          <div className="space-y-6 max-h-screen overflow-y-auto">
            {/* Save/Load Controls */}
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
              <div className="flex space-x-2 mb-4 gap-2">
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  <Save size={16} />
                  <span>Save Config</span>
                </button>
                <button
                  onClick={() => {
                    const savedConfigsElement = document.getElementById(
                      "saved-configs-section"
                    );
                    if (savedConfigsElement) {
                      savedConfigsElement.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  <FolderOpen size={16} />
                  <span>Load Config</span>
                </button>
              </div>

              {showSaveDialog && (
                <div className="bg-slate-700 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-medium mb-2">
                    Save Configuration
                  </h4>
                  <input
                    type="text"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    placeholder="Enter configuration name"
                    className="w-full bg-slate-600 text-white px-3 py-2 rounded mb-3 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveConfig();
                      if (e.key === "Escape") setShowSaveDialog(false);
                    }}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveConfig}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowSaveDialog(false);
                        setConfigName("");
                      }}
                      className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <TemplateSelector
              selectedTemplate={template}
              onTemplateChange={setTemplate}
            />

            <ThemeSelector
              selectedTheme={theme}
              themes={themes}
              onThemeChange={setTheme}
            />

            <InputControl
              label="Main Title"
              value={title}
              onChange={setTitle}
              maxLength={60}
              showCounter={true}
            />

            <SliderControl
              label="Title Font Size"
              value={titleFontSize}
              onChange={setTitleFontSize}
              min={50}
              max={100}
              unit="px"
            />

            <SelectControl
              label="Title Font Weight"
              value={titleFontWeight}
              onChange={setTitleFontWeight}
              options={[
                { value: "400", label: "Regular (400)" },
                { value: "600", label: "Semi-bold (600)" },
                { value: "700", label: "Bold (700)" },
                { value: "800", label: "Extra Bold (800)" },
              ]}
            />

            <InputControl
              label="Main Content"
              value={content}
              onChange={setContent}
              maxLength={500}
              type="textarea"
              rows={6}
              showCounter={true}
            />

            <SliderControl
              label="Content Font Size"
              value={contentFontSize}
              onChange={setContentFontSize}
              min={30}
              max={60}
              unit="px"
            />

            <SelectControl
              label="Content Font Weight"
              value={contentFontWeight}
              onChange={setContentFontWeight}
              options={[
                { value: "400", label: "Regular (400)" },
                { value: "600", label: "Semi-bold (600)" },
                { value: "700", label: "Bold (700)" },
                { value: "800", label: "Extra Bold (800)" },
              ]}
            />

            <InputControl
              label="Footer / Brand Name"
              value={footer}
              onChange={setFooter}
              maxLength={30}
              showCounter={true}
            />

            <SliderControl
              label="Title Vertical Position"
              value={titleY}
              onChange={setTitleY}
              min={50}
              max={300}
              unit="px"
            />

            <SliderControl
              label="Content Vertical Position"
              value={contentY}
              onChange={setContentY}
              min={200}
              max={600}
              unit="px"
            />

            <ToggleControl
              label="Show Next Arrow"
              isEnabled={showNextArrow}
              onToggle={() => setShowNextArrow(!showNextArrow)}
              description="Show a next slide indicator arrow"
            />

            <ToggleControl
              label="Show Code Section"
              isEnabled={showCodeSection}
              onToggle={() => setShowCodeSection(!showCodeSection)}
              description="Show code snippet on the image"
            />

            {showCodeSection && (
              <SliderControl
                label="Code Box Height"
                value={codeBoxHeight}
                onChange={setCodeBoxHeight}
                min={150}
                max={350}
                unit="px"
              />
            )}

            {showCodeSection && (
              <InputControl
                label="Code Snippet"
                value={code}
                onChange={setCode}
                maxLength={300}
                type="textarea"
                rows={5}
                showCounter={true}
              />
            )}
          </div>
        </div>

        <div className="flex-1 lg:flex-none lg:w-2/3">
          <PostCanvas canvasRef={canvasRef} onDownload={handleDownload} />

          {/* Saved Configurations Section */}
          <div id="saved-configs-section" className="mt-8">
            <SavedConfigs onLoadConfig={handleLoadConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreator;
