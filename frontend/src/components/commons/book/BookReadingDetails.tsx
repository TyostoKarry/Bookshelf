import { type FC } from "react";
import { Detail } from "./Detail";
import { SectionTitle } from "./SectionTitle";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";

interface BookReadingDetailsProps {
  book: Partial<Book>;
}

export const BookReadingDetails: FC<BookReadingDetailsProps> = ({ book }) => {
  const { t } = useLanguage();

  return (
    <section className="space-y-3">
      <SectionTitle>{t("bookPage.readingDetails")}</SectionTitle>
      <Detail label={t("bookPage.status")} value={book.status} />
      <Detail
        label={t("bookPage.progress")}
        value={book.progress?.toString()}
      />
      <Detail label={t("bookPage.startedAt")} value={book.startedAt} />
      <Detail label={t("bookPage.finishedAt")} value={book.finishedAt} />
    </section>
  );
};
