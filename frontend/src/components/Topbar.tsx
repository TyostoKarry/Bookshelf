import { type FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { useLanguage } from "../hooks/useLanguage";

export const Topbar: FC = () => {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center justify-between h-16 px-4 bg-primary">
      <Link to="/" className="text-text text-2xl text-shadow-sm font-bold">
        {t("common.appName")}
      </Link>
      <Button
        label={t("button.openBookshelf")}
        onClick={() => alert("Open Bookshelf")}
      />
    </nav>
  );
};
