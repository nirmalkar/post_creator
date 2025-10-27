type Theme = {
  bg: string;
  accent1: string;
  accent2: string;
  text: string;
  subText: string;
};

export type { Theme };

type TextSegment = {
  text: string;
  isBold: boolean;
  isItalic: boolean;
  isCode: boolean;
};

export type { TextSegment };

// Parse inline markdown formatting (bold, italic, code)
export const parseInlineMarkdown = (text: string): TextSegment[] => {
  const segments: TextSegment[] = [];

  if (!text || text.length === 0) {
    return segments;
  }

  let currentText = '';
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (char === '`') {
      // Handle code blocks
      if (currentText.length > 0) {
        segments.push({
          text: currentText,
          isBold: false,
          isItalic: false,
          isCode: false,
        });
        currentText = '';
      }

      // Find closing backtick
      let codeContent = '';
      i++; // Skip opening backtick
      while (i < text.length && text[i] !== '`') {
        codeContent += text[i];
        i++;
      }

      if (i < text.length && text[i] === '`') {
        i++; // Skip closing backtick
        if (codeContent.length > 0) {
          segments.push({
            text: codeContent,
            isBold: false,
            isItalic: false,
            isCode: true,
          });
        }
      }
    }
    else if (char === '*') {
      // Handle bold (**text**) or italic (*text*)
      if (i + 1 < text.length && text[i + 1] === '*') {
        // Bold formatting
        if (currentText.length > 0) {
          segments.push({
            text: currentText,
            isBold: false,
            isItalic: false,
            isCode: false,
          });
          currentText = '';
        }

        // Find closing **
        let boldContent = '';
        i += 2; // Skip opening **
        while (i < text.length && !(text[i] === '*' && i + 1 < text.length && text[i + 1] === '*')) {
          boldContent += text[i];
          i++;
        }

        if (i + 1 < text.length && text[i] === '*' && text[i + 1] === '*') {
          i += 2; // Skip closing **
          if (boldContent.length > 0) {
            segments.push({
              text: boldContent,
              isBold: true,
              isItalic: false,
              isCode: false,
            });
          }
        }
      } else {
        // Italic formatting
        if (currentText.length > 0) {
          segments.push({
            text: currentText,
            isBold: false,
            isItalic: false,
            isCode: false,
          });
          currentText = '';
        }

        // Find closing *
        let italicContent = '';
        i++; // Skip opening *
        while (i < text.length && text[i] !== '*') {
          italicContent += text[i];
          i++;
        }

        if (i < text.length && text[i] === '*') {
          i++; // Skip closing *
          if (italicContent.length > 0) {
            segments.push({
              text: italicContent,
              isBold: false,
              isItalic: true,
              isCode: false,
            });
          }
        }
      }
    }
    else {
      // Regular text
      currentText += char;
      i++;
    }
  }

  // Add any remaining text
  if (currentText.length > 0) {
    segments.push({
      text: currentText,
      isBold: false,
      isItalic: false,
      isCode: false,
    });
  }

  return segments.filter((segment) => segment.text.length > 0);
};

