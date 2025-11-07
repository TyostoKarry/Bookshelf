import { type Dispatch, type FC, type SetStateAction } from "react";
import { Detail } from "./Detail";
import { SectionTitle } from "./SectionTitle";
import { useLanguage } from "../../../hooks/useLanguage";
import {
  type Book,
  GENRE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";

interface BookMetadataProps {
  book: Partial<Book>;
  mode: BookPageMode;
  onChange: (key: keyof Book, value: string | number | boolean | null) => void;
  fieldErrors: { [key in keyof Book]?: boolean };
  setFieldErrors: Dispatch<SetStateAction<{ [key in keyof Book]?: boolean }>>;
}

export const BookMetadata: FC<BookMetadataProps> = ({
  book,
  mode,
  onChange,
  fieldErrors,
  setFieldErrors,
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
          onChange={(value) => onChange("genre", value)}
        />
        <Detail
          label={t("bookPage.pages")}
          value={book.pages}
          mode={mode}
          type="number"
          onChange={(value) => onChange("pages", value)}
          placeholder={t("placeholders.enterPages")}
          fieldError={fieldErrors.pages}
          onFocus={() => {
            setFieldErrors((prev) => ({ ...prev, pages: false }));
          }}
        />
        <Detail
          label={t("bookPage.publisher")}
          value={book.publisher}
          mode={mode}
          type="text"
          onChange={(value) => onChange("publisher", value)}
          placeholder={t("placeholders.enterPublisherName")}
          fieldError={fieldErrors.publisher}
          onFocus={() => {
            setFieldErrors((prev) => ({ ...prev, publisher: false }));
          }}
        />
        <Detail
          label={t("bookPage.published")}
          value={book.publishedDate}
          mode={mode}
          type="date"
          onChange={(value) => onChange("publishedDate", value)}
        />
        <Detail
          label={t("bookPage.language")}
          value={book.language}
          mode={mode}
          type="select"
          options={LANGUAGE_OPTIONS}
          onChange={(value) => onChange("language", value)}
        />
        <Detail
          label={t("bookPage.isbn13")}
          value={book.isbn13}
          mode={mode}
          type="text"
          onChange={(value) => onChange("isbn13", value)}
          placeholder={t("placeholders.enterIsbn13")}
          fieldError={fieldErrors.isbn13}
          onFocus={() => {
            setFieldErrors((prev) => ({ ...prev, isbn13: false }));
          }}
        />
      </div>
    </section>
  );
};
