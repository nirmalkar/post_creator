import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  rows?: number;
  showCounter?: boolean;
  previewMode?: "split" | "edit" | "preview";
  onPreviewModeChange?: (mode: "split" | "edit" | "preview") => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  rows = 6,
  showCounter = false,
  previewMode = "split",
  onPreviewModeChange,
}) => {
  const currentLength = value.length;

  const insertMarkdown = (before: string, after: string = "", placeholder: string = "text") => {
    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    const newText = before + textToInsert + after;

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const MarkdownToolbar = () => (
    <div className="flex flex-wrap gap-1 p-2 bg-slate-700 rounded-t-lg border-b border-slate-600">
      <button
        type="button"
        onClick={() => insertMarkdown("**", "**", "bold text")}
        className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown("*", "*", "italic text")}
        className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown("~~", "~~", "strikethrough")}
        className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <div className="w-px h-6 bg-slate-600 mx-1" />
      <button
        type="button"
        onClick={() => insertMarkdown("## ", "", "Heading")}
        className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        title="Heading"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown("### ", "", "Subheading")}
        className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        title="Subheading"
      >
        H3
      </button>
      <div className="w-px h-6 bg-slate-600 mx-1" />
      <button
        type="button"
        onClick={() => insertMarkdown("- ", "", "List item")}
        className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        title="Bullet List"
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown("1. ", "", "List item")}
        className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        title="Numbered List"
      >
        1. List
      </button>
      <div className="w-px h-6 bg-slate-600 mx-1" />
      <button
        type="button"
        onClick={() => insertMarkdown("[", "](url)", "link text")}
        className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        title="Link"
      >
        🔗
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown("`", "`", "code")}
        className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        title="Inline Code"
      >
        `code`
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown("```\n", "\n```", "code block")}
        className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        title="Code Block"
      >
        ```block```
      </button>

      <div className="flex-1" />

      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onPreviewModeChange?.("edit")}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            previewMode === "edit"
              ? "bg-teal-600 text-white"
              : "bg-slate-600 hover:bg-slate-500 text-white"
          }`}
          title="Edit Only"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onPreviewModeChange?.("split")}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            previewMode === "split"
              ? "bg-teal-600 text-white"
              : "bg-slate-600 hover:bg-slate-500 text-white"
          }`}
          title="Split View"
        >
          Split
        </button>
        <button
          type="button"
          onClick={() => onPreviewModeChange?.("preview")}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            previewMode === "preview"
              ? "bg-teal-600 text-white"
              : "bg-slate-600 hover:bg-slate-500 text-white"
          }`}
          title="Preview Only"
        >
          Preview
        </button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="h-full overflow-y-auto p-4 bg-slate-50 text-slate-900">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold text-slate-900 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold text-slate-900 mb-1">{children}</h3>,
          p: ({ children }) => <p className="text-slate-900 mb-2">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
          em: ({ children }) => <em className="italic text-slate-900">{children}</em>,
          code: ({ children }) => <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded text-sm">{children}</code>,
          pre: ({ children }) => <pre className="bg-slate-800 text-slate-100 p-3 rounded mb-2 overflow-x-auto">{children}</pre>,
          ul: ({ children }) => <ul className="list-disc list-inside text-slate-900 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-slate-900 mb-2">{children}</ol>,
          li: ({ children }) => <li className="text-slate-900">{children}</li>,
          a: ({ children, href }) => <a href={href} className="text-blue-600 hover:text-blue-800 underline">{children}</a>,
        }}
      >
        {value || "*Preview will appear here*"}
      </ReactMarkdown>
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg">
      <label className="block text-sm font-bold text-teal-400 mb-2 px-6 pt-6">
        {label}
      </label>

      <div className="bg-slate-700 rounded-lg mx-6 mb-6 overflow-hidden">
        <MarkdownToolbar />

        {previewMode === "edit" && (
          <textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
            rows={rows}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-slate-600 text-white rounded-b-lg border-0 focus:outline-none text-sm resize-none font-mono"
            style={{ minHeight: `${rows * 1.5}em` }}
          />
        )}

        {previewMode === "preview" && (
          <div className="rounded-b-lg">
            {renderPreview()}
          </div>
        )}

        {previewMode === "split" && (
          <div className="flex rounded-b-lg" style={{ height: `${rows * 1.5}em` }}>
            <div className="flex-1 relative">
              <textarea
                id="markdown-textarea"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                maxLength={maxLength}
                rows={rows}
                placeholder={placeholder}
                className="w-full h-full px-4 py-3 bg-slate-600 text-white border-0 focus:outline-none text-sm resize-none font-mono"
              />
            </div>
            <div className="w-px bg-slate-600" />
            <div className="flex-1">
              {renderPreview()}
            </div>
          </div>
        )}
      </div>

      {showCounter && maxLength && (
        <p className="text-xs text-gray-500 mt-1 px-6 pb-6">
          {currentLength}/{maxLength}
        </p>
      )}

      {/* Markdown Help */}
      <div className="px-6 pb-6">
        <div className="text-xs text-slate-400">
          <div className="p-3 bg-slate-700 rounded text-slate-300 font-mono text-xs">
            <div><strong>Markdown Quick Reference:</strong></div>
            <div>**bold** *italic* ~~strikethrough~~</div>
            <div>## Headers # Links [text](url)</div>
            <div>- Bullet • 1. Numbered lists</div>
            <div>`inline` ```code blocks```</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
