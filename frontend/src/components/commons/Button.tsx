import { type FC } from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  color?: "success" | "danger" | "neutral";
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  color = "success",
  className = "",
}) => {
  const colorStyles = {
    success:
      "bg-green-600 hover:bg-green-700 active:bg-green-700/90 text-white",
    danger: "bg-red-600 hover:bg-red-700 active:bg-red-700/90 text-white",
    neutral: "bg-gray-500 hover:bg-gray-600 active:bg-gray-600/90 text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${colorStyles[color]} px-4 py-2 text-shadow-lg rounded shadow-lg
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {label}
    </button>
  );
};
