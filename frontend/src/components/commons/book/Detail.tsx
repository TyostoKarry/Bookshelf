import { type FC, type ReactNode } from "react";

interface DetailProps {
  label: string;
  value?: ReactNode | null;
}

export const Detail: FC<DetailProps> = ({ label, value }) => {
  return (
    <div className="flex items-baseline justify-between border-b border-gray-100 pb-1">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="text-gray-900 text-sm font-medium">
        {value || "———"}
      </span>
    </div>
  );
};
