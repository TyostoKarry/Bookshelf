import { type ChangeEvent, type FC, type ReactNode } from "react";
import type { BookPageMode } from "../../../types/book-page-mode";

interface ToggleOption {
  value: boolean;
  label: ReactNode;
}

interface DetailProps {
  label: string;
  value?: ReactNode | null;
  mode: BookPageMode;
  type?: "text" | "number" | "date" | "select" | "toggle";
  options?: readonly string[] | readonly ToggleOption[];
  onChange?: (newValue: string | number | boolean | null) => void;
  placeholder?: string;
  fieldError?: boolean;
  onFocus?: () => void;
  maxNumber?: number;
}

export const Detail: FC<DetailProps> = ({
  label,
  value,
  mode,
  type,
  options,
  onChange,
  placeholder,
  fieldError = false,
  onFocus,
  maxNumber = 99999,
}) => {
  const isSelectArray =
    Array.isArray(options) && typeof options[0] === "string";
  const isToggleArray =
    Array.isArray(options) && typeof options[0] === "object";

  let activeOption: ToggleOption | undefined;
  if (type === "toggle" && isToggleArray) {
    activeOption = (options as ToggleOption[]).find(
      (opt) => opt.value === value,
    );
  }

  return (
    <div className="flex items-baseline justify-between border-b border-gray-100 pb-1">
      <label className="flex-1 text-gray-600 text-sm">{label}</label>
      {mode === "edit" || mode === "create" ? (
        type === "select" && isSelectArray ? (
          <select
            className="flex-2 text-end border border-gray-300 rounded-md p-2 text-sm text-gray-900"
            value={(value as string) || ""}
            onChange={(ChangeEvent: ChangeEvent<HTMLSelectElement>) =>
              onChange?.(ChangeEvent.target.value)
            }
          >
            {(options as readonly string[]).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : type === "toggle" && isToggleArray ? (
          <button
            type="button"
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition"
            onClick={() =>
              onChange?.(
                options.find((option) => option.value !== value)?.value ??
                  !value,
              )
            }
          >
            {activeOption?.label}
          </button>
        ) : type === "number" ? (
          <input
            type="number"
            min={0}
            max={maxNumber}
            className={`flex-2 text-end border ${fieldError ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm text-gray-900`}
            value={value != null ? (value as number) : ""}
            placeholder={placeholder}
            onChange={(ChangeEvent: ChangeEvent<HTMLInputElement>) => {
              const value = ChangeEvent.target.value.trim();
              if (value === "") {
                onChange?.(null);
                return;
              }
              let number = Number(value);
              if (isNaN(number)) {
                onChange?.(null);
                return;
              }
              if (number < 0) number = 0;
              if (number > maxNumber) number = maxNumber;
              onChange?.(number);
            }}
            onFocus={onFocus}
          />
        ) : type === "date" ? (
          <input
            type="date"
            className="flex-2 justify-items-end border border-gray-300 rounded-md p-2 text-sm text-gray-900"
            value={value != null ? (value as string) : ""}
            placeholder={placeholder}
            onChange={(ChangeEvent: ChangeEvent<HTMLInputElement>) =>
              onChange?.(ChangeEvent.target.value)
            }
          />
        ) : (
          <input
            type="text"
            className={`flex-2 text-end border ${fieldError ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm text-gray-900`}
            value={(value as string) || ""}
            placeholder={placeholder}
            onChange={(ChangeEvent: ChangeEvent<HTMLInputElement>) =>
              onChange?.(ChangeEvent.target.value)
            }
            onFocus={onFocus}
          />
        )
      ) : type === "toggle" ? (
        <div className="flex items-center gap-1">
          {activeOption?.label ?? <span className="text-gray-900">———</span>}
        </div>
      ) : (
        <span className="flex-2 text-end justify-items-end text-gray-900 text-sm font-medium">
          {value !== null && value !== undefined && value !== ""
            ? value
            : "———"}
        </span>
      )}
    </div>
  );
};
