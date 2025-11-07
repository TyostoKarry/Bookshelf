import { type Dispatch, type FC, type SetStateAction } from "react";
import { Detail } from "./Detail";
import { SectionTitle } from "./SectionTitle";
import FavoriteIcon from "../../../assets/icons/favorite.svg?react";
import NotFavoriteIcon from "../../../assets/icons/notFavorite.svg?react";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";

interface BookPersonalStatsProps {
  book: Partial<Book>;
  mode: BookPageMode;
  onChange: (key: keyof Book, value: string | number | boolean | null) => void;
  fieldErrors: { [key in keyof Book]?: boolean };
  setFieldErrors: Dispatch<SetStateAction<{ [key in keyof Book]?: boolean }>>;
}

export const BookPersonalStats: FC<BookPersonalStatsProps> = ({
  book,
  mode,
  onChange,
  fieldErrors,
  setFieldErrors,
}) => {
  const { t } = useLanguage();

  return (
    <section className="space-y-3">
      <SectionTitle>{t("bookPage.personalStats")}</SectionTitle>
      <Detail
        label={t("bookPage.rating")}
        value={book.rating}
        mode={mode}
        type="number"
        onChange={(value) => onChange("rating", value)}
        placeholder={t("placeholders.enterRating")}
        maxNumber={10}
        fieldError={fieldErrors.rating}
        onFocus={() => {
          setFieldErrors((prev) => ({ ...prev, rating: false }));
        }}
      />
      <Detail
        label={t("bookPage.readCount")}
        value={book.readCount}
        mode={mode}
        type="number"
        onChange={(value) => onChange("readCount", value)}
        placeholder={t("placeholders.enterReadCount")}
        fieldError={fieldErrors.readCount}
        onFocus={() => {
          setFieldErrors((prev) => ({ ...prev, readCount: false }));
        }}
      />
      <Detail
        label={t("bookPage.favorite")}
        value={book.favorite}
        mode={mode}
        type="toggle"
        options={[
          {
            value: true,
            label: (
              <div className="flex items-center gap-1">
                <FavoriteIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-800">{t("common.yes")}</span>
              </div>
            ),
          },
          {
            value: false,
            label: (
              <div className="flex items-center gap-1">
                <NotFavoriteIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{t("common.no")}</span>
              </div>
            ),
          },
        ]}
        onChange={(value) => onChange("favorite", value)}
      />
    </section>
  );
};
