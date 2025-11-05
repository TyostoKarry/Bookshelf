import { type FC } from "react";
import { Detail } from "./Detail";
import { SectionTitle } from "./SectionTitle";
import FavoriteIcon from "../../../assets/icons/favorite.svg?react";
import NotFavoriteIcon from "../../../assets/icons/notFavorite.svg?react";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";

interface BookPersonalStatsProps {
  book: Partial<Book>;
}

export const BookPersonalStats: FC<BookPersonalStatsProps> = ({ book }) => {
  const { t } = useLanguage();

  return (
    <section className="space-y-3">
      <SectionTitle>{t("bookPage.personalStats")}</SectionTitle>
      <Detail
        label={t("bookPage.rating")}
        value={book.rating != null ? `${book.rating}/10` : "—"}
      />
      <Detail
        label={t("bookPage.readCount")}
        value={book.readCount?.toString()}
      />
      <Detail
        label={t("bookPage.favorite")}
        value={
          book.favorite ? (
            <div className="flex items-center gap-1">
              <FavoriteIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-800">{t("common.yes")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <NotFavoriteIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{t("common.no")}</span>
            </div>
          )
        }
      />
    </section>
  );
};
