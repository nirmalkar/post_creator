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
import MarkdownEditor from "./MarkdownEditor";
import { useSavedConfigs } from "../context/useSavedConfigs";
import type { PostConfig } from "../types/config";
import { Save, FolderOpen } from "lucide-react";
import { themes } from "../themes";
import type { Theme } from "./CanvasTemplateEngine";
import { drawCanvasTemplate } from "./CanvasTemplateEngine";
import { renderMarkdownOnCanvas } from "./MarkdownRenderer";

const PostCreator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { saveConfig, savedConfigs } = useSavedConfigs();
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [configName, setConfigName] = useState<string>("");
  const [title, setTitle] = useState<string>("JavaScript");
  const [content, setContent] = useState<string>(
    "# Main Title\n\nThis is **bold** and *italic* with `code` formatting.\n\n## Features\n- **Bold text** support\n- *Italic text* support\n- `Code blocks` support\n- Headers and lists"
  );
  const [contentPreviewMode, setContentPreviewMode] = useState<
    "split" | "edit" | "preview"
  >("split");
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

    // Use extracted template engine
    drawCanvasTemplate(
      ctx,
      w,
      h,
      template,
      currentTheme,
      {
        title,
        content,
        footer,
        showNextArrow,
        showCodeSection,
        code,
        codeBoxHeight,
        titleFontSize,
        contentFontSize,
        titleFontWeight,
        contentFontWeight,
        titleY,
        contentY,
      },
      renderMarkdownOnCanvas
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        setShowSaveDialog(true);
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "l") {
        event.preventDefault();
        const savedConfigsElement = document.getElementById(
          "saved-configs-section"
        );
        if (savedConfigsElement) {
          savedConfigsElement.scrollIntoView({ behavior: "smooth" });
        }
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "e" &&
        savedConfigs.length > 0
      ) {
        event.preventDefault();
        // Export all configs
        try {
          const exportData = {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            configs: savedConfigs,
          };

          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
          });

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `insta-post-configs-backup-${
            new Date().toISOString().split("T")[0]
          }.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Failed to export configs:", error);
          alert("Failed to export configurations. Please try again.");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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
              <h3 className="text-lg font-semibold text-white mb-4">
                Configuration
              </h3>
              <div className="text-xs text-slate-400 mb-3">
                Keyboard shortcuts:{" "}
                <kbd className="bg-slate-700 px-1 rounded">Ctrl+S</kbd> Save •{" "}
                <kbd className="bg-slate-700 px-1 rounded">Ctrl+L</kbd> Focus
                configs •{" "}
                <kbd className="bg-slate-700 px-1 rounded">Ctrl+E</kbd> Export
                all
              </div>
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

            <MarkdownEditor
              label="Main Content"
              value={content}
              onChange={setContent}
              maxLength={500}
              rows={6}
              showCounter={true}
              previewMode={contentPreviewMode}
              onPreviewModeChange={setContentPreviewMode}
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
