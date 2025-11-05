import { type FC } from "react";
import { useLanguage } from "../../../hooks/useLanguage";

interface MetaProps {
  label: string;
  value?: string | null;
}

export const Meta: FC<MetaProps> = ({ label, value }) => {
  const { t } = useLanguage();
  return (
    <div>
      <span className="text-gray-500 text-sm">{label}:</span>{" "}
      <span className="font-medium text-gray-800">
        {value || t("common.unknown")}
      </span>
    </div>
  );
};
