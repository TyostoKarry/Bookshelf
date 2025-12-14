import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { Button } from "@/components/ui/button";

export const DemoBookshelf: FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const DEMO_BOOKSHELF_PUBLIC_ID = import.meta.env
    .VITE_DEMO_BOOKSHELF_PUBLIC_ID;

  if (!DEMO_BOOKSHELF_PUBLIC_ID) return null;

  return (
    <section id="home-details" className="px-6 py-12">
      <div className="max-w-2xl mx-auto text-center p-10">
        <h3 className="text-2xl font-semibold text-foreground">
          {t("home.demoBookshelfTitle")}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {t("home.demoBookshelfDescription")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="default"
            className="hover:cursor-pointer"
            onClick={() => navigate(`/bookshelves/${DEMO_BOOKSHELF_PUBLIC_ID}`)}
          >
            {t("button.viewDemoBookshelf")}
          </Button>
        </div>
      </div>
    </section>
  );
};