// Render markdown text on canvas with formatting support
export const renderMarkdownOnCanvas = (
  ctx: CanvasRenderingContext2D,
  markdownText: string,
  startX: number,
  startY: number,
  maxWidth: number,
  baseFontSize: number,
  baseFontWeight: string,
  currentTheme: Theme
): number => {
  const lines = markdownText.split("\n");
  let currentY = startY;

  lines.forEach((line) => {
    if (line.trim() === "") {
      currentY += Math.round(baseFontSize * 1.3);
      return;
    }

    // Check if this is a header
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const headerText = headerMatch[2];

      // Calculate header font size (larger for higher level headers)
      const headerSize = Math.max(
        baseFontSize * (2.5 - level * 0.3),
        baseFontSize * 0.8
      );
      ctx.font = `${baseFontWeight} ${headerSize}px Poppins, sans-serif`;
      ctx.fillStyle = currentTheme.text;

      const words = headerText.split(" ");
      let lineText = "";
      let testY = currentY;

      words.forEach((word) => {
        const testLine = lineText + (lineText ? " " : "") + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && lineText) {
          ctx.fillText(lineText, startX, testY);
          lineText = word;
          testY += Math.round(headerSize * 1.2);
        } else {
          lineText = testLine;
        }
      });

      if (lineText) {
        ctx.fillText(lineText, startX, testY);
        currentY = testY + Math.round(headerSize * 1.2);
      }
      return;
    }

    // Check if this is a list item
    const listMatch = line.match(/^(?:\s*)[-*+]\s+(.+)$/);
    const numberedListMatch = line.match(/^(?:\s*)(\d+)\.\s+(.+)$/);
    const isListItem = listMatch || numberedListMatch;
    const listPrefix = listMatch
      ? "• "
      : numberedListMatch
      ? `${numberedListMatch[1]}. `
      : "";
    const listText = listMatch
      ? listMatch[1]
      : numberedListMatch
      ? numberedListMatch[2]
      : line;

    // Regular paragraph text with inline formatting
    ctx.font = `${baseFontWeight} ${baseFontSize}px Poppins, sans-serif`;

    // Process inline formatting (bold, italic, code)
    const segments = parseInlineMarkdown(listText);

    let lineX = startX;
    if (isListItem) {
      // Draw list prefix
      ctx.fillStyle = currentTheme.text;
      ctx.fillText(listPrefix, startX, currentY);
      lineX = startX + ctx.measureText(listPrefix).width + 8;
    }

    let segmentX = lineX;
    segments.forEach((segment, index) => {
      // Set font style based on formatting
      let fontWeight = baseFontWeight;
      let fontFamily = "Poppins, sans-serif";

      if (segment.isBold) fontWeight = "800"; // Use extra bold for more visibility
      if (segment.isCode) {
        fontFamily = "monospace";
      }

      // Apply font styling first
      ctx.font = `${fontWeight} ${baseFontSize}px ${fontFamily}`;

      // Set color based on formatting
      if (segment.isCode) {
        ctx.fillStyle = currentTheme.accent1;
      } else if (segment.isItalic) {
        // Use a slightly different color for italic text
        const originalColor = currentTheme.text;
        if (originalColor === "#ffffff") {
          ctx.fillStyle = "#cccccc"; // Light gray for white background
        } else if (originalColor === "#1a202c") {
          ctx.fillStyle = "#4a5568"; // Medium gray for dark text
        } else {
          ctx.fillStyle = originalColor; // Keep original color
        }
      } else {
        ctx.fillStyle = currentTheme.text;
      }

      const words = segment.text.split(" ");
      let segmentLine = "";

      words.forEach((word) => {
        const testSegment = segmentLine + (segmentLine ? " " : "") + word;
        const metrics = ctx.measureText(testSegment);

        if (segmentX + metrics.width > startX + maxWidth && segmentLine) {
          // Move to next line
          ctx.fillText(segmentLine, segmentX, currentY);
          segmentLine = word;
          segmentX = lineX;
          currentY += Math.round(baseFontSize * 1.3);
        } else {
          segmentLine = testSegment;
        }
      });

      if (segmentLine) {
        ctx.fillText(segmentLine, segmentX, currentY);

        // Check if next segment is normal text (no formatting)
        const nextSegment = segments[index + 1];
        const isNextNormalText =
          !nextSegment ||
          (!nextSegment.isBold &&
            !nextSegment.isItalic &&
            !nextSegment.isCode);

        // Add right margin based on formatting style and next segment
        let rightMargin = 0;
        if (
          (segment.isBold || segment.isItalic || segment.isCode) &&
          isNextNormalText
        ) {
          rightMargin = 10; // One space unit margin for formatted text (only if next is normal)
        }

        segmentX += ctx.measureText(segmentLine).width + 2 + rightMargin;
      }
    });

    currentY += Math.round(baseFontSize * 1.3);
  });

  return currentY;
};
