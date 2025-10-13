import { type FC } from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  color?: "success" | "danger";
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  color = "success",
  className = "",
}) => {
  const colorStyles = {
    success:
      "bg-green-600 hover:bg-green-700 active:bg-green-700/90 text-white",
    danger: "bg-red-600 hover:bg-red-700 active:bg-red-700/90 text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`${colorStyles[color]} px-4 py-2 text-shadow-lg rounded shadow-lg
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {label}
    </button>
  );
};
