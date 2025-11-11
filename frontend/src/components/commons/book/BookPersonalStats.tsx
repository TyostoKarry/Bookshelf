import { type Dispatch, type FC, type SetStateAction } from "react";
import { Detail } from "./Detail";
import { SectionTitle } from "./SectionTitle";
import { StarRating } from "./StarRating";
import NotFavoriteIcon from "../../../assets/icons/star-empty.svg?react";
import FavoriteIcon from "../../../assets/icons/star-full.svg?react";
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
      <div className="flex items-center justify-between border-b border-gray-100 pb-1">
        <label className="flex-1 items-center text-gray-600 text-sm">
          {t("bookPage.rating")}
        </label>
        <StarRating
          rating={book.rating ?? 0}
          mode={mode}
          onChange={(value) => onChange("rating", Math.round(value))}
        />
      </div>
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
