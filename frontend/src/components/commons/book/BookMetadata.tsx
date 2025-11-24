import { type FC } from "react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Detail } from "./Detail";
import { SectionTitle } from "./SectionTitle";
import { useLanguage } from "../../../hooks/useLanguage";
import {
  GENRE_OPTIONS,
  LANGUAGE_OPTIONS,
  type Book,
} from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";
import type { BookForm } from "../../../validation/bookFormSchema";

interface BookMetadataProps {
  book: Partial<Book>;
  mode: BookPageMode;
  register: UseFormRegister<BookForm>;
  errors: FieldErrors<BookForm>;
}

export const BookMetadata: FC<BookMetadataProps> = ({
  book,
  mode,
  register,
  errors,
}) => {
  const { t } = useLanguage();

  return (
    <section>
      <SectionTitle>{t("bookPage.bookMetadata")}</SectionTitle>

      <div
        className={`grid grid-cols-2 ${mode === "view" ? "gap-y-3" : "gap-y-1"} gap-x-10 mt-6 mb-10 text-sm`}
      >
        <Detail
          label={t("bookPage.genre")}
          value={book.genre}
          mode={mode}
          type="select"
          options={GENRE_OPTIONS}
          error={errors.genre?.message}
          register={register("genre")}
        />
        <Detail
          label={t("bookPage.pages")}
          value={book.pages}
          mode={mode}
          type="number"
          placeholder={t("placeholders.enterPages")}
          error={errors.pages?.message}
          register={register("pages", { valueAsNumber: true })}
        />
        <Detail
          label={t("bookPage.publisher")}
          value={book.publisher}
          mode={mode}
          type="text"
          placeholder={t("placeholders.enterPublisherName")}
          error={errors.publisher?.message}
          register={register("publisher")}
        />
        <Detail
          label={t("bookPage.published")}
          value={book.publishedDate}
          mode={mode}
          type="date"
          error={errors.publishedDate?.message}
          register={register("publishedDate")}
        />
        <Detail
          label={t("bookPage.language")}
          value={book.language}
          mode={mode}
          type="select"
          options={LANGUAGE_OPTIONS}
          error={errors.language?.message}
          register={register("language")}
        />
        <Detail
          label={t("bookPage.isbn13")}
          value={book.isbn13}
          mode={mode}
          type="number"
          placeholder={t("placeholders.enterIsbn13")}
          error={errors.isbn13?.message}
          register={register("isbn13")}
          clampNumberToInt32={false}
        />
      </div>
    </section>
  );
};
