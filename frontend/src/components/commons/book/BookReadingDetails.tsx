import { type Dispatch, type FC, type SetStateAction } from "react";
import { Detail } from "./Detail";
import { SectionTitle } from "./SectionTitle";
import { useLanguage } from "../../../hooks/useLanguage";
import { BOOK_STATUS_OPTIONS, type Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";

interface BookReadingDetailsProps {
  book: Partial<Book>;
  mode: BookPageMode;
  onChange: (key: keyof Book, value: string | number | boolean | null) => void;
  fieldErrors: { [key in keyof Book]?: boolean };
  setFieldErrors: Dispatch<SetStateAction<{ [key in keyof Book]?: boolean }>>;
}

export const BookReadingDetails: FC<BookReadingDetailsProps> = ({
  book,
  mode,
  onChange,
  fieldErrors,
  setFieldErrors,
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
        onChange={(value) => onChange("status", value)}
      />
      <Detail
        label={t("bookPage.progress")}
        value={book.progress}
        mode={mode}
        type="number"
        onChange={(value) => onChange("progress", value)}
        placeholder={t("placeholders.enterProgress")}
        fieldError={fieldErrors.progress}
        onFocus={() => {
          setFieldErrors((prev) => ({ ...prev, progress: false }));
        }}
      />
      <Detail
        label={t("bookPage.startedAt")}
        value={book.startedAt}
        mode={mode}
        type="date"
        onChange={(value) => onChange("startedAt", value)}
      />
      <Detail
        label={t("bookPage.finishedAt")}
        value={book.finishedAt}
        mode={mode}
        type="date"
        onChange={(value) => onChange("finishedAt", value)}
      />
    </section>
  );
};
