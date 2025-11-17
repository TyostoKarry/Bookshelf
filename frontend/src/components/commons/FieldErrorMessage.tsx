import { type FC } from "react";

interface FieldErrorMessageProps {
  message?: string;
}

export const FieldErrorMessage: FC<FieldErrorMessageProps> = ({ message }) => (
  <p
    className={`min-h-[1rem] text-left pl-2 text-xs transition-opacity duration-200 ${
      message ? "text-red-400 opacity-100" : "opacity-0"
    }`}
  >
    {message ?? ""}
  </p>
);
