import { type FC } from "react";

interface FieldErrorMessageProps {
  message?: string;
  align?: "left" | "right";
}

export const FieldErrorMessage: FC<FieldErrorMessageProps> = ({
  message,
  align = "left",
}) => (
  <p
    className={`min-h-[1rem] ${align === "left" ? "text-left" : "text-right"} pl-2 text-xs transition-opacity duration-200 ${
      message ? "text-destructive opacity-100" : "opacity-0"
    }`}
  >
    {message ?? ""}
  </p>
);
