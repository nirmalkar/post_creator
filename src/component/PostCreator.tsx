import React, { useState, useRef, useEffect } from "react";
import { Download, Layout } from "lucide-react";

type Theme = {
  bg: string;
  accent1: string;
  accent2: string;
  text: string;
  subText: string;
};
type ThemeName = "dark" | "light" | "teal";

const PostCreator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    let titleY = 130;

    titleWords.forEach((word) => {
      const testLine = titleLine + (titleLine ? " " : "") + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > titleMaxWidth && titleLine) {
        ctx.fillText(titleLine, 50, titleY);
        titleLine = word;
        titleY += 85;
      } else {
        titleLine = testLine;
      }
    });
    if (titleLine) ctx.fillText(titleLine, 50, titleY);

    ctx.fillStyle = currentTheme.text;
    ctx.font = `${contentFontWeight} ${contentFontSize}px Poppins, sans-serif`;
    ctx.textAlign = "left";

    const contentMaxWidth = w - 100;
    const words = content.split(" ");
    let line = "";
    let contentY = h * 0.25;

    words.forEach((word) => {
      const testLine = line + (line ? " " : "") + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > contentMaxWidth && line) {
        ctx.fillText(line, 50, contentY);
        line = word;
        contentY += 50;
      } else {
        line = testLine;
      }
    });
    if (line) ctx.fillText(line, 50, contentY);

    let footerStartY = h - 130;

    if (showCodeSection) {
      const codeBoxY = contentY + 70;
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
    ctx.fillText(title.toUpperCase(), w / 2, 80);

    ctx.fillStyle = currentTheme.text;
    ctx.font = `${contentFontWeight} ${contentFontSize}px Poppins, sans-serif`;
    ctx.textAlign = "center";

    const titleMaxWidth = w - 100;
    const contentWords = content.split(" ");
    let contentLine = "";
    let contentY = h / 2 - 100;

    contentWords.forEach((word) => {
      const testLine = contentLine + (contentLine ? " " : "") + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > titleMaxWidth && contentLine) {
        ctx.fillText(contentLine, w / 2, contentY);
        contentLine = word;
        contentY += 80;
      } else {
        contentLine = testLine;
      }
    });
    if (contentLine) ctx.fillText(contentLine, w / 2, contentY);

    if (showCodeSection) {
      const codeBoxY = contentY + 70;
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
    ctx.fillText(title, boxPadding + 30, 120);

    ctx.fillStyle = currentTheme.bg;
    ctx.font = `${contentFontWeight} ${contentFontSize}px Poppins, sans-serif`;
    ctx.textAlign = "left";

    const contentMaxWidth = w - 2 * boxPadding - 60;
    const words = content.split(" ");
    let line = "";
    let contentY = 200;

    words.forEach((word) => {
      const testLine = line + (line ? " " : "") + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > contentMaxWidth && line) {
        ctx.fillText(line, boxPadding + 30, contentY);
        line = word;
        contentY += 45;
      } else {
        line = testLine;
      }
    });
    if (line) ctx.fillText(line, boxPadding + 30, contentY);

    if (showCodeSection) {
      const codeBoxY = contentY + 40;
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
      // eslint-disable-next-line no-console
      console.error("Download failed:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
      `}</style>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
          <Layout size={32} />
          Post Creator
        </h1>
        <p className="text-gray-400 mb-8">
          Create stunning Instagram learning content with multiple templates
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6 shadow-2xl">
              <canvas
                ref={canvasRef}
                width={1080}
                height={1350}
                className="w-full border-4 border-slate-700 rounded-lg shadow-lg"
              />
              <button
                onClick={handleDownload}
                className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
              >
                <Download size={20} />
                Download as PNG
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 max-h-screen overflow-y-auto">
            <div className="bg-slate-800 rounded-lg p-6 shadow-lg border-2 border-teal-500">
              <h2 className="text-lg font-bold text-white mb-4">
                📋 Select Template
              </h2>
              <div className="space-y-3">
                {[
                  { id: "modern", label: "Modern" },
                  { id: "minimal", label: "Minimal" },
                  { id: "gradient", label: "Gradient" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      setTemplate(t.id as "modern" | "minimal" | "gradient")
                    }
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      template === t.id
                        ? "bg-teal-500 text-white shadow-lg scale-105"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-4">🎨 Theme</h2>
              <div className="space-y-3">
                {Object.keys(themes).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t as ThemeName)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      theme === t
                        ? "bg-teal-500 text-white shadow-lg"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <label className="block text-sm font-bold text-teal-400 mb-2">
                Main Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={40}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/40</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <label className="block text-sm font-bold text-teal-400 mb-2">
                Title Font Size
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={titleFontSize}
                  onChange={(e) => setTitleFontSize(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <span className="text-white font-bold w-12 text-center">
                  {titleFontSize}px
                </span>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <label className="block text-sm font-bold text-teal-400 mb-2">
                Title Font Weight
              </label>
              <select
                value={titleFontWeight}
                onChange={(e) => setTitleFontWeight(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none text-sm"
              >
                <option value="400">Regular (400)</option>
                <option value="600">Semi-bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
              </select>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <label className="block text-sm font-bold text-teal-400 mb-2">
                Main Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                rows={6}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none text-sm resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{content.length}/500</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <label className="block text-sm font-bold text-teal-400 mb-2">
                Content Font Size
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="30"
                  max="60"
                  value={contentFontSize}
                  onChange={(e) => setContentFontSize(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <span className="text-white font-bold w-12 text-center">
                  {contentFontSize}px
                </span>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <label className="block text-sm font-bold text-teal-400 mb-2">
                Content Font Weight
              </label>
              <select
                value={contentFontWeight}
                onChange={(e) => setContentFontWeight(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none text-sm"
              >
                <option value="400">Regular (400)</option>
                <option value="600">Semi-bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
              </select>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <label className="block text-sm font-bold text-teal-400 mb-2">
                Footer / Brand Name
              </label>
              <input
                type="text"
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                maxLength={30}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">{footer.length}/30</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <label className="block text-sm font-bold text-teal-400 mb-4">
                Show Next Arrow
              </label>
              <button
                onClick={() => setShowNextArrow(!showNextArrow)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  showNextArrow
                    ? "bg-teal-500 text-white shadow-lg"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                {showNextArrow ? "✓ Arrow Enabled" : "Arrow Disabled"}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Show a next slide indicator arrow
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <label className="block text-sm font-bold text-teal-400 mb-4">
                Show Code Section
              </label>
              <button
                onClick={() => setShowCodeSection(!showCodeSection)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  showCodeSection
                    ? "bg-teal-500 text-white shadow-lg"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                {showCodeSection ? "✓ Code Enabled" : "Code Disabled"}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Show code snippet on the image
              </p>
            </div>

            {showCodeSection && (
              <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
                <label className="block text-sm font-bold text-teal-400 mb-2">
                  Code Box Height
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="150"
                    max="350"
                    value={codeBoxHeight}
                    onChange={(e) => setCodeBoxHeight(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <span className="text-white font-bold w-12 text-center">
                    {codeBoxHeight}px
                  </span>
                </div>
              </div>
            )}

            {showCodeSection && (
              <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-teal-500">
                <label className="block text-sm font-bold text-teal-400 mb-2">
                  Code Snippet
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={300}
                  rows={5}
                  className="w-full px-4 py-2 bg-slate-700 text-teal-400 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none text-xs font-mono resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{code.length}/300</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreator;
