import { BookOpen, Star, Search, Share2, Import, Shield } from "lucide-react";
import { type FC } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Card } from "@/components/ui/card";

export const FeaturesGrid: FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Search,
      title: t("home.featuresGridSearchTitle"),
      description: t("home.featuresGridSearchDescription"),
    },
    {
      icon: BookOpen,
      title: t("home.featuresGridBookOpenTitle"),
      description: t("home.featuresGridBookOpenDescription"),
    },
    {
      icon: Star,
      title: t("home.featuresGridStarTitle"),
      description: t("home.featuresGridStarDescription"),
    },
    {
      icon: Import,
      title: t("home.featuresGridImportTitle"),
      description: t("home.featuresGridImportDescription"),
    },
    {
      icon: Share2,
      title: t("home.featuresGridShareTitle"),
      description: t("home.featuresGridShareDescription"),
    },
    {
      icon: Shield,
      title: t("home.featuresGridShieldTitle"),
      description: t("home.featuresGridShieldDescription"),
    },
  ];

  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground">
          {t("home.featuresGridTitle")}
        </h2>
        <p className="text-muted-foreground mt-1 mb-6">
          {t("home.featuresGridSubtitle")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group p-6 transition bg-card/90 hover:bg-card hover:shadow-md"
              aria-label={`${title} — ${description}`}
            >
              <div className="flex flex-row items-start gap-4 mb-2">
                <span className="inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-lg bg-muted/70">
                  <Icon className="w-5 h-5 text-muted-foreground transition group-hover:text-primary" />
                </span>
                <div>
                  <h3 className="font-medium text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
