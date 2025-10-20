import React from "react";

type TemplateType = "modern" | "minimal" | "gradient";

interface TemplateOption {
  id: TemplateType;
  label: string;
}

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  const templates: TemplateOption[] = [
    { id: "modern", label: "Modern" },
    { id: "minimal", label: "Minimal" },
    { id: "gradient", label: "Gradient" },
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg border-2 border-teal-500">
      <h2 className="text-lg font-bold text-white mb-4">
        📋 Select Template
      </h2>
      <div className="space-y-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              selectedTemplate === template.id
                ? "bg-teal-500 text-white shadow-lg scale-105"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {template.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
