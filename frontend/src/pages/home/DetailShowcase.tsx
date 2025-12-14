import { type FC } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Card } from "@/components/ui/card";

export const DetailShowcase: FC = () => {
  const { t } = useLanguage();

  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-6">
        <div className="min-w-[60%] space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {t("home.detailShowcaseTitle")}
            </h2>
            <p className="text-muted-foreground mt-2">
              {t("home.detailShowcaseSubtitle")}
            </p>
          </div>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{t("home.detailPointProgress")}</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{t("home.detailPointRatings")}</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{t("home.detailPointMetadata")}</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{t("home.detailPointNotes")}</span>
            </li>
          </ul>
        </div>
        <Card className="max-w-[400px] overflow-hidden shadow-xl">
          <img
            src="/images/book-details-example.png"
            alt="Book Details Showcase"
            loading="lazy"
            className="block w-full h-auto"
          />
        </Card>
      </div>
    </section>
  );
};
