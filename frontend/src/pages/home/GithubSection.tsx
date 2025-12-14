import { type FC } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import GithubIcon from "@/assets/icons/github.svg?react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const GithubSection: FC = () => {
  const { t } = useLanguage();
  const GITHUB_REPOSITORY_URL = import.meta.env.VITE_GITHUB_REPOSITORY_URL;

  if (!GITHUB_REPOSITORY_URL) return null;

  return (
    <section className="px-6 py-12">
      <Card className="max-w-2xl mx-auto text-center shadow-xl p-10 gap-0">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-transparent">
          <GithubIcon className="h-16 w-16 text-foreground" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground">
          {t("home.githubSectionTitle")}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {t("home.githubSectionDescription")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="default"
            className="hover:cursor-pointer"
            onClick={() => window.open(GITHUB_REPOSITORY_URL, "_blank")}
          >
            {t("button.viewOnGitHub")}
          </Button>
        </div>
      </Card>
    </section>
  );
};
