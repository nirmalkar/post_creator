import React from "react";

interface ToggleControlProps {
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
  description?: string;
}

const ToggleControl: React.FC<ToggleControlProps> = ({
  label,
  isEnabled,
  onToggle,
  description
}) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <label className="block text-sm font-bold text-teal-400 mb-4">
        {label}
      </label>
      <button
        onClick={onToggle}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
          isEnabled
            ? "bg-teal-500 text-white shadow-lg"
            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
        }`}
      >
        {isEnabled ? "✓ " + label + " Enabled" : label + " Disabled"}
      </button>
      {description && (
        <p className="text-xs text-gray-500 mt-2">
          {description}
        </p>
      )}
    </div>
  );
};

export default ToggleControl;
