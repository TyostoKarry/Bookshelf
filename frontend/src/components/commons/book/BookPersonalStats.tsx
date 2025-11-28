import { type FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Detail } from "./Detail";
import { FavoriteToggle } from "./FavoriteToggle";
import { SectionTitle } from "./SectionTitle";
import { StarRating } from "./StarRating";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";
import type { BookForm } from "../../../validation/bookFormSchema";

interface BookPersonalStatsProps {
  book: Partial<Book>;
  mode: BookPageMode;
  form: UseFormReturn<BookForm>;
}

export const BookPersonalStats: FC<BookPersonalStatsProps> = ({
  book,
  mode,
  form,
}) => {
  const { t } = useLanguage();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <section className="space-y-3">
      <SectionTitle>{t("bookPage.personalStats")}</SectionTitle>
      <StarRating
        control={control}
        mode={mode}
        value={book.rating}
        label={t("bookPage.rating")}
        error={errors.rating?.message}
      />
      <Detail
        label={t("bookPage.readCount")}
        value={book.readCount}
        mode={mode}
        type="number"
        placeholder={t("placeholders.enterReadCount")}
        control={control}
        controlName="readCount"
        error={errors.readCount?.message}
        defaultValue={0}
      />
      <FavoriteToggle
        control={control}
        error={errors.favorite?.message}
        mode={mode}
        label={t("bookPage.favorite")}
        value={book.favorite}
      />
    </section>
  );
};
