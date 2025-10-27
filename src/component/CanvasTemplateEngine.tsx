export type Theme = {
  bg: string;
  accent1: string;
  accent2: string;
  text: string;
  subText: string;
};

export type TemplateName = "modern" | "minimal" | "gradient";

interface CanvasTemplateEngineProps {
  template: TemplateName;
  theme: Theme;
  title: string;
  content: string;
  footer: string;
  showNextArrow: boolean;
  showCodeSection: boolean;
  code: string;
  codeBoxHeight: number;
  titleFontSize: number;
  contentFontSize: number;
  titleFontWeight: string;
  contentFontWeight: string;
  titleY: number;
  contentY: number;
}

export const drawDecorativeCircles = (
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

export const drawNextArrow = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  currentTheme: Theme
) => {
  const arrowX = w - 100;
  const arrowY = h - 150;
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

export const drawModernTemplate = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  currentTheme: Theme,
  props: Omit<CanvasTemplateEngineProps, 'template' | 'theme'>,
  renderMarkdownOnCanvas: (
    ctx: CanvasRenderingContext2D,
    markdownText: string,
    startX: number,
    startY: number,
    maxWidth: number,
    baseFontSize: number,
    baseFontWeight: string,
    currentTheme: Theme
  ) => number
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
  ctx.font = `${props.titleFontWeight} ${props.titleFontSize}px Poppins, sans-serif`;
  ctx.textAlign = "left";

  const titleMaxWidth = w - 130;
  const titleWords = props.title.split(" ");
  let titleLine = "";
  let titleCurrentY = props.titleY;

  titleWords.forEach((word) => {
    const testLine = titleLine + (titleLine ? " " : "") + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > titleMaxWidth && titleLine) {
      ctx.fillText(titleLine, 80, titleCurrentY);
      titleLine = word;
      titleCurrentY += 85;
    } else {
      titleLine = testLine;
    }
  });
  if (titleLine) ctx.fillText(titleLine, 80, titleCurrentY);

  ctx.fillStyle = currentTheme.text;
  ctx.font = `${props.contentFontWeight} ${props.contentFontSize}px Poppins, sans-serif`;
  ctx.textAlign = "left";

  const contentMaxWidth = w - 130;
  const endY = renderMarkdownOnCanvas(
    ctx,
    props.content,
    80,
    props.contentY,
    contentMaxWidth,
    props.contentFontSize,
    props.contentFontWeight,
    currentTheme
  );

  const footerStartY = h - 130;

  if (props.showCodeSection) {
    const codeBoxY = endY + 70;
    const codePadding = 20;

    ctx.fillStyle = currentTheme.accent2;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(80, codeBoxY, w - 130, props.codeBoxHeight);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = currentTheme.accent1;
    ctx.lineWidth = 2;
    ctx.strokeRect(80, codeBoxY, w - 130, props.codeBoxHeight);

    ctx.fillStyle = currentTheme.accent1;
    ctx.font = "bold 22px Poppins, monospace";
    ctx.textAlign = "left";

    const codeLines = props.code.split("\n");
    let codeY = codeBoxY + codePadding + 20;

    codeLines.forEach((codeLine) => {
      if (codeY < codeBoxY + props.codeBoxHeight - codePadding) {
        let displayLine = codeLine;
        if (ctx.measureText(displayLine).width > w - 170) {
          displayLine = displayLine.substring(0, 40) + "...";
        }
        ctx.fillText(displayLine, 80 + codePadding, codeY);
        codeY += 32;
      }
    });
  }

  ctx.strokeStyle = currentTheme.accent1;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, footerStartY);
  ctx.lineTo(150, footerStartY);
  ctx.stroke();

  ctx.fillStyle = currentTheme.accent1;
  ctx.font = "20px Poppins, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(props.footer, 80, footerStartY + 20);

  ctx.fillStyle = currentTheme.subText;
  ctx.font = "16px Poppins, sans-serif";
  ctx.fillText("Tech Tips & Learning Resources", 80, footerStartY + 55);

  drawNextArrow(ctx, w, h, currentTheme);
};

