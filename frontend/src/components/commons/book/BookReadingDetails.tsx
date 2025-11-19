import { type FC } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Detail } from "./Detail";
import { SectionTitle } from "./SectionTitle";
import { useLanguage } from "../../../hooks/useLanguage";
import { BOOK_STATUS_OPTIONS, type Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";
import type { BookForm } from "../../../validation/bookFormSchema";

interface BookReadingDetailsProps {
  book: Partial<Book>;
  mode: BookPageMode;
  register: UseFormRegister<BookForm>;
  errors: FieldErrors<BookForm>;
}

export const BookReadingDetails: FC<BookReadingDetailsProps> = ({
  book,
  mode,
  register,
  errors,
}) => {
  const { t } = useLanguage();

  return (
    <section className="space-y-3">
      <SectionTitle>{t("bookPage.readingDetails")}</SectionTitle>
      <Detail
        label={t("bookPage.status")}
        value={book.status}
        mode={mode}
        type="select"
        options={BOOK_STATUS_OPTIONS}
        error={errors.status?.message}
        register={register("status")}
      />
      <Detail
        label={t("bookPage.progress")}
        value={book.progress}
        mode={mode}
        type="number"
        placeholder={t("placeholders.enterProgress")}
        error={errors.progress?.message}
        register={register("progress", { valueAsNumber: true })}
      />
      <Detail
        label={t("bookPage.startedAt")}
        value={book.startedAt}
        mode={mode}
        type="date"
        error={errors.startedAt?.message}
        register={register("startedAt")}
      />
      <Detail
        label={t("bookPage.finishedAt")}
        value={book.finishedAt}
        mode={mode}
        type="date"
        error={errors.finishedAt?.message}
        register={register("finishedAt")}
      />
    </section>
  );
};
