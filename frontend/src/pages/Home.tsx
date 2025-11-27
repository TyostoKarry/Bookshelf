import { type FC } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useModal } from "../hooks/useModal";
import { Button } from "@/components/ui/button";

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
      <p className="text-muted-foreground text-shadow-sm">
        {t("home.welcomeTagline")}
      </p>
      <p className="text-muted-foreground text-shadow-sm mb-4">
        {t("home.welcomeDescription")}
      </p>
      <Button
        variant="default"
        className="bg-primary text-xl text-primary-foreground hover:bg-primary/90 hover:cursor-pointer px-6 py-6"
        onClick={() => openModal("CREATE_BOOKSHELF", {})}
      >
        {t("button.createBookshelf")}
      </Button>
    </div>
  );
};
