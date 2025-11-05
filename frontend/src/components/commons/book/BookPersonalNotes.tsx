import { type FC } from "react";
import { SectionTitle } from "./SectionTitle";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";

interface BookPersonalNotesProps {
  book: Partial<Book>;
}

export const BookPersonalNotes: FC<BookPersonalNotesProps> = ({ book }) => {
  const { t } = useLanguage();

  return (
    <section>
      <SectionTitle>{t("bookPage.personalNotes")}</SectionTitle>
      {book.notes ? (
        <p className="text-gray-800 leading-relaxed min-h-[6rem] pt-3">
          {book.notes}
        </p>
      ) : (
        <p className="italic text-gray-400 min-h-[6rem] flex items-center">
          {t("bookPage.noNotes")}
        </p>
      )}
    </section>
  );
};
