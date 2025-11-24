import { type FC } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { BookPageMode } from "../../../types/book-page-mode";
import { FieldErrorMessage } from "../FieldErrorMessage";

interface DetailProps {
  label: string;
  value?: string | number | null | undefined;
  mode: BookPageMode;
  type?: "text" | "number" | "date" | "select";
  options?: readonly string[];
  placeholder?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  clampNumberToInt32?: boolean;
}

export const Detail: FC<DetailProps> = ({
  label,
  value,
  mode,
  type,
  options,
  placeholder,
  error,
  register,
  clampNumberToInt32 = true,
}) => {
  const MAX_INT_32 = 2_147_483_647;

  if (mode === "view") {
    return (
      <div className="flex items-baseline justify-between border-b border-gray-100 pb-1">
        <label className="flex-1 text-gray-600 text-sm">{label}</label>
        <span className="text-gray-900 text-sm font-medium">
          {value ?? "—"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between border-b border-gray-100 pb-1">
        <label className="flex-1 text-gray-600 text-sm">{label}</label>
        {type === "select" && (
          <select
            {...register}
            className={`flex-2 text-end border ${error ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm text-gray-900`}
          >
            {(options as readonly string[]).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
        {type === "number" && (
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className={`flex-2 text-end border ${error ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm text-gray-900`}
            placeholder={placeholder}
            {...register}
            onInput={(event) => {
              const target = event.target as HTMLInputElement;
              let newValue = target.value.replace(/\D+/g, "");
              if (clampNumberToInt32 && newValue) {
                const numericValue = Number(newValue);
                if (numericValue > MAX_INT_32) newValue = MAX_INT_32.toString();
              }
              target.value = newValue;
            }}
          />
        )}
        {type === "date" && (
          <input
            type="date"
            className={`flex-2 justify-items-end border ${error ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm text-gray-900`}
            placeholder={placeholder}
            {...register}
          />
        )}
        {type === "text" && (
          <input
            type="text"
            className={`flex-2 text-end border ${error ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm text-gray-900`}
            placeholder={placeholder}
            {...register}
          />
        )}
      </div>
      <FieldErrorMessage message={error} align="right" />
    </div>
  );
};
