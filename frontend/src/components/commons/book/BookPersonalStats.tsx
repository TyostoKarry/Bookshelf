import { type FC } from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
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
  register: UseFormRegister<BookForm>;
  control: Control<BookForm>;
  errors: FieldErrors<BookForm>;
}

export const BookPersonalStats: FC<BookPersonalStatsProps> = ({
  book,
  mode,
  register,
  control,
  errors,
}) => {
  const { t } = useLanguage();

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
        register={register("readCount", { valueAsNumber: true })}
        error={errors.readCount?.message}
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
