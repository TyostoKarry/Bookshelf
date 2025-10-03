import { type FC } from "react";
import { Button } from "../components/Button";
import { useLanguage } from "../hooks/useLanguage";
import { useModal } from "../hooks/useModal";

export const Home: FC = () => {
  const { t } = useLanguage();
  const { openModal } = useModal();

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-text text-3xl text-shadow-md">
        {t("common.appName")}
      </h1>
      <h2 className="text-text text-2xl text-shadow-md mb-2">
        {t("home.welcomeTitle")}
      </h2>
      <p className="text-gray-800 text-shadow-sm">{t("home.welcomeTagline")}</p>
      <p className="text-gray-700 text-shadow-sm mb-4">
        {t("home.welcomeDescription")}
      </p>
      <Button
        label={t("button.createBookshelf")}
        onClick={() => openModal("CREATE_BOOKSHELF", {})}
      />
    </div>
  );
};
