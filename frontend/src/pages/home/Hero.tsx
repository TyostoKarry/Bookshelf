import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { useMyBookshelf } from "../../hooks/useMyBookshelf";
import { Button } from "@/components/ui/button";

export const Hero: FC = () => {
  const { t } = useLanguage();
  const { openModal } = useModal();
  const { editToken } = useMyBookshelf();
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center text-center px-6">
      <div className="max-w-3xl">
        <div className="mx-auto flex items-center justify-center text-center px-6 pb-6">
          <img
            src="/images/logo.png"
            alt="Bookshelf Logo"
            loading="eager"
            decoding="async"
            className="h-40 w-40 sm:h-48 sm:w-48 rounded-full"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground text-shadow-md">
          {t("home.heroTagline")}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground text-shadow-sm">
          {t("home.heroDescription")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            onClick={() => openModal("CREATE_BOOKSHELF", {})}
          >
            {t("button.createBookshelf")}
          </Button>
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => openModal("ENTER_ID", {})}
          >
            {t("button.visitBookshelf")}
          </Button>
          {editToken ? (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => navigate("/my/bookshelf")}
            >
              {t("button.openMyBookshelf")}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => openModal("ENTER_TOKEN", {})}
            >
              {t("button.iHaveAToken")}
            </Button>
          )}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center select-none pointer-events-none">
        <button
          type="button"
          onClick={() => {
            document
              .querySelector("#home-details")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="pointer-events-auto cursor-pointer inline-flex flex-col items-center text-muted-foreground/80 hover:text-muted-foreground transition-colors"
          aria-label="Scroll to details"
        >
          <span className="text-xs">{t("home.heroLearnMore")}</span>
          <svg
            className="h-5 w-5 animate-bounce-smooth"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
};
