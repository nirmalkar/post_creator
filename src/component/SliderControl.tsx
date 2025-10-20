import React from "react";

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
}

const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  unit = ""
}) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <label className="block text-sm font-bold text-teal-400 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
        <span className="text-white font-bold w-12 text-center">
          {value}{unit}
        </span>
      </div>
    </div>
  );
};

export default SliderControl;
