import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { useMyBookshelf } from "../../hooks/useMyBookshelf";
import { Button } from "@/components/ui/button";

export const FinalCTASection: FC = () => {
  const { t } = useLanguage();
  const { openModal } = useModal();
  const { editToken } = useMyBookshelf();
  const navigate = useNavigate();

  return (
    <section className="px-6 py-12">
      <div className="max-w-2xl mx-auto text-center p-10">
        <h3 className="text-2xl font-semibold text-foreground">
          {t("home.finalCtaTitle")}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {t("home.finalCtaSubtitle")}
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
    </section>
  );
};
