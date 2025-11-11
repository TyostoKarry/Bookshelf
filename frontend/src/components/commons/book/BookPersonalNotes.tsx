import { type FC } from "react";
import { SectionTitle } from "./SectionTitle";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";

interface BookPersonalNotesProps {
  book: Partial<Book>;
  mode: BookPageMode;
  onChange: (key: keyof Book, value: string | null) => void;
}

export const BookPersonalNotes: FC<BookPersonalNotesProps> = ({
  book,
  mode,
  onChange,
}) => {
  const { t } = useLanguage();

  return (
    <section>
      <SectionTitle>{t("bookPage.personalNotes")}</SectionTitle>
      {mode === "view" ? (
        book.notes ? (
          <p className="text-gray-800 leading-relaxed min-h-[6rem] pt-3">
            {book.notes}
          </p>
        ) : (
          <p className="italic text-gray-400 min-h-[6rem] flex items-center">
            {t("bookPage.noNotes")}
          </p>
        )
      ) : (
        <textarea
          className="w-full min-h-[12rem] border border-gray-300 rounded-md p-2 mt-3 resize-y"
          value={book.notes || ""}
          placeholder={t("placeholders.enterPersonalNotes")}
          onChange={(ChangeEvent) =>
            onChange("notes", ChangeEvent.target.value)
          }
        />
      )}
    </section>
  );
};
