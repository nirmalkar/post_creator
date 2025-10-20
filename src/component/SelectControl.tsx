import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

const SelectControl: React.FC<SelectControlProps> = ({
  label,
  value,
  onChange,
  options
}) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <label className="block text-sm font-bold text-teal-400 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectControl;