export const drawMinimalTemplate = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  currentTheme: Theme,
  props: Omit<CanvasTemplateEngineProps, 'template' | 'theme'>,
  renderMarkdownOnCanvas: (
    ctx: CanvasRenderingContext2D,
    markdownText: string,
    startX: number,
    startY: number,
    maxWidth: number,
    baseFontSize: number,
    baseFontWeight: string,
    currentTheme: Theme
  ) => number
) => {
  ctx.fillStyle = currentTheme.bg;
  ctx.fillRect(0, 0, w, h);

  drawDecorativeCircles(ctx, w, h, currentTheme);

  ctx.fillStyle = currentTheme.accent1;
  ctx.fillRect(0, 0, 12, h);

  ctx.fillStyle = currentTheme.accent1;
  ctx.font = `${props.titleFontWeight} 24px Poppins, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(props.title.toUpperCase(), w / 2 + 30, props.titleY);

  ctx.fillStyle = currentTheme.text;
  ctx.font = `${props.contentFontWeight} ${props.contentFontSize}px Poppins, sans-serif`;
  ctx.textAlign = "center";

  const titleMaxWidth = w - 130;
  const endY = renderMarkdownOnCanvas(
    ctx,
    props.content,
    w / 2 + 30,
    props.contentY,
    titleMaxWidth,
    props.contentFontSize,
    props.contentFontWeight,
    currentTheme
  );

  if (props.showCodeSection) {
    const codeBoxY = endY + 70;
    const codePadding = 20;

    ctx.fillStyle = currentTheme.accent2;
    ctx.globalAlpha = 0.2;
    ctx.fillRect(80, codeBoxY, w - 130, props.codeBoxHeight);
    ctx.globalAlpha = 1;

    ctx.fillStyle = currentTheme.accent1;
    ctx.font = "bold 20px Poppins, monospace";
    ctx.textAlign = "left";

    const codeLines = props.code.split("\n");
    let codeY = codeBoxY + 25;

    codeLines.forEach((codeLine) => {
      if (codeY < codeBoxY + props.codeBoxHeight - codePadding) {
        let displayLine = codeLine;
        if (ctx.measureText(displayLine).width > w - 130 - 40) {
          displayLine = displayLine.substring(0, 40) + "...";
        }
        ctx.fillText(displayLine, 80 + 20, codeY);
        codeY += 30;
      }
    });
  }

  ctx.fillStyle = currentTheme.accent1;
  ctx.font = "18px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(props.footer, w / 2 + 30, h - 50);

  drawNextArrow(ctx, w, h, currentTheme);
};

export const drawGradientTemplate = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  currentTheme: Theme,
  props: Omit<CanvasTemplateEngineProps, 'template' | 'theme'>,
  renderMarkdownOnCanvas: (
    ctx: CanvasRenderingContext2D,
    markdownText: string,
    startX: number,
    startY: number,
    maxWidth: number,
    baseFontSize: number,
    baseFontWeight: string,
    currentTheme: Theme
  ) => number
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
  ctx.font = `${props.titleFontWeight} ${
    props.titleFontSize * 0.67
  }px Poppins, sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(props.title, boxPadding + 60, props.titleY);

  ctx.fillStyle = currentTheme.bg;
  ctx.font = `${props.contentFontWeight} ${props.contentFontSize}px Poppins, sans-serif`;
  ctx.textAlign = "left";

  const contentMaxWidth = w - 2 * boxPadding - 120;
  const endY = renderMarkdownOnCanvas(
    ctx,
    props.content,
    boxPadding + 60,
    props.contentY,
    contentMaxWidth,
    props.contentFontSize,
    props.contentFontWeight,
    currentTheme
  );

  if (props.showCodeSection) {
    const codeBoxY = endY + 40;
    ctx.fillStyle = currentTheme.accent1;
    ctx.globalAlpha = 0.1;
    ctx.fillRect(
      boxPadding + 60,
      codeBoxY,
      w - 2 * boxPadding - 120,
      props.codeBoxHeight
    );
    ctx.globalAlpha = 1;

    ctx.fillStyle = currentTheme.accent1;
    ctx.font = "bold 18px Poppins, monospace";

    const codeLines = props.code.split("\n");
    let codeY = codeBoxY + 25;

    codeLines.forEach((codeLine) => {
      if (codeY < codeBoxY + props.codeBoxHeight - 20) {
        ctx.fillText(codeLine, boxPadding + 75, codeY);
        codeY += 28;
      }
    });
  }

  ctx.fillStyle = currentTheme.text;
  ctx.font = "18px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(props.footer, w / 2 + 30, h - 30);

  drawNextArrow(ctx, w, h, currentTheme);
};

export const drawCanvasTemplate = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  template: TemplateName,
  theme: Theme,
  props: Omit<CanvasTemplateEngineProps, 'template' | 'theme'>,
  renderMarkdownOnCanvas: (
    ctx: CanvasRenderingContext2D,
    markdownText: string,
    startX: number,
    startY: number,
    maxWidth: number,
    baseFontSize: number,
    baseFontWeight: string,
    currentTheme: Theme
  ) => number
) => {
  if (template === "modern") {
    drawModernTemplate(ctx, w, h, theme, props, renderMarkdownOnCanvas);
  } else if (template === "minimal") {
    drawMinimalTemplate(ctx, w, h, theme, props, renderMarkdownOnCanvas);
  } else if (template === "gradient") {
    drawGradientTemplate(ctx, w, h, theme, props, renderMarkdownOnCanvas);
  }
};
