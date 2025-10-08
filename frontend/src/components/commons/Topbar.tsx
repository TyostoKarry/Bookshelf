import { type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { useMyBookshelf } from "../../hooks/useMyBookshelf";

export const Topbar: FC = () => {
  const { t } = useLanguage();
  const { editToken } = useMyBookshelf();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const handleOpenBookshelf = () => {
    if (editToken) {
      navigate("/my/bookshelf");
    } else {
      openModal("ENTER_TOKEN", {});
    }
  };

  return (
    <nav className="flex items-center justify-between h-16 px-4 bg-primary">
      <Link to="/" className="text-text text-2xl text-shadow-sm font-bold">
        {t("common.appName")}
      </Link>
      <Button
        label={t("button.openMyBookshelf")}
        onClick={handleOpenBookshelf}
      />
    </nav>
  );
};
