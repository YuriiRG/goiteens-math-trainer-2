import type { ReactNode } from "react";
import { useState, Fragment } from "react";
import { z } from "zod";
import { pointDistance, vectorLength } from "./math";
import Latex from "./components/Latex";

const floatRegex = /^-?[0-9]+([.,][0-9]+)?$/;
const floatTransform = (str: string): number => {
  return Number(str.replace(",", "."));
};

const floatArraySchema = z.array(
  z.string().regex(floatRegex).transform(floatTransform),
);

export default function App() {
  const [vectorStr, setVectorStr] = useState<string[]>(["0", "0"]);
  const [startPointStr, setStartPointStr] = useState<string[]>(["0", "0"]);
  const [endPointStr, setEndPointStr] = useState<string[]>(["0", "0"]);
  const [mode, setMode] = useState<string>("coords");
  const [showResult, setShowResult] = useState(false);

  const vectorParseResult = floatArraySchema.safeParse(vectorStr);
  const vector = vectorParseResult.success ? vectorParseResult.data : undefined;

  const startParseResult = floatArraySchema.safeParse(startPointStr);
  const startPoint = startParseResult.success
    ? startParseResult.data
    : undefined;

  const endParseResult = floatArraySchema.safeParse(endPointStr);
  const endPoint = endParseResult.success ? endParseResult.data : undefined;

  let result: number | undefined = undefined;
  if (vector && mode === "coords") {
    result = vectorLength(vector);
  } else if (startPoint && endPoint && mode === "points") {
    result = pointDistance(startPoint, endPoint);
  }

  return (
    <div className="flex justify-center p-2">
      <main className="w-[65ch]">
        <h1 className="text-3xl font-bold mb-3">
          Калькулятор для обрахунку довжини вектора (модуля вектора)
        </h1>
        <Select
          label="Розмірність вектора:"
          id="dimensions"
          value={vectorStr.length}
          onChange={(e) => {
            setVectorStr(Array(Number(e.target.value)).fill("0"));
            setStartPointStr(Array(Number(e.target.value)).fill("0"));
            setEndPointStr(Array(Number(e.target.value)).fill("0"));
            setShowResult(false);
          }}
          options={[
            { value: "2", text: "2" },
            { value: "3", text: "3" },
            { value: "4", text: "4" },
            { value: "5", text: "5" },
            { value: "6", text: "6" },
          ]}
        />
        <Select
          label={
            <>
              Форма представлення вектора{" "}
              <Latex className="inline" text="\vec{a}" />
              {""}:
            </>
          }
          id="mode"
          value={mode}
          onChange={(e) => {
            setShowResult(false);
            setMode(e.target.value);
          }}
          options={[
            { value: "coords", text: "Координатами" },
            { value: "points", text: "Точками" },
          ]}
        />
        <p className="mb-1">Введіть значення вектора:</p>
        {mode === "coords" && (
          <VectorInput
            value={vectorStr}
            setValue={(newValue) => {
              setShowResult(false);
              setVectorStr(newValue);
            }}
            startLabel={<Latex className="inline" text="\vec{a} = \{" />}
            separator={<Latex className="inline" text=";\ " />}
            endLabel={<Latex className="inline" text="\}" />}
          />
        )}
        {mode === "points" && (
          <>
            <p className="mb-1">Початкова точка</p>
            <VectorInput
              value={startPointStr}
              setValue={(newValue) => {
                setShowResult(false);
                setStartPointStr(newValue);
              }}
              startLabel={<Latex className="inline" text="A = (" />}
              separator={<Latex className="inline" text=",\ " />}
              endLabel={<Latex className="inline" text=")" />}
            />
            <p className="mb-1">Кінцева точка</p>
            <VectorInput
              value={endPointStr}
              setValue={(newValue) => {
                setShowResult(false);
                setEndPointStr(newValue);
              }}
              startLabel={<Latex className="inline" text="B = (" />}
              separator={<Latex className="inline" text=",\ " />}
              endLabel={<Latex className="inline" text=")" />}
            />
          </>
        )}
        <button
          className="mb-2 p-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded"
          onClick={() => setShowResult(true)}
        >
          Порахувати
        </button>
        <br />
        {!showResult && <Latex text={`|\\vec{a}| =`} />}
        {showResult && result !== undefined && (
          <Latex
            text={`|\\vec{a}| ${
              Number.isInteger(result) ? "=" : "\\approx"
            } ${result}`}
          />
        )}
        {showResult && result === undefined && <>Невірні вхідні дані</>}

        <h2 className="text-2xl mt-2">Теорія</h2>
        <p>
          Модуль вектора (довжина вектора){" "}
          <Latex className="inline" text="|\vec{a}|" /> в прямокутних декартових
          координатах дорівнює квадратному кореню з суми квадратів його
          координат.
        </p>
        <p>
          Наприклад для вектора{" "}
          <Latex className="inline" text="\vec{a} = \{a_x; a_y; a_z\}" />{" "}
          довжина вектора обраховується наступним чином:
        </p>
        <Latex text="|\vec{a}| = \sqrt{a_x^2 + a_y^2 + a_z^2}" blockMode />
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
    <fieldset className="mb-2">
      <label htmlFor={id} className="mr-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="p-1 rounded bg-gray-200 align-baseline"
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

function VectorInput({
  value,
  setValue,
  startLabel,
  endLabel,
  separator,
}: {
  value: string[];
  setValue: (newValue: string[]) => void;
  startLabel?: ReactNode;
  endLabel?: ReactNode;
  separator?: ReactNode;
}) {
  return (
    <fieldset className="mb-2">
      {startLabel}
      {value.map((num, i) => (
        <Fragment key={i}>
          <input
            type="string"
            className="w-10 border-2 border-gray-200 rounded"
            value={num}
            onChange={(e) => {
              setValue(value.map((old, j) => (j === i ? e.target.value : old)));
            }}
          />
          {i !== value.length - 1 ? separator : null}
        </Fragment>
      ))}
      {endLabel}
    </fieldset>
  );
}
