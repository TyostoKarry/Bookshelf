import { type FC } from "react";
import { Controller, type Control } from "react-hook-form";
import type { BookPageMode } from "../../../types/book-page-mode";
import type { BookForm } from "../../../validation/bookFormSchema";
import { DatePicker } from "../DatePicker";
import { FieldErrorMessage } from "../FieldErrorMessage";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DetailProps {
  label: string;
  value?: string | number | null | undefined;
  mode: BookPageMode;
  type?: "text" | "number" | "numeric" | "date" | "select";
  options?: readonly string[];
  placeholder?: string;
  error?: string;
  control?: Control<BookForm>;
  controlName: keyof BookForm;
  clampNumberToInt32?: boolean;
  defaultValue?: number;
}

export const Detail: FC<DetailProps> = ({
  label,
  value,
  mode,
  type,
  options,
  placeholder,
  error,
  control,
  controlName,
  clampNumberToInt32 = true,
  defaultValue,
}) => {
  const MAX_INT_32 = 2_147_483_647;

  if (mode === "view") {
    return (
      <div className="flex items-baseline justify-between border-b border-gray-100 pb-1">
        <label className="flex-1 text-muted-foreground text-sm">{label}</label>
        <span className="text-foreground text-sm font-medium">
          {value ?? "—"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Controller
        control={control}
        name={controlName}
        render={({ field }) => (
          <div className="flex items-baseline justify-between border-b border-gray-100 pb-1">
            <label
              className={`flex ${error ? "text-destructive" : "text-muted-foreground"} text-sm w-[6rem] md:w-[8rem]`}
            >
              {label}
            </label>
            {type === "select" && (
              <Select
                key={String(field.value) || controlName}
                onValueChange={field.onChange}
                value={
                  typeof field.value === "string" && field.value.trim() !== ""
                    ? field.value.toString()
                    : (options?.[0] ?? "")
                }
              >
                <SelectTrigger
                  className={`flex-1 w-full justify-end text-right hover:bg-accent/40 ${error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"}`}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {(options || []).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {type === "number" && (
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className={`flex-1 w-full text-right hover:bg-accent/40 ${error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"}`}
                placeholder={placeholder}
                value={
                  typeof field.value === "number" && !Number.isNaN(field.value)
                    ? field.value
                    : ""
                }
                onChange={(event) => {
                  const raw = event.target.value.trim();
                  if (raw === "") {
                    field.onChange(defaultValue ?? null);
                    return;
                  }
                  let num = Number(raw);
                  if (clampNumberToInt32 && !Number.isNaN(num)) {
                    if (num > MAX_INT_32) num = MAX_INT_32;
                    if (num < 0) num = 0;
                  }
                  field.onChange(Number.isNaN(num) ? null : num);
                }}
              />
            )}
            {type === "numeric" && (
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className={`flex-1 w-full text-right hover:bg-accent/40 ${error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"}`}
                placeholder={placeholder}
                value={typeof field.value === "string" ? field.value : ""}
                onChange={(event) => {
                  const raw = event.target.value.trim();
                  if (raw === "") {
                    field.onChange(null);
                    return;
                  }
                  const digitsOnly = raw.replace(/\D+/g, "");
                  const clamped = digitsOnly.slice(0, 13);
                  field.onChange(clamped || null);
                }}
              />
            )}
            {type === "date" && (
              <DatePicker
                value={
                  typeof field.value === "string" && field.value.trim() !== ""
                    ? field.value
                    : null
                }
                onChange={field.onChange}
                error={!!error}
              />
            )}
            {type === "text" && (
              <Input
                type="text"
                className={`flex-1 w-full text-right hover:bg-accent/40 ${error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"}`}
                placeholder={placeholder}
                {...field}
                value={typeof field.value === "string" ? field.value : ""}
              />
            )}
          </div>
        )}
      />
      <FieldErrorMessage message={error} align="right" />
    </div>
  );
};
