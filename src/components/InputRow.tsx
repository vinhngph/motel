interface InputRowProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  unit?: string;
  type?: "number" | "text";
  inputMode?: "numeric" | "decimal" | "text";
}

export function InputRow({
  label,
  value,
  onChange,
  placeholder,
  unit = "Số",
  type = "number",
  inputMode = "numeric",
}: InputRowProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-14 text-center text-xl font-semibold text-gray-600 bg-gray-100 rounded-xl py-4 shrink-0">
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        className="flex-1 border-2 border-gray-200 rounded-xl text-xl px-4 py-4 outline-none focus:border-gray-500 min-w-0 bg-white"
        style={{ fontSize: "1.25rem" }}
      />
      <span className="text-lg text-gray-500 shrink-0">{unit}</span>
    </div>
  );
}
