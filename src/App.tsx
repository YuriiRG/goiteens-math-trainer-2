import type { ReactNode } from "react";
import { useState } from "react";
export default function App() {
  const [dimensions, setDimensions] = useState<string | number>(2);
  const [mode, setMode] = useState<string | number>("coords");
  return (
    <div className="flex justify-center p-2">
      <main className="w-[65ch]">
        <Select
          label="Розмірність вектора:"
          id="dimensions"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          options={[
            { value: 2, text: 2 },
            { value: 3, text: 3 },
            { value: 4, text: 4 },
            { value: 5, text: 5 },
            { value: 6, text: 6 },
          ]}
        />
        <Select
          label="Форма представлення вектора:"
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          options={[
            { value: "coords", text: "Координатами" },
            { value: "points", text: "Точками" },
          ]}
        />
        {mode === "coords" && <>coords {dimensions}</>}
        {mode === "points" && <>points {dimensions}</>}
      </main>
    </div>
  );
}

function Select({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: ReactNode;
  options: { value: string | number; text: ReactNode }[];
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  return (
    <fieldset>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="ml-2 p-1 rounded bg-gray-200 align-baseline"
      >
        {options.map(({ value, text }) => (
          <option key={value} value={value} className="">
            {text}
          </option>
        ))}
      </select>
    </fieldset>
  );
}
