import React from "react";

interface InputControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  type?: "text" | "textarea";
  rows?: number;
  showCounter?: boolean;
}

const InputControl: React.FC<InputControlProps> = ({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  type = "text",
  rows = 3,
  showCounter = false,
}) => {
  const currentLength = value.length;

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <label className="block text-sm font-bold text-teal-400 mb-2">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none text-sm resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none text-sm"
        />
      )}
      {showCounter && maxLength && (
        <p className="text-xs text-gray-500 mt-1">
          {currentLength}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default InputControl;
